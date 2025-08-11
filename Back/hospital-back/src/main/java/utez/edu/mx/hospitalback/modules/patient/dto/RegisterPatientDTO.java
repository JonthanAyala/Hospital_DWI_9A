package utez.edu.mx.hospitalback.modules.patient.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterPatientDTO {
    @NotBlank(message = "El nombre del paciente es obligatorio")
    private String name;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser una dirección de correo válida")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener 10 dígitos")
    private String phone;

    @NotBlank(message = "El historial médico es obligatorio")
    @Size(min = 10, max = 1000, message = "El historial debe tener entre 10 y 1000 caracteres")
    private String medicalHistory;

    @NotNull(message = "El ID de la cama es obligatorio")
    private Long bedId;

    public RegisterPatientDTO() {
    }

    public RegisterPatientDTO(String name, String email, String phone, String medicalHistory, Long bedId) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.medicalHistory = medicalHistory;
        this.bedId = bedId;
    }

    // Getters y Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }
}