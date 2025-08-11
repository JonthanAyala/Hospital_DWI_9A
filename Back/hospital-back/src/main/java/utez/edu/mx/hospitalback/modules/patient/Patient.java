package utez.edu.mx.hospitalback.modules.patient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.hospitalback.modules.bed.Bed;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@Getter
@Setter
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "El nombre del paciente es obligatorio")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;

    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    // Relación OneToOne con Bed - Lado dueño, mapeado por 'patient'
    @OneToOne(mappedBy = "patient")
    @JsonBackReference
    private Bed bed;

    public Patient() {
        this.admissionDate = LocalDateTime.now();
    }
}
