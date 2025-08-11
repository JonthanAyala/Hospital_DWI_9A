package utez.edu.mx.hospitalback.modules.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.bed.Bed;
import utez.edu.mx.hospitalback.modules.bed.BedRepository;
import utez.edu.mx.hospitalback.modules.patient.dto.RegisterPatientDTO;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBeds;
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

    @Autowired
    private UserRepository userRepository;

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse registerPatient(RegisterPatientDTO payload, Long userId) {
        try {
            Bed bed = bedRepository.findById(payload.getBedId()).orElse(null);
            if (bed == null) {
                return new APIResponse("Cama no encontrada", false, HttpStatus.NOT_FOUND);
            }

            // Validar que el usuario que registra esté en el mismo piso que la cama
            User currentUser = userRepository.findById(userId).orElse(null);
            if (currentUser == null) {
                return new APIResponse("Usuario no encontrado", false, HttpStatus.NOT_FOUND);
            }
            if (currentUser.getFloor() == null || bed.getFloor() == null || !currentUser.getFloor().getId().equals(bed.getFloor().getId())) {
                return new APIResponse("Esta cama no está en tu piso asignado", false, HttpStatus.FORBIDDEN);
            }

            // Verificar que la cama no esté ocupada
            if (bed.getIsOccupied()) {
                return new APIResponse("Esta cama ya está ocupada", false, HttpStatus.BAD_REQUEST);
            }

            Patient patient = new Patient();
            patient.setName(payload.getName());
            patient.setEmail(payload.getEmail());
            patient.setPhone(payload.getPhone());
            patient.setMedicalHistory(payload.getMedicalHistory());
            patient.setBed(bed);
            patient.setAdmissionDate(LocalDateTime.now());

            patientRepository.save(patient);

            // Marcar la cama como ocupada
            bed.setIsOccupied(true);
            bedRepository.save(bed);

            // TODO: Crear la relación en la tabla user_has_beds
            UserHasBeds userHasBeds = new UserHasBeds();
            userHasBeds.setUser(currentUser);
            userHasBeds.setBed(bed);
            userHasBeds.setAssignedDate(LocalDateTime.now());
            userHasBedsRepository.save(userHasBeds);

            return new APIResponse("Paciente registrado exitosamente", null, true, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al registrar paciente", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse dischargePatient(Long patientId, Long userId) {
        try {
            Patient patient = patientRepository.findById(patientId).orElse(null);
            if (patient == null) {
                return new APIResponse("Paciente no encontrado", false, HttpStatus.NOT_FOUND);
            }

            // Validar que la cama del paciente pertenezca al piso del usuario
            User currentUser = userRepository.findById(userId).orElse(null);
            if (currentUser == null || !currentUser.getFloor().getId().equals(patient.getBed().getFloor().getId())) {
                return new APIResponse("No tienes permisos para dar de alta este paciente", false, HttpStatus.FORBIDDEN);
            }

            // Validar que la cama esté ocupada antes de dar de alta
            if (!patient.getBed().getIsOccupied()) {
                return new APIResponse("La cama de este paciente ya está libre", false, HttpStatus.BAD_REQUEST);
            }

            // Dar de alta al paciente
            patient.setDischargeDate(LocalDateTime.now());
            patientRepository.save(patient);

            // Liberar la cama
            Bed bed = patient.getBed();
            bed.setIsOccupied(false);
            bedRepository.save(bed);

            return new APIResponse("Paciente dado de alta exitosamente", null, true, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al dar de alta al paciente", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getPatientsByNurse(Long nurseId) {
        try {
            List<Patient> patients = patientRepository.findPatientsByNurseId(nurseId);
            return new APIResponse("Pacientes encontrados", patients, true, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener pacientes", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getPatientById(Long patientId) {
        try {
            return patientRepository.findById(patientId)
                    .map(patient -> new APIResponse("Paciente encontrado", patient, true, HttpStatus.OK))
                    .orElse(new APIResponse("Paciente no encontrado", false, HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener paciente", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(readOnly = true)
    public APIResponse getAllPatients() {
        try {
            List<Patient> patients = patientRepository.findAll();
            return new APIResponse("Pacientes encontrados", patients, true, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new APIResponse("Error al obtener pacientes", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
