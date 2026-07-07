package com.girlscouts.cookies.users;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import jakarta.persistence.*;
import java.util.ArrayList;

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

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeadCard> leadCards = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    public Users() {}
    private int assignmentCount;

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
}