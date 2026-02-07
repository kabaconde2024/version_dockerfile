package pfe.signaturenumerique.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pfe.signaturenumerique.dto.SignatureRequest;
import pfe.signaturenumerique.modele.SignatureLog;
import pfe.signaturenumerique.modele.Utilisateur;
import pfe.signaturenumerique.repository.SignatureLogRepository;
import pfe.signaturenumerique.repository.UtilisateurRepository;
import pfe.signaturenumerique.service.EmailService;
import pfe.signaturenumerique.service.SignatureService;
import pfe.signaturenumerique.service.KeyService;

import java.security.PrivateKey;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/signature")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://signature-frontend-1s7s.onrender.com"
})
public class SignatureController {

    private final SignatureService signatureService;
    private final KeyService keyService;
    private final UtilisateurRepository utilisateurRepository;
    private final SignatureLogRepository signatureLogRepository;
    private final EmailService emailService;

    public SignatureController(
            SignatureService signatureService,
            KeyService keyService,
            UtilisateurRepository utilisateurRepository,
            SignatureLogRepository signatureLogRepository,
            EmailService emailService) {
        this.signatureService = signatureService;
        this.keyService = keyService;
        this.utilisateurRepository = utilisateurRepository;
        this.signatureLogRepository = signatureLogRepository;
        this.emailService = emailService;
    }

    @PostMapping("/signer")
    public ResponseEntity<?> effectuerSignatureComplete(@RequestBody SignatureRequest request) {
        try {
            // 1. Signature
            PrivateKey privateKey = keyService.getPrivateKeyForUser(request.getUserId());
            String signatureBase64 = signatureService.signerLeHash(request.getHash(), privateKey);

            // 2. Horodatage (TSA)
            String tsaToken = signatureService.genererHorodatage(signatureBase64);

            // 3. Validation
            boolean caValide = signatureService.validerChaineCertificat(request.getUserId());
            if (!caValide) return ResponseEntity.status(403).body(Map.of(
                    "succes", false,
                    "message", "Certificat non valide"
            ));

            // 4. Décodage du contenu du fichier reçu du Frontend
            byte[] fileContent = null;
            if (request.getFileBase64() != null) {
                fileContent = Base64.getDecoder().decode(request.getFileBase64());
            }

            // 5. Archivage
            signatureService.archiverPreuves(
                    request.getUserId(),
                    request.getFileName(),
                    request.getHash(),
                    signatureBase64,
                    tsaToken,
                    fileContent
            );

            return ResponseEntity.ok(Map.of(
                    "succes", true,
                    "status", "ARCHIVÉ",
                    "signature", signatureBase64
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "succes", false,
                    "message", "Erreur : " + e.getMessage()
            ));
        }
    }

    @GetMapping("/telecharger/{id}")
    public ResponseEntity<byte[]> telechargerDocument(@PathVariable String id) {
        try {
            Optional<SignatureLog> docOptional = signatureLogRepository.findById(id);
            if (docOptional.isEmpty() || docOptional.get().getFileContent() == null) {
                return ResponseEntity.notFound().build();
            }

            SignatureLog doc = docOptional.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(doc.getFileContent());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/historique/{userId}")
    public ResponseEntity<?> obtenirHistorique(@PathVariable Long userId) {
        try {
            // 1. Récupérer l'utilisateur pour avoir son email
            Utilisateur user = utilisateurRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // 2. Chercher les documents personnels ET les documents partagés avec lui
            List<SignatureLog> docs = signatureLogRepository.findByUserIdOrSharedWithEmails(userId, user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "succes", true,
                    "documents", docs
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "succes", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/inviter")
    public ResponseEntity<?> inviterUtilisateur(@RequestBody Map<String, String> request) {
        try {
            String guestEmail = request.get("email");
            String documentId = request.get("documentId");

            if (guestEmail == null || guestEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "succes", false,
                        "message", "L'email est requis"
                ));
            }

            if (documentId == null || documentId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "succes", false,
                        "message", "L'ID du document est requis"
                ));
            }

            Optional<SignatureLog> docOptional = signatureLogRepository.findById(documentId);
            if (docOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "succes", false,
                        "message", "Document non trouvé"
                ));
            }

            SignatureLog doc = docOptional.get();

            // 1. Ajouter l'email à la liste de partage si pas déjà présent
            if (!doc.getSharedWithEmails().contains(guestEmail)) {
                doc.getSharedWithEmails().add(guestEmail);
                signatureLogRepository.save(doc);
            }

            // 2. Envoyer l'email via Resend
            String sujet = "Document partagé : " + doc.getFileName();
            String contenu = "Bonjour,\n\nLe document \"" + doc.getFileName() + "\" a été partagé avec vous.\n" +
                    "Vous pouvez maintenant le consulter dans votre espace Signature Numérique.\n\n" +
                    "Cordialement,\nL'équipe Signature Numérique";

            emailService.envoyerEmail(guestEmail, sujet, contenu);

            return ResponseEntity.ok(Map.of(
                    "succes", true,
                    "message", "Accès accordé à " + guestEmail
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "succes", false,
                    "message", "Erreur lors du partage: " + e.getMessage()
            ));
        }
    }
}