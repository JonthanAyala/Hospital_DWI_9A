package utez.edu.mx.hospitalback.modules.patient.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterPatientDTO {
    @NotBlank(message = "El nombre del paciente es obligatorio")
    private String name;

    @NotNull(message = "El ID de la cama es obligatorio")
    private Long bedId;

    public RegisterPatientDTO() {
    }

    public RegisterPatientDTO(String name, Long bedId) {
        this.name = name;
        this.bedId = bedId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }
}
