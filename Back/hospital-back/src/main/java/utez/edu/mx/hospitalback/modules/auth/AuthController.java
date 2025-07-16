package utez.edu.mx.hospitalback.modules.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.hospitalback.modules.auth.dto.LoginRequestDTO;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.utils.APIResponse;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Controlador de autenticación", description = "Operaciones relacionadas con la autenticación de usuarios")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("")
    @Operation(summary = "Iniciar sesión", description = "Permite a los usuarios autenticarse en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso", 
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = APIResponse.class))),
        @ApiResponse(responseCode = "400", description = "Contraseña incorrecta"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<APIResponse> doLogin(@Valid @RequestBody LoginRequestDTO payload) {
        APIResponse response = authService.doLogin(payload);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/register")
    @Operation(summary = "Registro de usuario", description = "Registro básico de usuario (deprecado - usar /api/users/register)")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Usuario ya existe o datos inválidos")
    })
    public ResponseEntity<APIResponse> register(@Valid @RequestBody User payload) {
        APIResponse response = authService.register(payload);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
