package utez.edu.mx.hospitalback.modules.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.bed.BedRepository;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.floor.FloorRepository;
import utez.edu.mx.hospitalback.modules.user.dto.RegisterUserDTO;
import utez.edu.mx.hospitalback.modules.user.dto.UpdateUserDTO;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBedsRepository;
import utez.edu.mx.hospitalback.utils.APIResponse;
import utez.edu.mx.hospitalback.utils.PasswordEncoder;

import java.sql.SQLException;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private UserHasBedsRepository userHasBedsRepository;

    @Autowired
    private BedRepository bedRepository;


    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse registerUser(RegisterUserDTO payload) {
        try {
            // Verificar si el usuario ya existe
            if (userRepository.findByUsername(payload.getUsername()).isPresent()) {
                return new APIResponse("El nombre de usuario ya existe", false, HttpStatus.BAD_REQUEST);
            }

            if (userRepository.findByEmail(payload.getEmail()).isPresent()) {
                return new APIResponse("El correo ya está registrado", false, HttpStatus.BAD_REQUEST);
            }

            // Verificar que el rol existe
            Rol rol = rolRepository.findById(payload.getRolId()).orElse(null);
            if (rol == null) {
                return new APIResponse("El rol especificado no existe", false, HttpStatus.BAD_REQUEST);
            }

            // Verificar que el piso existe
            Floor floor = floorRepository.findById(payload.getFloorId()).orElse(null);
            if (floor == null) {
                return new APIResponse("El piso especificado no existe", false, HttpStatus.BAD_REQUEST);
            }

            // Crear el usuario
            User user = new User();
            user.setName(payload.getName());
            user.setUsername(payload.getUsername());
            user.setEmail(payload.getEmail());
            user.setPhone(payload.getPhone());
            user.setPassword(PasswordEncoder.encodePassword(payload.getPassword()));
            user.setRol(rol);
            user.setFloor(floor);

            userRepository.save(user);
            return new APIResponse("Usuario registrado exitosamente", null, false, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al registrar usuario", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse updateUser(UpdateUserDTO dto) {
        try {
            User user = userRepository.findById(dto.getId()).orElse(null);
            if (user == null) {
                return new APIResponse("Usuario no encontrado", false, HttpStatus.NOT_FOUND);
            }

            // Validaciones para email y username únicos (si cambiaron)
            if (!user.getUsername().equals(dto.getUsername()) &&
                    userRepository.findByUsername(dto.getUsername()).isPresent()) {
                return new APIResponse("El nombre de usuario ya está en uso", false, HttpStatus.BAD_REQUEST);
            }

            if (!user.getEmail().equals(dto.getEmail()) &&
                    userRepository.findByEmail(dto.getEmail()).isPresent()) {
                return new APIResponse("El correo electrónico ya está en uso", false, HttpStatus.BAD_REQUEST);
            }

            Rol rol = rolRepository.findById(dto.getRolId()).orElse(null);
            Floor floor = floorRepository.findById(dto.getFloorId()).orElse(null);

            if (rol == null || floor == null) {
                return new APIResponse("Rol o piso no válido", false, HttpStatus.BAD_REQUEST);
            }

            user.setName(dto.getName());
            user.setUsername(dto.getUsername());
            user.setEmail(dto.getEmail());
            user.setPhone(dto.getPhone());
            user.setRol(rol);
            user.setFloor(floor);

            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                user.setPassword(PasswordEncoder.encodePassword(dto.getPassword()));
            }

            userRepository.save(user);
            return new APIResponse("Usuario actualizado exitosamente", null, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al actualizar usuario", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse deleteUser(Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return new APIResponse("Usuario no encontrado", false, HttpStatus.NOT_FOUND);
            }

            // Validación: si es enfermera y tiene camas asignadas, no se puede eliminar
            if ("ENFERMERA".equals(user.getRol().getName()) && !userHasBedsRepository.findByUserId(id).isEmpty()) {
                return new APIResponse("No se puede eliminar una enfermera con camas asignadas", false, HttpStatus.BAD_REQUEST);
            }

            // Validación: si tiene rol SECRETARIA y hay camas en su piso
            if ("SECRETARIA".equals(user.getRol().getName()) && !bedRepository.findByFloorId(user.getFloor().getId()).isEmpty()) {
                return new APIResponse("No se puede eliminar una secretaria si existen camas en su piso", false, HttpStatus.BAD_REQUEST);
            }

            userRepository.delete(user);
            return new APIResponse("Usuario eliminado correctamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al eliminar usuario", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @Transactional(readOnly = true)
    public APIResponse getNursesByFloor(Long floorId) {
        try {
            List<User> nurses = userRepository.findByRolNameAndFloorId("ENFERMERA", floorId);
            return new APIResponse("Enfermeras encontradas", nurses, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener enfermeras", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse transferNurse(Long nurseId, Long newFloorId, Long currentUserFloorId) {
        try {
            User nurse = userRepository.findById(nurseId).orElse(null);
            if (nurse == null) {
                return new APIResponse("Enfermera no encontrada", false, HttpStatus.NOT_FOUND);
            }

            // Verificar que la enfermera pertenece al piso actual del usuario
            if (!nurse.getFloor().getId().equals(currentUserFloorId)) {
                return new APIResponse("No tienes permisos para transferir esta enfermera", false, HttpStatus.FORBIDDEN);
            }

            // Verificar que no tenga camas asignadas
            if (userHasBedsRepository.findByUserId(nurseId).size() > 0) {
                return new APIResponse("No se puede transferir una enfermera con camas asignadas", false, HttpStatus.BAD_REQUEST);
            }

            Floor newFloor = floorRepository.findById(newFloorId).orElse(null);
            if (newFloor == null) {
                return new APIResponse("El piso destino no existe", false, HttpStatus.BAD_REQUEST);
            }

            nurse.setFloor(newFloor);
            userRepository.save(nurse);

            return new APIResponse("Enfermera transferida exitosamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al transferir enfermera", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return new APIResponse("Usuarios encontrados", users, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener usuarios", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
