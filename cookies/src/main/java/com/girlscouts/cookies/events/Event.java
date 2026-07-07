package com.girlscouts.cookies.events;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Event date is required")
    private LocalDate eventDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private String description;

    /** Optional link to a School record for address/contact details. */
    private Long schoolId;

    /**
     * Free-text location, used when an event isn't tied to a School record
     * (e.g. a standalone cookie booth at a grocery store).
     */
    private String location;

    @Min(value = 0, message = "Capacity cannot be negative")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.OPEN;

    private String followUpInfo;
}
