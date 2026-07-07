package com.girlscouts.cookies.users;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * A lead submitted through the public QR / contact.html form. Previously this
 * entity had no getters/setters at all (they were commented out and there was
 * no Lombok annotation), which meant it silently serialized to "{}" in every
 * API response — fixed by adding @Getter/@Setter below.
 */
@Getter
@Setter
@Entity
@Table(name = "lead_cards")
public class LeadCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Parent name is required")
    private String parentName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String phone;

    private String childName;

    private String school;

    private String grade;

    /** e.g. "Joining a Troop", "Volunteering", "Both" */
    private String interest;

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private LeadStatus status = LeadStatus.NEW;

    private LocalDate submissionDate = LocalDate.now();

    /** The volunteer whose personal QR link generated this lead, if any. */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    public LeadCard() {}
}
