package pfe.signaturenumerique.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pfe.signaturenumerique.dto.SignatureRequest;
import pfe.signaturenumerique.dto.VerificationRequest;
import pfe.signaturenumerique.modele.Utilisateur;
import pfe.signaturenumerique.repository.UtilisateurRepository; // <--- AJOUTÉ
import pfe.signaturenumerique.service.SignatureService;
import pfe.signaturenumerique.service.KeyService;
import pfe.signaturenumerique.service.AuditService;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Map;

@RestController
@RequestMapping("/api/signature")
@CrossOrigin(origins = "http://localhost:3000")
public class SignatureController {

    private final SignatureService signatureService;
    private final KeyService keyService;
    private final AuditService auditService;
    private final UtilisateurRepository utilisateurRepository; // <--- AJOUTÉ

    // Mise à jour du constructeur pour inclure le repository
    public SignatureController(
            SignatureService signatureService,
            KeyService keyService,
            AuditService auditService,
            UtilisateurRepository utilisateurRepository) { // <--- AJOUTÉ
        this.signatureService = signatureService;
        this.keyService = keyService;
        this.auditService = auditService;
        this.utilisateurRepository = utilisateurRepository; // <--- AJOUTÉ
    }

    @PostMapping("/signer")
    public ResponseEntity<?> effectuerSignature(@RequestBody SignatureRequest request) {
        try {
            PrivateKey privateKey = keyService.getPrivateKeyForUser(request.getUserId());
            String signatureBase64 = signatureService.signerLeHash(request.getHash(), privateKey);
            auditService.logSignature(request.getUserId(), request.getFileName(), signatureBase64);

            return ResponseEntity.ok(new SignatureResponse(signatureBase64));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/verifier")
    public ResponseEntity<?> verifierSignature(@RequestBody VerificationRequest request) {
        try {
            // Maintenant utilisateurRepository est reconnu car déclaré plus haut
            Utilisateur utilisateur = utilisateurRepository.findById(request.getUtilisateurId())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            PublicKey publicKey = signatureService.getPublicKeyFromString(utilisateur.getClePublique());

            boolean estValide = signatureService.verifierSignature(
                    request.getHash(),
                    request.getSignature(),
                    publicKey
            );

            if (estValide) {
                return ResponseEntity.ok(Map.of(
                        "message", "La signature est authentique et le document est intègre.",
                        "valide", true
                ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "message", "Attention : Signature invalide ou document modifié !",
                                "valide", false
                        ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la vérification : " + e.getMessage()));
        }
    }
}