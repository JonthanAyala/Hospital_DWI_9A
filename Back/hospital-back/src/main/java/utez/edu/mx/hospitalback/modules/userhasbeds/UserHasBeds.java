package utez.edu.mx.hospitalback.modules.userhasbeds;

import jakarta.persistence.*;
import utez.edu.mx.hospitalback.modules.bed.Bed;
import utez.edu.mx.hospitalback.modules.user.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_has_beds")
public class UserHasBeds {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_bed", nullable = false)
    private Bed bed;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    public UserHasBeds() {
        this.assignedDate = LocalDateTime.now();
    }

    public UserHasBeds(User user, Bed bed) {
        this.user = user;
        this.bed = bed;
        this.assignedDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bed getBed() {
        return bed;
    }

    public void setBed(Bed bed) {
        this.bed = bed;
    }

    public LocalDateTime getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(LocalDateTime assignedDate) {
        this.assignedDate = assignedDate;
    }
}
