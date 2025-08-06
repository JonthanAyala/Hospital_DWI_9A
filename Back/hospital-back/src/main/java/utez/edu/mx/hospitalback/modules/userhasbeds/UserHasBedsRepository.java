package utez.edu.mx.hospitalback.modules.userhasbeds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserHasBedsRepository extends JpaRepository<UserHasBeds, Long> {

    // Buscar todas las relaciones de un usuario
    List<UserHasBeds> findByUserId(Long userId);

    // Buscar todas las relaciones con una cama específica
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
}
