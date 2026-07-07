package com.girlscouts.cookies.availability;

import com.girlscouts.cookies.assignments.Assignment;
import com.girlscouts.cookies.assignments.AssignmentRepository;
import com.girlscouts.cookies.events.Event;
import com.girlscouts.cookies.events.EventRepository;
import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import com.girlscouts.cookies.reports.Reports;
import com.girlscouts.cookies.reports.ReportRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final EventRepository eventRepository;
    private final AssignmentRepository assignmentRepository;
    private final ReportRepository reportRepository;

    public AvailabilityController(
            EventRepository eventRepository,
            AssignmentRepository assignmentRepository,
            ReportRepository reportRepository) {

        this.eventRepository = eventRepository;
        this.assignmentRepository = assignmentRepository;
        this.reportRepository = reportRepository;
    }

    /*
        GET /availability?date=2026-07-10

        Returns:
        [
          "09:00",
          "09:30",
          "10:00"
        ]
     */
    @GetMapping
    public List<String> getAvailability(
            @RequestParam LocalDate date) {

        return eventRepository.findByEventDate(date) //
                .stream()
                .map(event ->
                        event.getStartTime().toString())
                .toList();
    }

    /*
        GET /availability/123

        Returns complete event page data
     */
    @GetMapping("/{id}")
    public EventDetailsDTO getEventInfo(
            @PathVariable Long id) {

        Event event = eventRepository.findBySchoolId(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Event not found"));


        List<Assignment> assignments =
                assignmentRepository.findByEventId(id);

        List<Reports> reports =
                reportRepository.findByEventId(id);

        int totalLeadCards = reports.stream()
                .mapToInt(Reports::getLeadCards)
                .sum();

        return new EventDetailsDTO(
                event,
                assignments,
                totalLeadCards
        );
        //return null;
    }
}