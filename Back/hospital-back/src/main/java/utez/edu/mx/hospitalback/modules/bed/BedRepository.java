package utez.edu.mx.hospitalback.modules.bed;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    Optional<Bed> findByIdentifier(String identifier);
    List<Bed> findByFloorId(Long floorId);
    boolean existsByIdentifier(String identifier);
    
    @Query("SELECT b FROM Bed b WHERE b.floor.id = :floorId AND b.isOccupied = false")
    List<Bed> findAvailableBedsByFloor(@Param("floorId") Long floorId);
    
    @Query("SELECT b FROM Bed b JOIN UserHasBeds uhb ON b.id = uhb.bed.id WHERE uhb.user.id = :userId")
    List<Bed> findBedsByUserId(@Param("userId") Long userId);
}
