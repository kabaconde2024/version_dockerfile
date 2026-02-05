package pfe.signaturenumerique.controller;

public class SignatureResponse {
    private String signatureBase64;

    public SignatureResponse(String signatureBase64) {
        this.signatureBase64 = signatureBase64;
    }

    public String getSignatureBase64() { return signatureBase64; }
    public void setSignatureBase64(String signatureBase64) { this.signatureBase64 = signatureBase64; }
}