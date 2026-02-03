package pfe.signaturenumerique.dto; // Vérifie que le package correspond à ton projet

public class GoogleLoginRequest {
    private String token;

    // Constructeur vide nécessaire pour Jackson (désérialisation JSON)
    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}