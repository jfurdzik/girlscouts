package com.girlscouts.cookies.events;

import com.girlscouts.cookies.assignments.AssignmentRepository;
import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final AssignmentRepository assignmentRepository;

    public EventService(EventRepository eventRepository, AssignmentRepository assignmentRepository) {
        this.eventRepository = eventRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Event updatedEvent) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Event not found"));

        event.setEventName(updatedEvent.getEventName());
        event.setEventDate(updatedEvent.getEventDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setDescription(updatedEvent.getDescription());
        event.setSchoolId(updatedEvent.getSchoolId());
        event.setLocation(updatedEvent.getLocation());
        event.setCapacity(updatedEvent.getCapacity());
        event.setStatus(updatedEvent.getStatus());
        event.setFollowUpInfo(updatedEvent.getFollowUpInfo());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }

    /** Number of ACCEPTED/CONFIRMED assignments for an event — used by the volunteer dashboard. */
    public long getVolunteerCount(Long eventId) {
        return assignmentRepository.findByEventId(eventId).stream()
                .filter(a -> a.getStatus() == null || !a.getStatus().equalsIgnoreCase("CANCELLED"))
                .count();
    }
}
