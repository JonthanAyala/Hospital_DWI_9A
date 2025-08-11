package utez.edu.mx.hospitalback.modules.userhasbeds;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.hospitalback.modules.bed.Bed;
import utez.edu.mx.hospitalback.modules.patient.Patient; // Importa la clase Patient
import utez.edu.mx.hospitalback.modules.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_has_beds")
@Getter
@Setter
public class UserHasBeds {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    @JsonManagedReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_bed", nullable = false)
    @JsonManagedReference
    private Bed bed;

    // Aquí se agrega la relación con el paciente
    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = true) // 'nullable = true' porque una cama puede estar disponible sin un paciente asignado.
    private Patient patient; // Campo para vincular el paciente

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    public UserHasBeds() {
        this.assignedDate = LocalDateTime.now();
    }
}