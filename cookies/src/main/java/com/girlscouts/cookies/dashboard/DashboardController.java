package com.girlscouts.cookies.dashboard;

import com.girlscouts.cookies.assignments.Assignment;
import com.girlscouts.cookies.assignments.AssignmentRepository;
import com.girlscouts.cookies.events.Event;
import com.girlscouts.cookies.events.EventRepository;
import com.girlscouts.cookies.events.EventStatus;
import com.girlscouts.cookies.users.LeadCardRepository;
import com.girlscouts.cookies.users.Role;
import com.girlscouts.cookies.users.UsersRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

/**
 * Deliberately simple, per "Do not overcomplicate reporting" — a handful of
 * numbers computed from data that already exists, no new reporting
 * infrastructure. Manager-only (see SecurityConfig catch-all rule).
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EventRepository eventRepository;
    private final AssignmentRepository assignmentRepository;
    private final UsersRepository usersRepository;
    private final LeadCardRepository leadCardRepository;

    public DashboardController(
            EventRepository eventRepository,
            AssignmentRepository assignmentRepository,
            UsersRepository usersRepository,
            LeadCardRepository leadCardRepository) {
        this.eventRepository = eventRepository;
        this.assignmentRepository = assignmentRepository;
        this.usersRepository = usersRepository;
        this.leadCardRepository = leadCardRepository;
    }

    @GetMapping("/metrics")
    public DashboardMetrics getMetrics() {
        LocalDate today = LocalDate.now();
        List<Event> events = eventRepository.findAll();

        long upcomingEvents = events.stream()
                .filter(e -> e.getEventDate() != null && !e.getEventDate().isBefore(today))
                .count();

        long openEvents = events.stream()
                .filter(e -> e.getStatus() == EventStatus.OPEN)
                .count();

        long totalVolunteers = usersRepository.findByRole(Role.VOLUNTEER).size();
        long totalLeads = leadCardRepository.count();

        YearMonth thisMonth = YearMonth.now();
        long leadsThisMonth = leadCardRepository.findAll().stream()
                .filter(l -> l.getSubmissionDate() != null && YearMonth.from(l.getSubmissionDate()).equals(thisMonth))
                .count();

        double averageCoverage = events.stream()
                .filter(e -> e.getCapacity() != null && e.getCapacity() > 0)
                .mapToDouble(e -> {
                    long count = assignmentRepository.findByEventId(e.getEventId()).stream()
                            .filter(a -> a.getStatus() == null || !a.getStatus().equalsIgnoreCase("CANCELLED"))
                            .count();
                    return (count * 100.0) / e.getCapacity();
                })
                .average()
                .orElse(0.0);

        return new DashboardMetrics(upcomingEvents, openEvents, totalVolunteers, totalLeads, leadsThisMonth, averageCoverage);
    }
}
