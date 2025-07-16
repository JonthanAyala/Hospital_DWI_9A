package utez.edu.mx.hospitalback.modules.patient;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospitalback.modules.patient.dto.RegisterPatientDTO;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;
import utez.edu.mx.hospitalback.utils.APIResponse;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Controlador de pacientes", description = "Operaciones relacionadas con la gestión de pacientes")
@SecurityRequirement(name = "bearerAuth")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("")
    @Operation(summary = "Registrar paciente", description = "Permite a la enfermera registrar un paciente en una de sus camas asignadas")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Paciente registrado exitosamente", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = APIResponse.class))),
        @ApiResponse(responseCode = "400", description = "Cama ya ocupada o datos inválidos"),
        @ApiResponse(responseCode = "403", description = "Cama no asignada a la enfermera"),
        @ApiResponse(responseCode = "404", description = "Cama no encontrada")
    })
    public ResponseEntity<APIResponse> registerPatient(@Valid @RequestBody RegisterPatientDTO payload, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = patientService.registerPatient(payload, currentUser.getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{patientId}/discharge")
    @Operation(summary = "Dar de alta paciente", description = "Permite a la enfermera dar de alta un paciente y liberar la cama")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Paciente dado de alta exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para dar de alta este paciente"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public ResponseEntity<APIResponse> dischargePatient(@PathVariable Long patientId, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = patientService.dischargePatient(patientId, currentUser.getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("")
    @Operation(summary = "Obtener pacientes asignados", description = "Permite a la enfermera ver todos sus pacientes asignados")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Pacientes encontrados exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> getPatientsByNurse(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = patientService.getPatientsByNurse(currentUser.getId());
        return new ResponseEntity<>(response, response.getStatus());
    }
}
