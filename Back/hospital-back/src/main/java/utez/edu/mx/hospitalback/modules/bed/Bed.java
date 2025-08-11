package utez.edu.mx.hospitalback.modules.bed;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.patient.Patient;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBeds;

import java.util.List;

@Entity
@Table(name = "bed")
@Getter
@Setter
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
    @JsonManagedReference
    private Floor floor;

    // Relación OneToOne con Patient - Lado no dueño
    @OneToOne
    @JoinColumn(name = "id_patient", unique = true) // id_patient es la clave foránea en la tabla 'bed'
    @JsonManagedReference
    private Patient patient;

    @OneToMany(mappedBy = "bed")
    @JsonIgnore
    private List<UserHasBeds> userHasBeds;

    public Bed() {
    }
}