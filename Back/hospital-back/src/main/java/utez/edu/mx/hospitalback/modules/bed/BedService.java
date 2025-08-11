package utez.edu.mx.hospitalback.modules.bed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.bed.dto.AssignBedDTO;
import utez.edu.mx.hospitalback.modules.bed.dto.RegisterBedDTO;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.floor.FloorRepository;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBeds;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBedsRepository;
import utez.edu.mx.hospitalback.utils.APIResponse;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class BedService {
    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserHasBedsRepository userHasBedsRepository;

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse registerBed(RegisterBedDTO payload, Long userFloorId) {
        try {
            // Verificar que el piso coincide con el del usuario
            if (!payload.getFloorId().equals(userFloorId)) {
                return new APIResponse("Solo puedes registrar camas en tu piso asignado", false, HttpStatus.FORBIDDEN);
            }

            // Verificar si la cama ya existe
            if (bedRepository.existsByIdentifier(payload.getIdentifier())) {
                return new APIResponse("Ya existe una cama con este identificador", false, HttpStatus.BAD_REQUEST);
            }

            Floor floor = floorRepository.findById(payload.getFloorId()).orElse(null);
            if (floor == null) {
                return new APIResponse("El piso especificado no existe", false, HttpStatus.BAD_REQUEST);
            }

            Bed bed = new Bed();
            bed.setIdentifier(payload.getIdentifier());
            bed.setFloor(floor);
            bed.setIsOccupied(false);

            bedRepository.save(bed);
            return new APIResponse("Cama registrada exitosamente", null, false, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al registrar cama", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getBedsByFloor(Long floorId) {
        try {
            List<Bed> beds = bedRepository.findByFloorId(floorId);
            return new APIResponse("Camas encontradas", beds, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener camas", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse updateBed(Long id, RegisterBedDTO payload) {
        try {
            Bed bed = bedRepository.findById(id).orElse(null);
            if (bed == null)
                return new APIResponse("Cama no encontrada", false, HttpStatus.NOT_FOUND);

            // Verificar si el nuevo identificador ya existe (excepto si es el mismo)
            if (!bed.getIdentifier().equals(payload.getIdentifier()) &&
                    bedRepository.existsByIdentifier(payload.getIdentifier())) {
                return new APIResponse("Ya existe otra cama con ese identificador", false, HttpStatus.BAD_REQUEST);
            }

            Floor floor = floorRepository.findById(payload.getFloorId()).orElse(null);
            if (floor == null)
                return new APIResponse("El piso especificado no existe", false, HttpStatus.BAD_REQUEST);

            bed.setIdentifier(payload.getIdentifier());
            bed.setFloor(floor);

            bedRepository.save(bed);
            return new APIResponse("Cama actualizada exitosamente", null, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al actualizar cama", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse deleteBed(Long id) {
        try {
            Bed bed = bedRepository.findById(id).orElse(null);
            if (bed == null)
                return new APIResponse("Cama no encontrada", false, HttpStatus.NOT_FOUND);

            if (bed.getIsOccupied())
                return new APIResponse("No puedes eliminar una cama ocupada", false, HttpStatus.BAD_REQUEST);

            // Verificar si está asignada a alguna enfermera
            if (userHasBedsRepository.existsByBedId(bed.getId()))
                return new APIResponse("No puedes eliminar una cama asignada", false, HttpStatus.BAD_REQUEST);

            bedRepository.delete(bed);
            return new APIResponse("Cama eliminada exitosamente", null, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al eliminar cama", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse assignBedToNurse(AssignBedDTO payload, Long userFloorId) {
        try {
            User nurse = userRepository.findById(payload.getNurseId()).orElse(null);
            if (nurse == null) {
                return new APIResponse("Enfermera no encontrada", false, HttpStatus.NOT_FOUND);
            }

            // Verificar que la enfermera pertenece al mismo piso
            if (!nurse.getFloor().getId().equals(userFloorId)) {
                return new APIResponse("Solo puedes asignar camas a enfermeras de tu piso", false, HttpStatus.FORBIDDEN);
            }

            // Verificar que es enfermera
            if (!"ENFERMERA".equals(nurse.getRol().getName())) {
                return new APIResponse("Solo se pueden asignar camas a enfermeras", false, HttpStatus.BAD_REQUEST);
            }

            Bed bed = bedRepository.findById(payload.getBedId()).orElse(null);
            if (bed == null) {
                return new APIResponse("Cama no encontrada", false, HttpStatus.NOT_FOUND);
            }

            // Verificar que la cama pertenece al mismo piso
            if (!bed.getFloor().getId().equals(userFloorId)) {
                return new APIResponse("Solo puedes asignar camas de tu piso", false, HttpStatus.FORBIDDEN);
            }

            // Verificar que la cama no esté ya asignada
            if (userHasBedsRepository.existsByBedId(bed.getId())) {
                return new APIResponse("Esta cama ya está asignada a otra enfermera", false, HttpStatus.BAD_REQUEST);
            }

            // Lógica corregida para asignar la cama al enfermero
            UserHasBeds assignment = new UserHasBeds();
            assignment.setUser(nurse);
            assignment.setBed(bed);
            assignment.setAssignedDate(LocalDateTime.now());
            userHasBedsRepository.save(assignment);


            return new APIResponse("Cama asignada exitosamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al asignar cama", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getAvailableBeds(Long floorId) {
        try {
            // Usa el nuevo método del repositorio para obtener las camas disponibles
            List<Bed> availableBeds = bedRepository.findAvailableBedsByFloor(floorId);

            if (availableBeds.isEmpty()) {
                // CORRECCIÓN: Si no hay camas, devuelve un APIResponse con un array vacío en 'data'
                return new APIResponse("No hay camas disponibles en este piso", Collections.emptyList(), false, HttpStatus.OK);
            }
            return new APIResponse("Camas disponibles encontradas", availableBeds, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener camas disponibles", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getAssignedBeds(Long nurseId) {
        try {
            List<Bed> beds = bedRepository.findBedsByUserId(nurseId);
            return new APIResponse("Camas asignadas encontradas", beds, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener camas asignadas", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
