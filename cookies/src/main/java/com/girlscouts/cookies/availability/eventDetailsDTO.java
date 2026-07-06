package com.girlscouts.cookies.availability;

import com.girlscouts.cookies.assignments.Assignment;
import com.girlscouts.cookies.events.Event;

import java.util.List;

public class EventDetailsDTO {

    private Event event;

    private List<Assignment> assignments;

    private int totalLeadCards;

    public EventDetailsDTO(
            Event event,
            List<Assignment> assignments,
            int totalLeadCards) {

        this.event = event;
        this.assignments = assignments;
        this.totalLeadCards = totalLeadCards;
    }

    public Event getEvent() {
        return event;
    }

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public int getTotalLeadCards() {
        return totalLeadCards;
    }
}