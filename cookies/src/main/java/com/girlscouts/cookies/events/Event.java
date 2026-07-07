package com.girlscouts.cookies.events;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "event")
public class Event {

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
