package utez.edu.mx.hospitalback.modules.userhasbeds;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserHasBedsService {

    private final UserHasBedsRepository userHasBedsRepository;
    private final UserRepository userRepository;

    public UserHasBedsService(UserHasBedsRepository userHasBedsRepository, UserRepository userRepository) {
        this.userHasBedsRepository = userHasBedsRepository;
        this.userRepository = userRepository;
    }

    // Método para encontrar las camas asignadas a un usuario por su ID
    @Transactional(readOnly = true)
    public List<UserHasBeds> findByUserId(Long userId) {
        // Primero, verificamos si el usuario existe
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Si el usuario existe, buscamos las asignaciones de camas
            return userHasBedsRepository.findByUser(user);
        }
        return List.of(); // Si no se encuentra el usuario, devolvemos una lista vacía
    }

    // --- NUEVO MÉTODO ---
    // Este método usa la consulta más optimizada para traer camas y pacientes
    @Transactional(readOnly = true)
    public List<UserHasBeds> findBedsWithPatientsByUserId(Long userId) {
        return userHasBedsRepository.findBedsAndPatientsByUserId(userId);
    }
}