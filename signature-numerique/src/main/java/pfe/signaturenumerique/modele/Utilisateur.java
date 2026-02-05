package pfe.signaturenumerique.modele;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "utilisateurs")
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    private String motDePasse;
    private String prenom;
    private String nom;
    private String cin;
    private String telephone;
    private String adresse;
    private String ville;
    private String codePostal;
    private String civilite;
    private String dateNaissance;
    private boolean mfaActive = true;
    private String codeMfa;
    private LocalDateTime expirationCodeMfa;
    private String provider;
    private Boolean active = true;

    @Column(columnDefinition = "TEXT")
    private String privateKeyStr;

    @Column(columnDefinition = "TEXT")
    private String publicKeyStr;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<RoleUtilisateur> roles = new HashSet<>();

    public Utilisateur() {}
    @Column(columnDefinition = "TEXT")
    private String clePublique;
    // Getters et Setters pour les clés
    public String getPrivateKeyStr() { return privateKeyStr; }
    public void setPrivateKeyStr(String privateKeyStr) { this.privateKeyStr = privateKeyStr; }

    public String getClePublique() {
        return clePublique;
    }

    public void setClePublique(String clePublique) {
        this.clePublique = clePublique;
    }

    // Autres Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public String getVille() { return ville; }
    public void setVille(String ville) { this.ville = ville; }
    public String getCodePostal() { return codePostal; }
    public void setCodePostal(String codePostal) { this.codePostal = codePostal; }
    public String getCivilite() { return civilite; }
    public void setCivilite(String civilite) { this.civilite = civilite; }
    public String getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }
    public boolean isMfaActive() { return mfaActive; }
    public void setMfaActive(boolean mfaActive) { this.mfaActive = mfaActive; }
    public String getCodeMfa() { return codeMfa; }
    public void setCodeMfa(String codeMfa) { this.codeMfa = codeMfa; }
    public LocalDateTime getExpirationCodeMfa() { return expirationCodeMfa; }
    public void setExpirationCodeMfa(LocalDateTime expirationCodeMfa) { this.expirationCodeMfa = expirationCodeMfa; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Set<RoleUtilisateur> getRoles() { return roles; }
    public void setRoles(Set<RoleUtilisateur> roles) { this.roles = roles; }

    // Implémentation UserDetails
    @Override public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.name())).collect(Collectors.toList());
    }
    @Override public String getPassword() { return motDePasse; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return active != null && active; }
}