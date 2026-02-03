package pfe.signaturenumerique.modele;


import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class MfaService {
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    public String genererSecretMfa() {
        final GoogleAuthenticatorKey key = gAuth.createCredentials();
        return key.getKey();
    }

    public boolean verifierCode(String secret, int code) {
        return gAuth.authorize(secret, code);
    }

    // Pour générer l'URL du QR Code que React affichera
    public String getQrCodeUrl(String secret, String email) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("SignatureNumeriquePFE", email,
                new GoogleAuthenticatorKey.Builder(secret).build());
    }
}