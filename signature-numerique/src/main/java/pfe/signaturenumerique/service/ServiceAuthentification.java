package pfe.signaturenumerique.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pfe.signaturenumerique.modele.RoleUtilisateur;
import pfe.signaturenumerique.modele.Utilisateur;
import pfe.signaturenumerique.repository.UtilisateurRepository;
import pfe.signaturenumerique.dto.RequeteInscription;
import pfe.signaturenumerique.dto.RequeteConnexion;
import pfe.signaturenumerique.dto.ReponseAuthentification;
import pfe.signaturenumerique.configuration.JwtUtils;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class ServiceAuthentification {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final Random random = new Random();

    @Value("${google.client.id}")
    private String googleClientId;

    public ServiceAuthentification(UtilisateurRepository utilisateurRepository,
                                   PasswordEncoder passwordEncoder,
                                   JwtUtils jwtUtils,
                                   EmailService emailService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.emailService = emailService;
    }

    @Transactional
    public Utilisateur inscrire(RequeteInscription requete) {
        // Vérification si l'email existe déjà pour éviter une erreur SQL brutale
        if (utilisateurRepository.findByEmail(requete.getEmail()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé par un autre compte.");
        }

        Utilisateur utilisateur = new Utilisateur();

        // Informations de base
        utilisateur.setEmail(requete.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(requete.getMotDePasse()));
        utilisateur.setPrenom(requete.getPrenom());
        utilisateur.setNom(requete.getNom());
        utilisateur.setCin(requete.getCin());
        utilisateur.setTelephone(requete.getTelephone());

        // Coordonnées et détails personnels
        utilisateur.setCivilite(requete.getCivilite());
        utilisateur.setDateNaissance(requete.getDateNaissance());
        utilisateur.setAdresse(requete.getAdresse());
        utilisateur.setVille(requete.getVille());
        utilisateur.setCodePostal(requete.getCodePostal());

        // Paramètres système par défaut
        utilisateur.setMfaActive(true);
        utilisateur.setActive(true);
        utilisateur.setProvider("LOCAL");

        // Note: Les colonnes publicKeyStr et privateKeyStr restent nulles à l'inscription
        // Elles seront remplies lors de la génération des clés de signature.
        utilisateur.getRoles().add(RoleUtilisateur.ROLE_UTILISATEUR);
        return utilisateurRepository.save(utilisateur);
    }

    public ReponseAuthentification connecter(RequeteConnexion requete) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(requete.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(requete.getMotDePasse(), utilisateur.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        if (utilisateur.isMfaActive()) {
            String codeMfa = genererCodeMfa();
            utilisateur.setCodeMfa(codeMfa);
            utilisateur.setExpirationCodeMfa(LocalDateTime.now().plusMinutes(10));
            utilisateurRepository.save(utilisateur);

            try {
                emailService.envoyerCodeMfa(utilisateur.getEmail(), codeMfa);
            } catch (Exception e) {
                System.err.println("Erreur d'envoi d'email : " + e.getMessage());
                throw new RuntimeException("Erreur technique lors de l'envoi du code de vérification");
            }

            ReponseAuthentification reponseMfa = new ReponseAuthentification();
            reponseMfa.setSucces(true);
            reponseMfa.setMessage("Un code de sécurité a été envoyé à votre email");
            reponseMfa.setNecessiteMfa(true);
            reponseMfa.setEmail(utilisateur.getEmail());
            return reponseMfa;
        }

        String token = jwtUtils.generateToken(utilisateur);
        return construireReponseSucces(utilisateur, token);
    }

    public ReponseAuthentification connecterAvecGoogle(String tokenId) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        GoogleIdToken idToken = verifier.verify(tokenId);
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String nom = (String) payload.get("family_name");
            String prenom = (String) payload.get("given_name");

            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseGet(() -> {
                        Utilisateur nouveau = new Utilisateur();
                        nouveau.setEmail(email);
                        nouveau.setNom(nom != null ? nom : "");
                        nouveau.setPrenom(prenom != null ? prenom : "");
                        nouveau.setProvider("GOOGLE");
                        nouveau.setActive(true);
                        nouveau.setMfaActive(false);
                        return utilisateurRepository.save(nouveau);
                    });

            String token = jwtUtils.generateToken(utilisateur);
            return construireReponseSucces(utilisateur, token);
        } else {
            throw new RuntimeException("Authentification Google échouée : Token invalide");
        }
    }

    public ReponseAuthentification renvoyerCodeMfa(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String nouveauCode = genererCodeMfa();
        utilisateur.setCodeMfa(nouveauCode);
        utilisateur.setExpirationCodeMfa(LocalDateTime.now().plusMinutes(10));
        utilisateurRepository.save(utilisateur);

        try {
            emailService.envoyerCodeMfa(utilisateur.getEmail(), nouveauCode);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi du nouveau code");
        }

        ReponseAuthentification reponse = new ReponseAuthentification();
        reponse.setSucces(true);
        reponse.setMessage("Un nouveau code a été envoyé");
        return reponse;
    }

    public ReponseAuthentification verifierMfa(String email, String code) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (utilisateur.getCodeMfa() == null || !utilisateur.getCodeMfa().equals(code)) {
            throw new RuntimeException("Code de vérification invalide");
        }

        if (utilisateur.getExpirationCodeMfa() != null &&
                utilisateur.getExpirationCodeMfa().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expiré. Veuillez en demander un nouveau.");
        }

        utilisateur.setCodeMfa(null);
        utilisateur.setExpirationCodeMfa(null);
        utilisateurRepository.save(utilisateur);

        String token = jwtUtils.generateToken(utilisateur);
        return construireReponseSucces(utilisateur, token);
    }

    public void traiterMotDePasseOublie(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Aucun compte associé à cet email"));

        String token = UUID.randomUUID().toString();
        utilisateur.setCodeMfa(token);
        utilisateur.setExpirationCodeMfa(LocalDateTime.now().plusHours(1));
        utilisateurRepository.save(utilisateur);

        // Ajustez l'URL selon votre environnement (localhost ou Render)
        String lien = "https://signature-numerique-frontend.onrender.com/reinitialiser-password?token=" + token;
        emailService.envoyerLienReinitialisation(email, lien);
    }

    public void changerMotDePasse(String token, String nouveauMdp) {
        Utilisateur utilisateur = utilisateurRepository.findByCodeMfa(token)
                .orElseThrow(() -> new RuntimeException("Lien de réinitialisation invalide ou expiré"));

        if (utilisateur.getExpirationCodeMfa().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le lien a expiré");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(nouveauMdp));
        utilisateur.setCodeMfa(null);
        utilisateur.setExpirationCodeMfa(null);
        utilisateurRepository.save(utilisateur);
    }

    private String genererCodeMfa() {
        return String.format("%06d", random.nextInt(1000000));
    }

    private ReponseAuthentification construireReponseSucces(Utilisateur u, String token) {
        ReponseAuthentification reponse = new ReponseAuthentification();
        reponse.setSucces(true);
        reponse.setTokenAcces(token);

        ReponseAuthentification.UtilisateurDto dto = new ReponseAuthentification.UtilisateurDto();
        dto.setId(u.getId()); // Crucial pour le frontend
        dto.setEmail(u.getEmail());
        dto.setPrenom(u.getPrenom());
        dto.setNom(u.getNom());

        if (u.getRoles() != null) {
            dto.setRoles(u.getRoles().stream().map(Enum::name).collect(Collectors.toSet()));
        }
        reponse.setUtilisateur(dto);

        return reponse;
    }
}