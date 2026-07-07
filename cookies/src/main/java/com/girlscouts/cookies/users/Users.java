package com.girlscouts.cookies.users;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import jakarta.persistence.*;
import java.util.ArrayList;

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
        this.leadCards = leadCards;
    }

    // getters and setters

    public Long getId() { return id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getServiceUnit() { return serviceUnit; }
    public void setServiceUnit(String serviceUnit) { this.serviceUnit = serviceUnit; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public List<LeadCard> getLeadCards() { return leadCards; }
    public void setLeadCards(List<LeadCard> leadCards) { this.leadCards = leadCards; }

    public void addLeadCard(LeadCard leadCard) {
        leadCards.add(leadCard);
        leadCard.setUser(this);
    }
}