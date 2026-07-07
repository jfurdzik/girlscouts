package com.girlscouts.cookies.schools;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schools")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schoolName;

    private String address;

    private String zipCode;

    @Enumerated(EnumType.STRING)
    private SchoolType schoolType;

    private Boolean allowsFlyers;

    private String contactEmail;

    private String contactPhone;

    @Column(length = 2000)
    private String notes;
}