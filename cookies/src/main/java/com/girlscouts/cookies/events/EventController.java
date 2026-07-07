package com.girlscouts.cookies.events;

import com.girlscouts.cookies.assignments.Assignment;
import com.girlscouts.cookies.assignments.AssignmentService;
import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final AssignmentService assignmentService;

    public EventController(EventService eventService, AssignmentService assignmentService) {
        this.eventService = eventService;
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{eventId}")
    public Event getEventById(@PathVariable Long eventId) {
        return eventService.getEventById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
    }

    @GetMapping("/{eventId}/volunteer-count")
    public Map<String, Long> getVolunteerCount(@PathVariable Long eventId) {
        return Map.of("volunteerCount", eventService.getVolunteerCount(eventId));
    }

    public record SignupRequest(@NotBlank String name, @NotBlank String email) {}

    /** Public — anyone can sign up for an event without logging in. */
    @PostMapping("/{eventId}/signup")
    public ResponseEntity<Assignment> signUp(@PathVariable Long eventId, @Valid @RequestBody SignupRequest request) {
        Assignment assignment = assignmentService.signUpForEvent(eventId, request.name(), request.email());
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    // Manager-only (see SecurityConfig): create/edit/delete events.
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{eventId}")
    public Event updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody Event event) {

        return eventService.updateEvent(eventId, event);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}

