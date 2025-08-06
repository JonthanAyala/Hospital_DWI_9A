package utez.edu.mx.hospitalback.modules.floor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class FloorRequestDto {

    @NotBlank(message = "El nombre del piso es obligatorio")
    @Pattern(regexp = "^P[1-9]\\d*$", message = "El formato del piso debe ser P1, P2, P3, etc.")
    private String name;

    private String description;

    public FloorRequestDto() {
    }

    public FloorRequestDto(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
