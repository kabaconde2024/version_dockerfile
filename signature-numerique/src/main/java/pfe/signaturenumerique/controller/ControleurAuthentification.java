package pfe.signaturenumerique.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pfe.signaturenumerique.dto.GoogleLoginRequest;
import pfe.signaturenumerique.dto.ReponseAuthentification;
import pfe.signaturenumerique.dto.RequeteConnexion;
import pfe.signaturenumerique.dto.RequeteInscription;
import pfe.signaturenumerique.service.ServiceAuthentification;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ControleurAuthentification {

    private final ServiceAuthentification serviceAuthentification;

    public ControleurAuthentification(ServiceAuthentification serviceAuthentification) {
        this.serviceAuthentification = serviceAuthentification;
    }

    @PostMapping("/inscription")
    public ResponseEntity<?> inscription(@Valid @RequestBody RequeteInscription requete) {
        try {
            serviceAuthentification.inscrire(requete);
            return ResponseEntity.ok(Map.of(
                    "succes", true,
                    "message", "Inscription réussie. Vous pouvez maintenant vous connecter."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "succes", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@Valid @RequestBody RequeteConnexion requete) {
        try {
            return ResponseEntity.ok(serviceAuthentification.connecter(requete));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "succes", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleConnection(@RequestBody GoogleLoginRequest request) {
        try {
            ReponseAuthentification reponse = serviceAuthentification.connecterAvecGoogle(request.getToken());
            return ResponseEntity.ok(reponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "succes", false,
                    "message", "Erreur Google : " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verifier-mfa")
    public ResponseEntity<?> verifierMfa(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String code = body.get("code");
            return ResponseEntity.ok(serviceAuthentification.verifierMfa(email, code));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "succes", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/renvoyer-code-mfa")
    public ResponseEntity<?> renvoyerCodeMfa(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            return ResponseEntity.ok(serviceAuthentification.renvoyerCodeMfa(email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "succes", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/mot-de-passe-oublie")
    public ResponseEntity<?> motDePasseOublie(@RequestParam String email) {
        try {
            serviceAuthentification.traiterMotDePasseOublie(email);
            return ResponseEntity.ok().body(Map.of("message", "Lien de réinitialisation envoyé"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reinitialiser")
    public ResponseEntity<?> reinitialiser(@RequestParam String token, @RequestBody Map<String, String> body) {
        try {
            String nouveauMdp = body.get("nouveauMdp");

            if (nouveauMdp == null || nouveauMdp.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le mot de passe est requis");
            }

            if (nouveauMdp.length() < 6) {
                return ResponseEntity.badRequest().body("Le mot de passe doit contenir au moins 6 caractères");
            }

            serviceAuthentification.changerMotDePasse(token, nouveauMdp);
            return ResponseEntity.ok().body(Map.of("message", "Mot de passe mis à jour avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne du serveur");
        }
    }
}