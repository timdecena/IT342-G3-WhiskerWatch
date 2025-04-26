package edu.cit.whiskerwatch.dto;

public class LostAndFoundPetDTO {
    private String petName;
    private String description;
    private String status;
    private String species;
    private String country;
    private String city;
    private String barangay;
    private Double latitude;
    private Double longitude;

    // Getters and Setters
    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getBarangay() { return barangay; }
    public void setBarangay(String barangay) { this.barangay = barangay; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
