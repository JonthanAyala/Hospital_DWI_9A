package utez.edu.mx.hospitalback.modules.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.hospitalback.modules.floor.Floor;
import utez.edu.mx.hospitalback.modules.userhasbeds.UserHasBeds;
import utez.edu.mx.hospitalback.modules.user.Rol; // Se corrigió para importar la clase Rol

import java.util.List;

@Entity
@Table(name = "user")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @Column(name = "username", nullable = false, unique = true)
    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    private String email;

    @Column(name = "phone", nullable = false)
    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^\\d{10}$", message = "El teléfono debe tener 10 dígitos")
    private String phone;

    @Column(name = "password", nullable = false)
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    @JsonManagedReference
    private Rol rol; // Se corrigió para usar Rol

    @ManyToOne
    @JoinColumn(name = "id_floor", nullable = false)
    @JsonManagedReference
    private Floor floor;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<UserHasBeds> userHasBeds;

    public User() {
    }
}
