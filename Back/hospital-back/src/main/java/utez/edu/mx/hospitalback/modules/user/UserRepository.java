package utez.edu.mx.hospitalback.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPassword(String username, String password);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.rol.name = :rolName AND u.floor.id = :floorId")
    List<User> findByRolNameAndFloorId(@Param("rolName") String rolName, @Param("floorId") Long floorId);

    List<User> findByFloorId(Long floorId);
}
