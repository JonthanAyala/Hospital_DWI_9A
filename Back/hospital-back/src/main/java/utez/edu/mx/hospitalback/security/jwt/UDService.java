package utez.edu.mx.hospitalback.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import utez.edu.mx.hospitalback.modules.user.User; // Cambiar
import utez.edu.mx.hospitalback.modules.user.UserRepository; // Cambiar

import java.util.Collections;

@Service
public class UDService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("Buscando usuario por username: " + username);

        User found = userRepository.findByUsername(username).orElse(null);
        if (found == null) {
            System.out.println("Usuario no encontrado: " + username);
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        System.out.println("Usuario encontrado: " + found.getUsername());
        System.out.println("Rol del usuario: " + found.getRol().getName());

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + found.getRol().getName());
        System.out.println("Authority creada: " + authority.getAuthority());

        return new org.springframework.security.core.userdetails.User(
                found.getUsername(),
                found.getPassword(),
                Collections.singleton(authority)
        );
    }
}
