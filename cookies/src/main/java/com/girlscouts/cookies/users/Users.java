package com.girlscouts.cookies.users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    private String serviceUnit;

    /**
     * Login fields. Only ADMIN/STAFF users need to actually log in (they're
     * the "managers" from the spec); plain VOLUNTEER records created just to
     * track assignment counts can leave these null.
     */
    @Column(unique = true)
    private String username;

    @Email(message = "Email must be valid")
    private String email;

    /** BCrypt hash — never the raw password. Never serialized back to the client. */
    @JsonIgnore
    private String password;

    /** @JsonIgnore prevents infinite recursion: LeadCard.user serializes back to
     *  this Users record, which would otherwise try to serialize leadCards again. */
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeadCard> leadCards = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    private int assignmentCount;

    public Users() {}

    public Users(
            String firstName,
            String lastName,
            String serviceUnit,
            Role role,
            List<LeadCard> leadCards
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.serviceUnit = serviceUnit;
        this.role = role;
        this.assignmentCount = 0;
    }

    /** "Manager" in the product spec == anyone with elevated (non-volunteer) access. */
    public boolean isManager() {
        return role == Role.ADMIN || role == Role.STAFF;
    }
}
