package pfe.signaturenumerique.modele;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "audit_logs")
public class SignatureLog {

    @Id
    private String id; // ID technique MongoDB (String)
    private Long userId;
    private String action;
    private String fileName;
    private String hash;
    private String timestamp;
    private byte[] fileContent; // <--- AJOUTEZ CECI
    public SignatureLog() {}
    // Ajoutez ce champ pour stocker la liste des personnes invitées
    private List<String> sharedWithEmails = new ArrayList<>();

    // Getters et Setters
    public List<String> getSharedWithEmails() { return sharedWithEmails; }
    public void setSharedWithEmails(List<String> sharedWithEmails) { this.sharedWithEmails = sharedWithEmails; }
    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public byte[] getFileContent() { return fileContent; }
    public void setFileContent(byte[] fileContent) { this.fileContent = fileContent; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}