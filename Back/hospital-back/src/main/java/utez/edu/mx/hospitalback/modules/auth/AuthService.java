package utez.edu.mx.hospitalback.modules.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.hospitalback.modules.auth.dto.LoginRequestDTO;
import utez.edu.mx.hospitalback.modules.user.User;
import utez.edu.mx.hospitalback.modules.user.UserRepository;
import utez.edu.mx.hospitalback.security.jwt.JWTUtils;
import utez.edu.mx.hospitalback.security.jwt.UDService;
import utez.edu.mx.hospitalback.utils.APIResponse;
import utez.edu.mx.hospitalback.utils.PasswordEncoder;

import java.sql.SQLException;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private UDService udService;

    @Transactional(readOnly = true)
    public APIResponse doLogin(LoginRequestDTO payload){
        try {
            User found = userRepository.findByUsername(
                    payload.getUsername()
            ).orElse(null);
            if (found == null) {
                return new APIResponse("Usuario no encontrado", false, HttpStatus.NOT_FOUND);
            }

            if (!PasswordEncoder.verifyPassword(
                    payload.getPassword(),
                    found.getPassword()
            )) {
                return new APIResponse("Contraseña no coincide", false, HttpStatus.BAD_REQUEST);
            }
            UserDetails userDetails = udService.loadUserByUsername(found.getUsername());
            String token = jwtUtils.generateToken(userDetails);
            return new APIResponse("Inicio de sesión exitoso", token,false, HttpStatus.OK);

        }catch (Exception e){
            e.printStackTrace();
            return new APIResponse("Error al iniciar sesión", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public APIResponse register(User payload){
        try{
            if(userRepository.findByUsername(payload.getUsername()).isPresent()){
                return new APIResponse("El usuario ya existe", false, HttpStatus.BAD_REQUEST);
            }
            payload.setPassword(PasswordEncoder.encodePassword(payload.getPassword()));
            userRepository.save(payload);
            return new APIResponse("Usuario registrado exitosamente", null, false, HttpStatus.CREATED);
        }catch (Exception e){
            e.printStackTrace();
            return new APIResponse("Error al registrar usuario", false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
