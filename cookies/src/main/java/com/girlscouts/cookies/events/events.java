package com.girlscouts.cookies.events;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Events {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private String eventName;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String description;

    private Long schoolId;

    private String followUpInfo;
    // Getters, Setters, Constructors
}
