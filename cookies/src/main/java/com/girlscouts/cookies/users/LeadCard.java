package com.girlscouts.cookies.users;

import jakarta.persistence.*;

@Entity
public class LeadCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String childName;
    private String parentName;
    private String email;
    private String contact;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    public LeadCard() {}

    public LeadCard(String childName, String parentName, String email, String contact, Users user) {
        this.childName = childName;
        this.parentName = parentName;
        this.email = email;
        this.contact = contact;
        this.user = user;
    }

    // getters and setters
    public Long getId() { return id; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}