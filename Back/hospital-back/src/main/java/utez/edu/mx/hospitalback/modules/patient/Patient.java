package utez.edu.mx.hospitalback.modules.patient;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import utez.edu.mx.hospitalback.modules.bed.Bed;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "El nombre del paciente es obligatorio")
    private String name;

    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;

    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    @OneToOne
    @JoinColumn(name = "id_bed", nullable = false)
    private Bed bed;

    public Patient() {
        this.admissionDate = LocalDateTime.now();
    }

    public Patient(Long id, String name, LocalDateTime admissionDate, LocalDateTime dischargeDate, Bed bed) {
        this.id = id;
        this.name = name;
        this.admissionDate = admissionDate;
        this.dischargeDate = dischargeDate;
        this.bed = bed;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDateTime admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDateTime getDischargeDate() {
        return dischargeDate;
    }

    public void setDischargeDate(LocalDateTime dischargeDate) {
        this.dischargeDate = dischargeDate;
    }

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }
}
