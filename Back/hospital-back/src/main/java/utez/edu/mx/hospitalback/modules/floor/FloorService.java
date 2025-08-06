package utez.edu.mx.hospitalback.modules.floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.floor.dto.FloorRequestDto;
import utez.edu.mx.hospitalback.utils.APIResponse;

import java.sql.SQLException;
import java.util.List;

@Service
public class FloorService {

    @Autowired
    private FloorRepository floorRepository;

    @Transactional(readOnly = true)
    public APIResponse getAllFloors() {
        try {
            List<Floor> floors = floorRepository.findAll();
            return new APIResponse("Pisos encontrados", floors, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener pisos", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse registerFloor(FloorRequestDto dto) {
        try {
            if (floorRepository.existsByName(dto.getName())) {
                return new APIResponse("Ya existe un piso con ese nombre", false, HttpStatus.BAD_REQUEST);
            }

            Floor floor = new Floor();
            floor.setName(dto.getName());
            floor.setDescription(dto.getDescription());

            floorRepository.save(floor);
            return new APIResponse("Piso registrado exitosamente", null, false, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al registrar piso", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse updateFloor(Long id, FloorRequestDto dto) {
        try {
            Floor floor = floorRepository.findById(id).orElse(null);
            if (floor == null) {
                return new APIResponse("Piso no encontrado", false, HttpStatus.NOT_FOUND);
            }

            // Validar si se está intentando usar un nombre ya existente para otro piso
            if (!floor.getName().equals(dto.getName()) && floorRepository.existsByName(dto.getName())) {
                return new APIResponse("Ya existe otro piso con ese nombre", false, HttpStatus.BAD_REQUEST);
            }

            floor.setName(dto.getName());
            floor.setDescription(dto.getDescription());

            floorRepository.save(floor);
            return new APIResponse("Piso actualizado correctamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al actualizar piso", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse deleteFloor(Long id) {
        try {
            if (!floorRepository.existsById(id)) {
                return new APIResponse("Piso no encontrado", false, HttpStatus.NOT_FOUND);
            }

            floorRepository.deleteById(id);
            return new APIResponse("Piso eliminado exitosamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al eliminar piso", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
