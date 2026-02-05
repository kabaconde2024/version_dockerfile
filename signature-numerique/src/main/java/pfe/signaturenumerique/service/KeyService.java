package pfe.signaturenumerique.service;

import org.springframework.stereotype.Service;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class KeyService {

    // Simulation d'un stockage de clés en mémoire
    private Map<Long, PrivateKey> userKeys = new HashMap<>();

    public PrivateKey getPrivateKeyForUser(Long userId) throws Exception {
        // Si l'utilisateur n'a pas de clé, on en génère une (pour le test)
        if (!userKeys.containsKey(userId)) {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair pair = keyGen.generateKeyPair();
            userKeys.put(userId, pair.getPrivate());
        }
        return userKeys.get(userId);
    }

    public java.security.PublicKey getPublicKeyFromString(String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        java.security.spec.X509EncodedKeySpec spec = new java.security.spec.X509EncodedKeySpec(keyBytes);
        java.security.KeyFactory kf = java.security.KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }
}