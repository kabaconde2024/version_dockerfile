package pfe.signaturenumerique.dto;

public class VerificationRequest {
    private String hash;
    private String signature;
    private Long utilisateurId;

    // Constructeurs
    public VerificationRequest() {}

    // Getters et Setters (indispensables sans Lombok !)
    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public Long getUtilisateurId() { return utilisateurId; }
    public void setUtilisateurId(Long utilisateurId) { this.utilisateurId = utilisateurId; }
}