package utez.edu.mx.hospitalback.modules.bed.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class RegisterBedDTO {
    @NotBlank(message = "El identificador de la cama es obligatorio")
    @Pattern(regexp = "^CAMA-\\d{2}$", message = "El formato del identificador debe ser CAMA-XX (ej: CAMA-01)")
    private String identifier;

    @NotNull(message = "El piso es obligatorio")
    private Long floorId;

    public RegisterBedDTO() {
    }

    public RegisterBedDTO(String identifier, Long floorId) {
        this.identifier = identifier;
        this.floorId = floorId;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Long getFloorId() {
        return floorId;
    }

    public void setFloorId(Long floorId) {
        this.floorId = floorId;
    }
}
