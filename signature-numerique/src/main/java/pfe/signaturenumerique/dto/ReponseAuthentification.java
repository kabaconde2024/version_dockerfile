package pfe.signaturenumerique.dto;

import java.util.Set;

public class ReponseAuthentification {
    private boolean succes;
    private String message;
    private String tokenAcces;
    private boolean necessiteMfa;
    private String email;
    private UtilisateurDto utilisateur;

    public ReponseAuthentification() {}

    // Getters et Setters globaux
    public boolean isSucces() { return succes; }
    public void setSucces(boolean succes) { this.succes = succes; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getTokenAcces() { return tokenAcces; }
    public void setTokenAcces(String tokenAcces) { this.tokenAcces = tokenAcces; }
    public boolean isNecessiteMfa() { return necessiteMfa; }
    public void setNecessiteMfa(boolean necessiteMfa) { this.necessiteMfa = necessiteMfa; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UtilisateurDto getUtilisateur() { return utilisateur; }
    public void setUtilisateur(UtilisateurDto utilisateur) { this.utilisateur = utilisateur; }

    // --- C'est CETTE CLASSE INTERNE qu'il fallait modifier ---
    public static class UtilisateurDto {
        private Long id; // <--- AJOUTÉ : Pour que le frontend reçoive l'ID
        private String email;
        private String prenom;
        private String nom;
        private Set<String> roles;

        public UtilisateurDto() {}

        // Getters et Setters pour la classe interne
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPrenom() { return prenom; }
        public void setPrenom(String prenom) { this.prenom = prenom; }
        public String getNom() { return nom; }
        public void setNom(String nom) { this.nom = nom; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }
}