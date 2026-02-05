package pfe.signaturenumerique.service;

import org.springframework.stereotype.Service;
import pfe.signaturenumerique.modele.SignatureLog;
import pfe.signaturenumerique.repository.SignatureLogRepository;

import java.time.LocalDateTime;

@Service
public class AuditService {

    private final SignatureLogRepository mongoRepo;

    public AuditService(SignatureLogRepository mongoRepo) {
        this.mongoRepo = mongoRepo;
    }

    public void logSignature(Long userId, String fileName, String signatureBase64) {
        // Créer un log
        SignatureLog log = new SignatureLog();
        log.setUserId(userId);
        log.setAction("SIGNATURE_DOCUMENT");
        log.setFileName(fileName);
        log.setHash(signatureBase64); // si tu veux stocker la signature
        log.setTimestamp(LocalDateTime.now().toString());

        // Sauvegarder dans MongoDB
        mongoRepo.save(log);

        System.out.println("Log sauvegardé dans MongoDB pour l'utilisateur " + userId);
    }
}
