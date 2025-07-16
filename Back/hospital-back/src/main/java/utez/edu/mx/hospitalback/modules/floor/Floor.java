package utez.edu.mx.hospitalback.modules.floor;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

@Entity
@Table(name = "floor")
public class Floor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    @NotBlank(message = "El nombre del piso es obligatorio")
    @Pattern(regexp = "^P[1-9]\\d*$", message = "El formato del piso debe ser P1, P2, P3, etc.")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<utez.edu.mx.hospitalback.modules.user.User> users;

    @OneToMany(mappedBy = "floor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<utez.edu.mx.hospitalback.modules.bed.Bed> beds;

    public Floor() {
    }

    public Floor(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<utez.edu.mx.hospitalback.modules.user.User> getUsers() {
        return users;
    }

    public void setUsers(List<utez.edu.mx.hospitalback.modules.user.User> users) {
        this.users = users;
    }

    public List<utez.edu.mx.hospitalback.modules.bed.Bed> getBeds() {
        return beds;
    }

    public void setBeds(List<utez.edu.mx.hospitalback.modules.bed.Bed> beds) {
        this.beds = beds;
    }
}
