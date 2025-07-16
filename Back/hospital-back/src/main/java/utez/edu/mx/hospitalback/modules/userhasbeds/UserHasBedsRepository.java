package utez.edu.mx.hospitalback.modules.userhasbeds;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserHasBedsRepository extends JpaRepository<UserHasBeds, Long> {
    List<UserHasBeds> findByUserId(Long userId);
    List<UserHasBeds> findByBedId(Long bedId);
    Optional<UserHasBeds> findByUserIdAndBedId(Long userId, Long bedId);
    boolean existsByBedId(Long bedId);
    
    @Query("SELECT uhb FROM UserHasBeds uhb WHERE uhb.user.floor.id = :floorId")
    List<UserHasBeds> findByFloorId(@Param("floorId") Long floorId);
    
    void deleteByBedId(Long bedId);
}
