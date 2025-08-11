package utez.edu.mx.hospitalback.modules.userhasbeds;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-has-beds")
@CrossOrigin(origins = "http://localhost:8081") // Esto permite peticiones desde tu front-end
public class UserHasBedsController {

    private final UserHasBedsService userHasBedsService;

    public UserHasBedsController(UserHasBedsService userHasBedsService) {
        this.userHasBedsService = userHasBedsService;
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<UserHasBeds>> getBedsByUserId(@PathVariable Long userId) {
        // Se ha modificado el método para usar el servicio que incluye la información del paciente
        List<UserHasBeds> userBeds = userHasBedsService.findBedsWithPatientsByUserId(userId);
        if (userBeds.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(userBeds);
    }
}