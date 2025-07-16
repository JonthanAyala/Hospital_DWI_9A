package utez.edu.mx.hospitalback.modules.floor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long> {
    Optional<Floor> findByName(String name);
    boolean existsByName(String name);
}
