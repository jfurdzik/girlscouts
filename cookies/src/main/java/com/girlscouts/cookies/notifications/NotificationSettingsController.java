package com.girlscouts.cookies.notifications;

import org.springframework.web.bind.annotation.*;

/** Manager-only by default (see SecurityConfig catch-all rule). */
@RestController
@RequestMapping("/api/notification-settings")
public class NotificationSettingsController {

    private final NotificationSettingsService service;

    public NotificationSettingsController(NotificationSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public NotificationSettings getSettings() {
        return service.getSettings();
    }

    @PutMapping
    public NotificationSettings updateSettings(@RequestBody NotificationSettings settings) {
        return service.updateSettings(settings);
    }
}
