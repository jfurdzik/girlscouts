package com.girlscouts.cookies.notifications;

import org.springframework.stereotype.Service;

@Service
public class NotificationSettingsService {

    private final NotificationSettingsRepository repository;

    public NotificationSettingsService(NotificationSettingsRepository repository) {
        this.repository = repository;
    }

    /** Always returns the singleton row, creating it with defaults on first access. */
    public NotificationSettings getSettings() {
        return repository.findById(1L).orElseGet(() -> repository.save(new NotificationSettings()));
    }

    public NotificationSettings updateSettings(NotificationSettings updated) {
        NotificationSettings settings = getSettings();
        settings.setSignupEmailsEnabled(updated.isSignupEmailsEnabled());
        settings.setBoostEmailsEnabled(updated.isBoostEmailsEnabled());
        settings.setLowCoverageReminderEnabled(updated.isLowCoverageReminderEnabled());
        settings.setReminderDaysBefore(updated.getReminderDaysBefore());
        settings.setReminderThresholdPercent(updated.getReminderThresholdPercent());
        settings.setSignupEmailSubject(updated.getSignupEmailSubject());
        settings.setSignupEmailBody(updated.getSignupEmailBody());
        settings.setBoostEmailSubject(updated.getBoostEmailSubject());
        settings.setBoostEmailBody(updated.getBoostEmailBody());
        settings.setReminderEmailSubject(updated.getReminderEmailSubject());
        settings.setReminderEmailBody(updated.getReminderEmailBody());
        return repository.save(settings);
    }
}
