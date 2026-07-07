package com.girlscouts.cookies.events;

import com.girlscouts.cookies.assignments.Assignment;
import com.girlscouts.cookies.assignments.AssignmentRepository;
import com.girlscouts.cookies.email.EmailService;
import com.girlscouts.cookies.email.TemplateUtil;
import com.girlscouts.cookies.exceptions.BadRequestException;
import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import com.girlscouts.cookies.notifications.NotificationSettings;
import com.girlscouts.cookies.notifications.NotificationSettingsService;
import com.girlscouts.cookies.users.Role;
import com.girlscouts.cookies.users.Users;
import com.girlscouts.cookies.users.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * "Boost Event": managers can nudge a filtered set of volunteers by email to
 * encourage signups for an under-covered event.
 */
@Service
public class EventBoostService {

    private final EventRepository eventRepository;
    private final AssignmentRepository assignmentRepository;
    private final UsersRepository usersRepository;
    private final EmailService emailService;
    private final NotificationSettingsService notificationSettingsService;

    public EventBoostService(
            EventRepository eventRepository,
            AssignmentRepository assignmentRepository,
            UsersRepository usersRepository,
            EmailService emailService,
            NotificationSettingsService notificationSettingsService) {
        this.eventRepository = eventRepository;
        this.assignmentRepository = assignmentRepository;
        this.usersRepository = usersRepository;
        this.emailService = emailService;
        this.notificationSettingsService = notificationSettingsService;
    }

    public int boost(Long eventId, BoostRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        NotificationSettings settings = notificationSettingsService.getSettings();
        if (!settings.isBoostEmailsEnabled()) {
            throw new BadRequestException("Boost emails are disabled in Notification Settings.");
        }

        List<Users> recipients = resolveAudience(request);

        Map<String, String> baseValues = Map.of(
                "eventName", event.getEventName(),
                "eventDate", event.getEventDate() != null ? event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")) : "",
                "eventTime", (event.getStartTime() != null ? event.getStartTime().toString() : "") +
                        (event.getEndTime() != null ? " - " + event.getEndTime() : ""),
                "location", event.getLocation() != null ? event.getLocation() : "",
                "signupLink", "/#/events/" + event.getEventId()
        );

        int sent = 0;
        for (Users recipient : recipients) {
            if (recipient.getEmail() == null || recipient.getEmail().isBlank()) continue;

            Map<String, String> values = new java.util.HashMap<>(baseValues);
            values.put("volunteerName", recipient.getFirstName());

            String subject = TemplateUtil.render(settings.getBoostEmailSubject(), values);
            String body = TemplateUtil.render(settings.getBoostEmailBody(), values);
            emailService.send(recipient.getEmail(), subject, body);
            sent++;
        }
        return sent;
    }

    /** Used by the scheduled low-coverage job — reuses the "previous volunteers" audience with the reminder template. */
    public int sendLowCoverageReminder(Event event) {
        NotificationSettings settings = notificationSettingsService.getSettings();
        List<Users> recipients = resolveAudience(new BoostRequest("PREVIOUS", null));

        Map<String, String> baseValues = Map.of(
                "eventName", event.getEventName(),
                "eventDate", event.getEventDate() != null ? event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")) : "",
                "eventTime", (event.getStartTime() != null ? event.getStartTime().toString() : "") +
                        (event.getEndTime() != null ? " - " + event.getEndTime() : ""),
                "location", event.getLocation() != null ? event.getLocation() : ""
        );

        int sent = 0;
        for (Users recipient : recipients) {
            if (recipient.getEmail() == null || recipient.getEmail().isBlank()) continue;
            Map<String, String> values = new java.util.HashMap<>(baseValues);
            values.put("volunteerName", recipient.getFirstName());
            String subject = TemplateUtil.render(settings.getReminderEmailSubject(), values);
            String body = TemplateUtil.render(settings.getReminderEmailBody(), values);
            emailService.send(recipient.getEmail(), subject, body);
            sent++;
        }
        return sent;
    }

    private List<Users> resolveAudience(BoostRequest request) {
        String audience = request.audience() == null ? "ALL" : request.audience().toUpperCase();

        return switch (audience) {
            case "SERVICE_UNIT" -> usersRepository.findByServiceUnit(request.value()).stream()
                    .filter(u -> u.getRole() == Role.VOLUNTEER)
                    .toList();

            case "SCHOOL" -> {
                Long schoolId = Long.valueOf(request.value());
                Set<Long> eventIds = eventRepository.findAll().stream()
                        .filter(e -> schoolId.equals(e.getSchoolId()))
                        .map(Event::getEventId)
                        .collect(Collectors.toSet());

                Set<Long> userIds = assignmentRepository.findAll().stream()
                        .filter(a -> eventIds.contains(a.getEventId()))
                        .map(Assignment::getUserId)
                        .filter(java.util.Objects::nonNull)
                        .collect(Collectors.toSet());

                yield usersRepository.findAllById(userIds);
            }

            case "PREVIOUS" -> usersRepository.findByRole(Role.VOLUNTEER).stream()
                    .filter(u -> u.getAssignmentCount() > 0)
                    .toList();

            default -> usersRepository.findByRole(Role.VOLUNTEER);
        };
    }
}
