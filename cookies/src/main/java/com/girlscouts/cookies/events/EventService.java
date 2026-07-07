package com.girlscouts.cookies.events;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
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
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setEventName(updatedEvent.getEventName());
        event.setEventDate(updatedEvent.getEventDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setDescription(updatedEvent.getDescription());
        event.setSchoolId(updatedEvent.getSchoolId());
        event.setFollowUpInfo(updatedEvent.getFollowUpInfo());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}