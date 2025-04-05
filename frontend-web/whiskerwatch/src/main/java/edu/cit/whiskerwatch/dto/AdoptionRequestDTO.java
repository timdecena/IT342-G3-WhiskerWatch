package edu.cit.whiskerwatch.dto;

public class AdoptionRequestDTO {

    private String adopterName;
    private String adopterContact;
    private String messageToOwner;

    public AdoptionRequestDTO() {}

    public AdoptionRequestDTO(String adopterName, String adopterContact, String messageToOwner) {
        this.adopterName = adopterName;
        this.adopterContact = adopterContact;
        this.messageToOwner = messageToOwner;
    }

    public String getAdopterName() { return adopterName; }
    public void setAdopterName(String adopterName) { this.adopterName = adopterName; }

    public String getAdopterContact() { return adopterContact; }
    public void setAdopterContact(String adopterContact) { this.adopterContact = adopterContact; }

    public String getMessageToOwner() { return messageToOwner; }
    public void setMessageToOwner(String messageToOwner) { this.messageToOwner = messageToOwner; }
}
