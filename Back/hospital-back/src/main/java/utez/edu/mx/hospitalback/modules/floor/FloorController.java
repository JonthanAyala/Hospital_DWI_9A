package utez.edu.mx.hospitalback.modules.floor;

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
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.hospitalback.modules.floor.dto.FloorRequestDto;
import utez.edu.mx.hospitalback.utils.APIResponse;

@RestController
@RequestMapping("/api/floors")
@Tag(name = "Controlador de pisos", description = "Operaciones relacionadas con la gestión de pisos")
@SecurityRequirement(name = "bearerAuth")
public class FloorController {

    @Autowired
    private FloorService floorService;

    @GetMapping("")
    @Operation(summary = "Obtener todos los pisos")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pisos encontrados",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = APIResponse.class)))
    })
    public ResponseEntity<APIResponse> getAll() {
        APIResponse response = floorService.getAllFloors();
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("")
    @Operation(summary = "Registrar nuevo piso")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Piso registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o piso ya existe")
    })
    public ResponseEntity<APIResponse> register(@Valid @RequestBody FloorRequestDto dto) {
        APIResponse response = floorService.registerFloor(dto);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar piso existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Piso actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Piso no encontrado")
    })
    public ResponseEntity<APIResponse> update(@PathVariable Long id, @Valid @RequestBody FloorRequestDto dto) {
        APIResponse response = floorService.updateFloor(id, dto);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar piso")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Piso eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Piso no encontrado")
    })
    public ResponseEntity<APIResponse> delete(@PathVariable Long id) {
        APIResponse response = floorService.deleteFloor(id);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
