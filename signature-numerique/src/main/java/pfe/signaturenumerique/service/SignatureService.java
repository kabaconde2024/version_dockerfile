package pfe.signaturenumerique.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pfe.signaturenumerique.modele.SignatureLog;
import pfe.signaturenumerique.modele.Utilisateur;
import pfe.signaturenumerique.repository.UtilisateurRepository;
import pfe.signaturenumerique.repository.SignatureLogRepository;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class SignatureService {

    @Autowired
    private UtilisateurRepository userRepo;

    @Autowired
    private SignatureLogRepository mongoRepo;

    // --- MÉTHODE DE SIGNATURE ---
    public String signerDocument(Long userId, String fileHash, String fileName) throws Exception {
        Utilisateur user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        PrivateKey privKey = getPrivateKeyFromString(user.getPrivateKeyStr());
        String signatureBase64 = signerLeHash(fileHash, privKey);

        // Audit Log MongoDB
        SignatureLog log = new SignatureLog();
        log.setUserId(userId);
        log.setAction("SIGNATURE_DOCUMENT");
        log.setFileName(fileName);
        log.setHash(fileHash);
        log.setTimestamp(LocalDateTime.now().toString());
        mongoRepo.save(log);

        return signatureBase64;
    }

    // --- LA MÉTHODE QUI MANQUAIT (VÉRIFICATION) ---
    public boolean verifierSignature(String hashHex, String signatureBase64, PublicKey publicKey) throws Exception {
        byte[] hashBytes = hexStringToByteArray(hashHex);
        byte[] signatureBytes = Base64.getDecoder().decode(signatureBase64);

        Signature publicSignature = Signature.getInstance("SHA256withRSA");
        publicSignature.initVerify(publicKey);
        publicSignature.update(hashBytes);

        return publicSignature.verify(signatureBytes);
    }

    // --- UTILITAIRES DE CONVERSION ---

    public String signerLeHash(String hashHex, PrivateKey privateKey) throws Exception {
        byte[] hashBytes = hexStringToByteArray(hashHex);
        Signature privateSignature = Signature.getInstance("SHA256withRSA");
        privateSignature.initSign(privateKey);
        privateSignature.update(hashBytes);
        return Base64.getEncoder().encodeToString(privateSignature.sign());
    }

    public PrivateKey getPrivateKeyFromString(String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    public PublicKey getPublicKeyFromString(String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    private byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;


    }
}