package pfe.signaturenumerique.dto;

public class RequeteConnexion {
    private String email;
    private String motDePasse;

    public RequeteConnexion() {}
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
}