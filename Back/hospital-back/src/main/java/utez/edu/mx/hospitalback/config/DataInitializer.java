package utez.edu.mx.hospitalback.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.floor.FloorRepository;
import utez.edu.mx.hospitalback.modules.user.Rol;
import utez.edu.mx.hospitalback.modules.user.RolRepository;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private FloorRepository floorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeRoles();
        initializeFloors();
        initializeUsers();
    }

    private void initializeRoles() {
        if (rolRepository.findByName("ADMIN").isEmpty()) {
            Rol adminRole = new Rol();
            adminRole.setName("ADMIN");
            rolRepository.save(adminRole);
        }

        if (rolRepository.findByName("SECRETARIA").isEmpty()) {
            Rol secretariaRole = new Rol();
            secretariaRole.setName("SECRETARIA");
            rolRepository.save(secretariaRole);
        }

        if (rolRepository.findByName("ENFERMERA").isEmpty()) {
            Rol enfermeraRole = new Rol();
            enfermeraRole.setName("ENFERMERA");
            rolRepository.save(enfermeraRole);
        }
    }

    private void initializeFloors() {
        if (floorRepository.findByName("P1").isEmpty()) {
            Floor floor1 = new Floor();
            floor1.setName("P1");
            floor1.setDescription("Piso 1 - Administración");
            floorRepository.save(floor1);
        }

        if (floorRepository.findByName("P2").isEmpty()) {
            Floor floor2 = new Floor();
            floor2.setName("P2");
            floor2.setDescription("Piso 2 - Medicina General");
            floorRepository.save(floor2);
        }
    }

    private void initializeUsers() {
        // Obtener roles y pisos
        Rol adminRole = rolRepository.findByName("ADMIN").orElseThrow();
        Rol secretariaRole = rolRepository.findByName("SECRETARIA").orElseThrow();
        Rol enfermeraRole = rolRepository.findByName("ENFERMERA").orElseThrow();

        Floor floor1 = floorRepository.findByName("P1").orElseThrow();
        Floor floor2 = floorRepository.findByName("P2").orElseThrow();

        // Crear usuario admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setUsername("admin");
            admin.setEmail("admin@hospital.com");
            admin.setPhone("1234567890");
            admin.setPassword(passwordEncoder.encode("root"));
            admin.setRol(adminRole);
            admin.setFloor(floor1);
            userRepository.save(admin);
        }

        // Crear usuario adrian
        if (userRepository.findByUsername("adrian").isEmpty()) {
            User adrian = new User();
            adrian.setName("Adrian");
            adrian.setUsername("adrian");
            adrian.setEmail("adrian@hospital.com");
            adrian.setPhone("1234567891");
            adrian.setPassword(passwordEncoder.encode("root"));
            adrian.setRol(secretariaRole);
            adrian.setFloor(floor1);
            userRepository.save(adrian);
        }

        // Crear usuario isai
        if (userRepository.findByUsername("isai").isEmpty()) {
            User isai = new User();
            isai.setName("Isai");
            isai.setUsername("isai");
            isai.setEmail("isai@hospital.com");
            isai.setPhone("1234567892");
            isai.setPassword(passwordEncoder.encode("root"));
            isai.setRol(secretariaRole);
            isai.setFloor(floor1);
            userRepository.save(isai);
        }

        // Crear usuario jassiel
        if (userRepository.findByUsername("jassiel").isEmpty()) {
            User jassiel = new User();
            jassiel.setName("Jassiel");
            jassiel.setUsername("jassiel");
            jassiel.setEmail("jassiel@hospital.com");
            jassiel.setPhone("1234567893");
            jassiel.setPassword(passwordEncoder.encode("root"));
            jassiel.setRol(enfermeraRole);
            jassiel.setFloor(floor2);
            userRepository.save(jassiel);
        }

        // Crear usuario ayala
        if (userRepository.findByUsername("ayala").isEmpty()) {
            User ayala = new User();
            ayala.setName("Ayala");
            ayala.setUsername("ayala");
            ayala.setEmail("ayala@hospital.com");
            ayala.setPhone("1234567894");
            ayala.setPassword(passwordEncoder.encode("root"));
            ayala.setRol(enfermeraRole);
            ayala.setFloor(floor2);
            userRepository.save(ayala);
        }
    }
}
