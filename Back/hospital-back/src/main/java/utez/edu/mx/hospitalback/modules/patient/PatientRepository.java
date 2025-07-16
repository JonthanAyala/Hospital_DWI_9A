package utez.edu.mx.hospitalback.modules.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByBedId(Long bedId);
    
    @Query("SELECT p FROM Patient p WHERE p.bed.id IN " +
           "(SELECT uhb.bed.id FROM UserHasBeds uhb WHERE uhb.user.id = :userId)")
    List<Patient> findPatientsByNurseId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Patient p WHERE p.bed.floor.id = :floorId")
    List<Patient> findPatientsByFloorId(@Param("floorId") Long floorId);
}
