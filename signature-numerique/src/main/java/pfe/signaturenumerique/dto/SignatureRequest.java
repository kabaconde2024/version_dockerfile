package pfe.signaturenumerique.dto;


public class SignatureRequest {
    private String hash;
    private String fileName;
    private Long userId;

    // Constructeurs
    public SignatureRequest() {}

    public SignatureRequest(String hash, String fileName, Long userId) {
        this.hash = hash;
        this.fileName = fileName;
        this.userId = userId;
    }

    // Getters et Setters (Indispensables pour que Spring puisse lire le JSON)
    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}