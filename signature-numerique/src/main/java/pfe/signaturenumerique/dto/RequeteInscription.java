package pfe.signaturenumerique.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RequeteInscription {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 8)
    private String motDePasse;

    @NotBlank
    private String prenom;

    @NotBlank
    private String nom;

    @NotBlank
    private String cin;

    @NotBlank
    private String telephone;

    // Ces champs doivent exister pour éviter l'erreur 400
    private String civilite;
    private String dateNaissance;
    private String adresse;
    private String ville;
    private String codePostal;

    // Constructeur par défaut (Indispensable pour Jackson)
    public RequeteInscription() {}

    // Getters et Setters (Indispensables)
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getCivilite() { return civilite; }
    public void setCivilite(String civilite) { this.civilite = civilite; }
    public String getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }
}