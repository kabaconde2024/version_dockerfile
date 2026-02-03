package pfe.signaturenumerique.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pfe.signaturenumerique.modele.Utilisateur;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
    boolean existsByTelephone(String telephone);
    // Dans UtilisateurRepository.java
    Optional<Utilisateur> findByCodeMfa(String codeMfa);
}