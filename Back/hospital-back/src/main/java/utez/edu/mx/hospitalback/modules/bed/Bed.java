package utez.edu.mx.hospitalback.modules.bed;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.patient.Patient;

@Entity
@Table(name = "bed")
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identifier", nullable = false, unique = true)
    @NotBlank(message = "El identificador de la cama es obligatorio")
    @Pattern(regexp = "^CAMA-\\d{2}$", message = "El formato del identificador debe ser CAMA-XX (ej: CAMA-01)")
    private String identifier;

    @Column(name = "is_occupied", nullable = false)
    private Boolean isOccupied = false;

    @ManyToOne
    @JoinColumn(name = "id_floor", nullable = false)
    private Floor floor;

    @OneToOne(mappedBy = "bed", cascade = CascadeType.ALL)
    @JsonIgnore
    private Patient patient;

    public Bed() {
    }

    public Bed(Long id, String identifier, Boolean isOccupied, Floor floor) {
        this.id = id;
        this.identifier = identifier;
        this.isOccupied = isOccupied;
        this.floor = floor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Boolean getIsOccupied() {
        return isOccupied;
    }

    public void setIsOccupied(Boolean isOccupied) {
        this.isOccupied = isOccupied;
    }

    public Floor getFloor() {
        return floor;
    }

    public void setFloor(Floor floor) {
        this.floor = floor;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
