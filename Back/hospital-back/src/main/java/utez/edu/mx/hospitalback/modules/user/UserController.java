package utez.edu.mx.hospitalback.modules.user;

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
import utez.edu.mx.hospitalback.modules.user.dto.RegisterUserDTO;
import utez.edu.mx.hospitalback.utils.APIResponse;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Controlador de usuarios", description = "Operaciones relacionadas con la gestión de usuarios")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Permite al administrador registrar nuevos usuarios (enfermeras y secretarias)")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = APIResponse.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o usuario ya existe"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> registerUser(@Valid @RequestBody RegisterUserDTO payload) {
        APIResponse response = userService.registerUser(payload);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/nurses")
    @Operation(summary = "Obtener enfermeras por piso", description = "Permite a la secretaria ver las enfermeras de su piso")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Enfermeras encontradas exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> getNursesByFloor(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = userService.getNursesByFloor(currentUser.getFloor().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/nurses/{nurseId}/transfer/{floorId}")
    @Operation(summary = "Transferir enfermera", description = "Permite a la secretaria transferir una enfermera a otro piso si no tiene camas asignadas")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Enfermera transferida exitosamente"),
        @ApiResponse(responseCode = "400", description = "La enfermera tiene camas asignadas"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción"),
        @ApiResponse(responseCode = "404", description = "Enfermera no encontrada")
    })
    public ResponseEntity<APIResponse> transferNurse(
            @PathVariable Long nurseId,
            @PathVariable Long floorId,
            Authentication authentication) {
        
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            APIResponse response = new APIResponse("Usuario no encontrado", false, org.springframework.http.HttpStatus.NOT_FOUND);
            return new ResponseEntity<>(response, response.getStatus());
        }

        APIResponse response = userService.transferNurse(nurseId, floorId, currentUser.getFloor().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("")
    @Operation(summary = "Obtener todos los usuarios", description = "Permite al administrador ver todos los usuarios registrados")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuarios encontrados exitosamente"),
        @ApiResponse(responseCode = "403", description = "No tienes permisos para realizar esta acción")
    })
    public ResponseEntity<APIResponse> getAllUsers() {
        APIResponse response = userService.getAllUsers();
        return new ResponseEntity<>(response, response.getStatus());
    }
}
