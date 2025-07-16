package utez.edu.mx.hospitalback.modules.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.bed.Bed;
import utez.edu.mx.hospitalback.modules.bed.BedRepository;
import utez.edu.mx.hospitalback.modules.patient.dto.RegisterPatientDTO;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBedsRepository;
import utez.edu.mx.hospitalback.utils.APIResponse;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private UserHasBedsRepository userHasBedsRepository;

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse registerPatient(RegisterPatientDTO payload, Long nurseId) {
        try {
            Bed bed = bedRepository.findById(payload.getBedId()).orElse(null);
            if (bed == null) {
                return new APIResponse("Cama no encontrada", false, HttpStatus.NOT_FOUND);
            }

            // Verificar que la cama está asignada a la enfermera
            if (!userHasBedsRepository.findByUserIdAndBedId(nurseId, bed.getId()).isPresent()) {
                return new APIResponse("Esta cama no está asignada a ti", false, HttpStatus.FORBIDDEN);
            }

            // Verificar que la cama no esté ocupada
            if (bed.getIsOccupied()) {
                return new APIResponse("Esta cama ya está ocupada", false, HttpStatus.BAD_REQUEST);
            }

            Patient patient = new Patient();
            patient.setName(payload.getName());
            patient.setBed(bed);
            patient.setAdmissionDate(LocalDateTime.now());

            patientRepository.save(patient);

            // Marcar la cama como ocupada
            bed.setIsOccupied(true);
            bedRepository.save(bed);

            return new APIResponse("Paciente registrado exitosamente", null, false, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al registrar paciente", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse dischargePatient(Long patientId, Long nurseId) {
        try {
            Patient patient = patientRepository.findById(patientId).orElse(null);
            if (patient == null) {
                return new APIResponse("Paciente no encontrado", false, HttpStatus.NOT_FOUND);
            }

            // Verificar que la cama está asignada a la enfermera
            if (!userHasBedsRepository.findByUserIdAndBedId(nurseId, patient.getBed().getId()).isPresent()) {
                return new APIResponse("No tienes permisos para dar de alta este paciente", false, HttpStatus.FORBIDDEN);
            }

            // Dar de alta al paciente
            patient.setDischargeDate(LocalDateTime.now());
            patientRepository.save(patient);

            // Liberar la cama
            Bed bed = patient.getBed();
            bed.setIsOccupied(false);
            bedRepository.save(bed);

            return new APIResponse("Paciente dado de alta exitosamente", null, false, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al dar de alta al paciente", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getPatientsByNurse(Long nurseId) {
        try {
            List<Patient> patients = patientRepository.findPatientsByNurseId(nurseId);
            return new APIResponse("Pacientes encontrados", patients, false, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener pacientes", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
