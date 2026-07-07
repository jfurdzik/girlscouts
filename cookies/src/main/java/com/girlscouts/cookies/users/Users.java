package com.girlscouts.cookies.users;
import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    private Role role;


    public Users(){}

    public Users(
            String firstName,
            String lastName,
            String serviceUnit,
            Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.serviceUnit = serviceUnit;
        this.role = role;
    }
}