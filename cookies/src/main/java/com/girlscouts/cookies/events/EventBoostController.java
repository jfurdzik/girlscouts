package com.girlscouts.cookies.events;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Manager-only (see SecurityConfig catch-all). */
@RestController
@RequestMapping("/api/events")
public class EventBoostController {

    private final EventBoostService boostService;

    public EventBoostController(EventBoostService boostService) {
        this.boostService = boostService;
    }

    @PostMapping("/{eventId}/boost")
    public Map<String, Object> boost(@PathVariable Long eventId, @RequestBody BoostRequest request) {
        int sent = boostService.boost(eventId, request);
        return Map.of("sent", sent);
    }
}
