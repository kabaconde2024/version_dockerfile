package pfe.signaturenumerique.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {  // Changé de ResendEmailService à EmailService

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from.email:onrender@resend.dev}")
    private String fromEmail;

    private Resend resend;

    @PostConstruct
    public void init() {
        if (resendApiKey == null || resendApiKey.isEmpty()) {
            log.warn("⚠️ RESEND_API_KEY non configurée. Les emails ne seront pas envoyés.");
            return;
        }

        this.resend = new Resend(resendApiKey);
        log.info("✅ Service Email (Resend) initialisé avec l'email d'expéditeur: {}", fromEmail);
    }

    public void envoyerEmail(String emailDestinataire, String sujet, String contenu) {
        if (resend == null) {
            log.warn("⚠️ Service Email non initialisé. Email non envoyé à: {}", emailDestinataire);
            log.info("📧 Email simulé - Destinataire: {}, Sujet: {}, Contenu: {}",
                    emailDestinataire, sujet, contenu);
            return;
        }

        try {
            log.info("📧 Envoi d'email à: {} | Sujet: {}", emailDestinataire, sujet);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(emailDestinataire)
                    .subject(sujet)
                    .html(convertirEnHtml(contenu))
                    .text(contenu)
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            log.info("✅ Email envoyé avec succès ! ID: {} | À: {}",
                    response.getId(), emailDestinataire);

        } catch (ResendException e) {
            log.error("❌ Erreur d'envoi d'email pour {}: {}", emailDestinataire, e.getMessage());

            String errorMessage = e.getMessage();
            if (errorMessage.contains("invalid api key")) {
                throw new RuntimeException("Clé API Resend invalide.");
            } else if (errorMessage.contains("domain not verified")) {
                throw new RuntimeException("Domaine email non vérifié. Utilisez: " + fromEmail);
            } else {
                throw new RuntimeException("Erreur d'envoi d'email: " + errorMessage);
            }
        } catch (Exception e) {
            log.error("❌ Erreur inattendue: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur technique lors de l'envoi d'email: " + e.getMessage());
        }
    }

    private String convertirEnHtml(String texte) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 30px; background-color: white; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                    .code { font-size: 24px; font-weight: bold; text-align: center; color: #4CAF50; padding: 15px; background-color: #f0f8f0; border: 2px dashed #4CAF50; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Signature Numérique</h2>
                    </div>
                    <div class="content">
                        %s
                    </div>
                    <div class="footer">
                        © 2024 Signature Numérique.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(texte.replace("\n", "<br>"));
    }

    public void envoyerCodeMfa(String emailDestinataire, String code) {
        String sujet = "Votre code de sécurité - Signature Numérique";

        String contenu = String.format(
                "Bonjour,\n\n" +
                        "Votre code de vérification à deux facteurs est :\n\n" +
                        "CODE : %s\n\n" +
                        "Ce code est valide pendant 10 minutes.\n\n" +
                        "Si vous n'avez pas demandé ce code, veuillez ignorer cet email.\n\n" +
                        "Cordialement,\nL'équipe Signature Numérique",
                code
        );

        envoyerEmail(emailDestinataire, sujet, contenu);
    }

    public void envoyerLienReinitialisation(String email, String lien) {
        String sujet = "Réinitialisation de votre mot de passe";

        String contenu = String.format(
                "Bonjour,\n\n" +
                        "Vous avez demandé la réinitialisation de votre mot de passe.\n\n" +
                        "Pour choisir un nouveau mot de passe, cliquez sur le lien ci-dessous :\n\n" +
                        "%s\n\n" +
                        "Ce lien expirera dans 1 heure.\n\n" +
                        "Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.\n\n" +
                        "Cordialement,\nL'équipe Signature Numérique",
                lien
        );

        envoyerEmail(email, sujet, contenu);
    }
}