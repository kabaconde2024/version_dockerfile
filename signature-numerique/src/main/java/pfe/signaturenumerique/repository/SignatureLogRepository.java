package pfe.signaturenumerique.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import pfe.signaturenumerique.modele.SignatureLog;
import java.util.List;

@Repository
public interface SignatureLogRepository extends MongoRepository<SignatureLog, String> {
    List<SignatureLog> findByUserId(Long userId);

    @Query("{ '$or': [ { 'userId': ?0 }, { 'sharedWithEmails': ?1 } ] }")
    List<SignatureLog> findByUserIdOrSharedWithEmails(Long userId, String email);
}