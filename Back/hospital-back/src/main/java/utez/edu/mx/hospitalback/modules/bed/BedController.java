package utez.edu.mx.hospitalback.modules.bed;

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
import utez.edu.mx.hospitalback.modules.bed.dto.AssignBedDTO;
import utez.edu.mx.hospitalback.modules.bed.dto.RegisterBedDTO;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;
import utez.edu.mx.hospitalback.utils.APIResponse;

@RestController
@RequestMapping("/api/beds")
@Tag(name = "Controlador de camas", description = "Operaciones relacionadas con la gestión de camas")
@SecurityRequirement(name = "bearerAuth")
public class BedController {
    @Autowired
    private BedService bedService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("")
    @Operation(summary = "Registrar cama", description = "Permite a la secretaria registrar nuevas camas en su piso")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Cama registrada exitosamente", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = APIResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o cama ya existe"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> registerBed(@Valid @RequestBody RegisterBedDTO payload, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = bedService.registerBed(payload, currentUser.getFloor().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("")
    @Operation(summary = "Obtener camas por piso", description = "Permite ver las camas del piso del usuario autenticado")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Camas encontradas exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> getBedsByFloor(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = bedService.getBedsByFloor(currentUser.getFloor().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/assign")
    @Operation(summary = "Asignar cama a enfermera", description = "Permite a la secretaria asignar una cama a una enfermera de su piso")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cama asignada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Cama ya asignada o datos inválidos"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción"),
        @ApiResponse(responseCode = "404", description = "Enfermera o cama no encontrada")
    })
    public ResponseEntity<APIResponse> assignBedToNurse(@Valid @RequestBody AssignBedDTO payload, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = bedService.assignBedToNurse(payload, currentUser.getFloor().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/assigned")
    @Operation(summary = "Obtener camas asignadas", description = "Permite a la enfermera ver sus camas asignadas")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Camas asignadas encontradas exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> getAssignedBeds(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = bedService.getAssignedBeds(currentUser.getId());
        return new ResponseEntity<>(response, response.getStatus());
    }
}
