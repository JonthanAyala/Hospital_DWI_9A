package utez.edu.mx.hospitalback.modules.floor;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import utez.edu.mx.hospitalback.modules.bed.Bed;
import utez.edu.mx.hospitalback.modules.user.User;

import java.util.List;

@Entity
@Table(name = "floor")
@Getter
@Setter
public class Floor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    @NotBlank(message = "El nombre del piso es obligatorio")
    @Pattern(regexp = "^P[1-9]\\d*$", message = "El formato del piso debe ser P1, P2, P3, etc.")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "floor")
    @JsonBackReference
    private List<User> users;

    @OneToMany(mappedBy = "floor")
    @JsonBackReference
    private List<Bed> beds;

    public Floor() {
    }
}