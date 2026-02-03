package pfe.signaturenumerique;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SignatureNumeriqueApplication {
    public static void main(String[] args) {
        SpringApplication.run(SignatureNumeriqueApplication.class, args);
        System.out.println("✅ Application de Signature Numérique démarrée !");
        System.out.println("🌐 URL: http://localhost:8080");
        System.out.println("🧪 Test API: http://localhost:8080/api/authentification/test");
    }

}
