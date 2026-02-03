package pfe.signaturenumerique.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Remplacement manuel de @Slf4j pour compatibilité Java 25
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Remplacement manuel de @RequiredArgsConstructor
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void envoyerEmail(String emailDestinataire, String sujet, String contenu) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(emailDestinataire);
            message.setSubject(sujet);
            message.setText(contenu);

            mailSender.send(message);
            log.info("Email envoyé à: {} - Sujet: {}", emailDestinataire, sujet);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email à {}: {}", emailDestinataire, e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        }
    }

    // Méthode existante pour MFA
    public void envoyerCodeMfa(String emailDestinataire, String code) {
        String sujet = "Votre code de sécurité - Signature Numérique";
        String contenu = String.format(
                "Bonjour,\n\n" +
                        "Votre code de vérification à double facteur est : %s\n\n" +
                        "Ce code est valide pendant 10 minutes.\n\n" +
                        "Si vous n'avez pas demandé ce code, veuillez ignorer cet email.\n\n" +
                        "Cordialement,\nL'équipe Signature Numérique",
                code
        );

        envoyerEmail(emailDestinataire, sujet, contenu);
    }

    public void envoyerLienReinitialisation(String email, String lien) {
        String sujet = "Réinitialisation de votre mot de passe";
        String message = "Bonjour,\n\n" +
                "Vous avez demandé la réinitialisation de votre mot de passe.\n" +
                "Veuillez cliquer sur le lien ci-dessous pour choisir un nouveau mot de passe :\n" +
                lien + "\n\n" +
                "Ce lien expirera dans 1 heure.\n" +
                "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.";

        envoyerEmailSimple(email, sujet, message);
    }

    // Méthode générique pour l'envoi (utilisée par envoyerLienReinitialisation)
    private void envoyerEmailSimple(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Utilisation de fromEmail au lieu de la chaîne codée en dur pour plus de sécurité
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            log.info("Email simple envoyé à: {}", to);
        } catch (Exception e) {
            log.error("Erreur SMTP : {}", e.getMessage());
            throw new RuntimeException("Échec de l'envoi de l'email");
        }
    }
}