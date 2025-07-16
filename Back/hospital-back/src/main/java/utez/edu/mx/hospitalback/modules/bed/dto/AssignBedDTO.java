package utez.edu.mx.hospitalback.modules.bed.dto;

import jakarta.validation.constraints.NotNull;

public class AssignBedDTO {
    @NotNull(message = "El ID de la enfermera es obligatorio")
    private Long nurseId;

    @NotNull(message = "El ID de la cama es obligatorio")
    private Long bedId;

    public AssignBedDTO() {
    }

    public AssignBedDTO(Long nurseId, Long bedId) {
        this.nurseId = nurseId;
        this.bedId = bedId;
    }

    public Long getNurseId() {
        return nurseId;
    }

    public void setNurseId(Long nurseId) {
        this.nurseId = nurseId;
    }

    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }
}
