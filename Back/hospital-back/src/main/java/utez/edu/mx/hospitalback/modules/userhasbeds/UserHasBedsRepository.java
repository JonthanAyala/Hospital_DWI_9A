package utez.edu.mx.hospitalback.modules.userhasbeds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import utez.edu.mx.hospitalback.modules.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserHasBedsRepository extends JpaRepository<UserHasBeds, Long> {

    // Buscar todas las relaciones de un usuario
    List<UserHasBeds> findByUserId(Long userId);

    // Buscar todas las relaciones con una cama específica
    // Agrega este método para que el servicio lo pueda usar
    List<UserHasBeds> findByUser(User user);

    List<UserHasBeds> findByBedId(Long bedId);

    // Buscar una relación específica entre un usuario y una cama
    Optional<UserHasBeds> findByUserIdAndBedId(Long userId, Long bedId);

    // Verificar si una cama ya está asignada
    boolean existsByBedId(Long bedId);

    // Buscar relaciones por piso
    @Query("SELECT uhb FROM UserHasBeds uhb WHERE uhb.user.floor.id = :floorId")
    List<UserHasBeds> findByFloorId(@Param("floorId") Long floorId);

    // Eliminar todas las relaciones asociadas a una cama
    void deleteByBedId(Long bedId);

    // --- NUEVAS CONSULTAS PARA ENCONTRAR PACIENTES ASIGNADOS ---

    // Buscar todas las asignaciones de camas, incluyendo los detalles del paciente
    @Query("SELECT uhb FROM UserHasBeds uhb LEFT JOIN FETCH uhb.patient p WHERE uhb.user.id = :userId")
    List<UserHasBeds> findBedsAndPatientsByUserId(@Param("userId") Long userId);

    // Buscar una cama por el id del usuario, y del paciente.
    @Query("SELECT uhb FROM UserHasBeds uhb WHERE uhb.user.id = :userId AND uhb.patient.id = :patientId")
    Optional<UserHasBeds> findByUserIdAndPatientId(@Param("userId") Long userId, @Param("patientId") Long patientId);
}