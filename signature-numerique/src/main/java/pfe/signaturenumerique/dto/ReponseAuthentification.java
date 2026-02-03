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

    // Getters et Setters
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

    public static class UtilisateurDto {
        private String email;
        private String prenom;
        private String nom;
        private Set<String> roles;

        public UtilisateurDto() {}
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