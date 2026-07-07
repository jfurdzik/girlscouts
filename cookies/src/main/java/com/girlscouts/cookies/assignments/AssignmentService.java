package com.girlscouts.cookies.assignments;

import com.girlscouts.cookies.email.EmailService;
import com.girlscouts.cookies.email.TemplateUtil;
import com.girlscouts.cookies.events.Event;
import com.girlscouts.cookies.events.EventRepository;
import com.girlscouts.cookies.exceptions.BadRequestException;
import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import com.girlscouts.cookies.notifications.NotificationSettings;
import com.girlscouts.cookies.notifications.NotificationSettingsService;
import com.girlscouts.cookies.users.Role;
import com.girlscouts.cookies.users.Users;
import com.girlscouts.cookies.users.UsersRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UsersRepository usersRepository;
    private final EventRepository eventRepository;
    private final EmailService emailService;
    private final NotificationSettingsService notificationSettingsService;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId);
    }

    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getUserId() != null) {
            Users user = usersRepository.findById(assignment.getUserId())
                    .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("User not found"));
            user.setAssignmentCount(user.getAssignmentCount() + 1);
            usersRepository.save(user);
        }
        return assignmentRepository.save(assignment);
    }

    /**
     * Public volunteer self-signup flow — this is what powers the "Sign Up For
     * Event" button on the public site (POST /api/events/{eventId}/signup).
     * Finds an existing volunteer by email or creates a lightweight one, then
     * creates the Assignment and (if enabled) sends a confirmation email.
     */
    public Assignment signUpForEvent(Long eventId, String name, String email) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (event.getCapacity() != null) {
            long currentCount = assignmentRepository.findByEventId(eventId).stream()
                    .filter(a -> a.getStatus() == null || !a.getStatus().equalsIgnoreCase("CANCELLED"))
                    .count();
            if (currentCount >= event.getCapacity()) {
                throw new BadRequestException("This event is already full.");
            }
        }

        Users volunteer = usersRepository.findByEmail(email).orElseGet(() -> {
            Users u = new Users();
            String[] parts = name.trim().split("\\s+", 2);
            u.setFirstName(parts[0]);
            u.setLastName(parts.length > 1 ? parts[1] : "");
            u.setEmail(email);
            u.setRole(Role.VOLUNTEER);
            return usersRepository.save(u);
        });

        Assignment assignment = new Assignment();
        assignment.setUserId(volunteer.getId());
        assignment.setEventId(eventId);
        assignment.setStatus("CONFIRMED");
        assignment = createAssignment(assignment);

        sendSignupConfirmation(volunteer, event);

        return assignment;
    }

    private void sendSignupConfirmation(Users volunteer, Event event) {
        NotificationSettings settings = notificationSettingsService.getSettings();
        if (!settings.isSignupEmailsEnabled()) return;

        Map<String, String> values = Map.of(
                "volunteerName", volunteer.getFirstName(),
                "eventName", event.getEventName(),
                "eventDate", event.getEventDate() != null ? event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy")) : "",
                "eventTime", (event.getStartTime() != null ? event.getStartTime().toString() : "") +
                        (event.getEndTime() != null ? " - " + event.getEndTime() : ""),
                "location", event.getLocation() != null ? event.getLocation() : "",
                "contactName", "Your Troop Leader",
                "contactEmail", "info@girlscouts-example.org"
        );

        String subject = TemplateUtil.render(settings.getSignupEmailSubject(), values);
        String body = TemplateUtil.render(settings.getSignupEmailBody(), values);
        emailService.send(volunteer.getEmail(), subject, body);
    }

    public Assignment updateAssignment(Long assignmentId, Assignment updatedAssignment) {


        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Assignment not found"));

        Long oldUserId = assignment.getUserId();
        Long newUserId = updatedAssignment.getUserId();

        // Only update counts if the assignment owner changed
        if (!java.util.Objects.equals(oldUserId, newUserId)) {
            if (oldUserId != null) {
                Users oldUser = usersRepository.findById(oldUserId)
                        .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Old user not found"));
                oldUser.setAssignmentCount(Math.max(0, oldUser.getAssignmentCount() - 1));
                usersRepository.save(oldUser);
            }
            if (newUserId != null) {
                Users newUser = usersRepository.findById(newUserId)
                        .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("New user not found"));
                newUser.setAssignmentCount(newUser.getAssignmentCount() + 1);
                usersRepository.save(newUser);
            }
        }
        assignment.setUserId(newUserId);
        assignment.setEventId(updatedAssignment.getEventId());
        assignment.setStatus(updatedAssignment.getStatus());

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Assignment not found"));

        if (assignment.getUserId() != null) {
            Users user = usersRepository.findById(assignment.getUserId()).orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("User not found"));

            user.setAssignmentCount(Math.max(0, user.getAssignmentCount() - 1));
            usersRepository.save(user);
        }
        assignmentRepository.delete(assignment);
    }
}
