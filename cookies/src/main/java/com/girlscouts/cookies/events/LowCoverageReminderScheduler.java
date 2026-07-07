package com.girlscouts.cookies.events;

import com.girlscouts.cookies.assignments.AssignmentRepository;
import com.girlscouts.cookies.notifications.NotificationSettings;
import com.girlscouts.cookies.notifications.NotificationSettingsService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Runs once a day and emails previous volunteers about any upcoming event
 * that's under-covered, per the configurable threshold/timing in
 * Notification Settings. Timing/threshold are read fresh on every run so a
 * manager can change them without restarting the server.
 */
@Component
public class LowCoverageReminderScheduler {

    private final EventRepository eventRepository;
    private final AssignmentRepository assignmentRepository;
    private final NotificationSettingsService notificationSettingsService;
    private final EventBoostService eventBoostService;

    public LowCoverageReminderScheduler(
            EventRepository eventRepository,
            AssignmentRepository assignmentRepository,
            NotificationSettingsService notificationSettingsService,
            EventBoostService eventBoostService) {
        this.eventRepository = eventRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationSettingsService = notificationSettingsService;
        this.eventBoostService = eventBoostService;
    }

    /** Runs every day at 9:00 AM server time. */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkLowCoverageEvents() {
        NotificationSettings settings = notificationSettingsService.getSettings();
        if (!settings.isLowCoverageReminderEnabled()) return;

        LocalDate targetDate = LocalDate.now().plusDays(settings.getReminderDaysBefore());
        List<Event> events = eventRepository.findByEventDate(targetDate);

        for (Event event : events) {
            if (event.getCapacity() == null || event.getCapacity() == 0) continue;
            if (event.getStatus() == EventStatus.CANCELLED) continue;

            long volunteerCount = assignmentRepository.findByEventId(event.getEventId()).stream()
                    .filter(a -> a.getStatus() == null || !a.getStatus().equalsIgnoreCase("CANCELLED"))
                    .count();

            double coveragePercent = (volunteerCount * 100.0) / event.getCapacity();

            if (coveragePercent < settings.getReminderThresholdPercent()) {
                eventBoostService.sendLowCoverageReminder(event);
            }
        }
    }
}
