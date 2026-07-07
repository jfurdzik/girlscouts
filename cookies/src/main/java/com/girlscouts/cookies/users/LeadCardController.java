package com.girlscouts.cookies.users;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * NOTE on access: POST here is intentionally public (see SecurityConfig) since
 * anyone scanning a QR code needs to submit a lead without logging in. All
 * other operations (viewing/updating leads) are manager-only.
 */
@RestController
@RequestMapping("/api/leadcards")
public class LeadCardController {

    private final LeadCardService leadCardService;

    public LeadCardController(LeadCardService leadCardService) {
        this.leadCardService = leadCardService;
    }

    @GetMapping
    public List<LeadCard> getAllLeadCards() {
        return leadCardService.getAllLeadCards();
    }

    @GetMapping("/{id}")
    public LeadCard getLeadCardById(@PathVariable Long id) {
        return leadCardService.getLeadCardById(id);
    }

    @GetMapping("/school/{school}")
    public List<LeadCard> getLeadsBySchool(@PathVariable String school) {
        return leadCardService.getLeadsBySchool(school);
    }

    @PostMapping
    public ResponseEntity<LeadCard> submitLead(
            @Valid @RequestBody LeadCard leadCard,
            @RequestParam(required = false) Long volunteerId) {

        LeadCard saved = leadCardService.submitLead(leadCard, volunteerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PatchMapping("/{id}/status")
    public LeadCard updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        LeadStatus status = LeadStatus.valueOf(body.get("status").toUpperCase());
        return leadCardService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeadCard(@PathVariable Long id) {
        leadCardService.deleteLeadCard(id);
        return ResponseEntity.noContent().build();
    }
}
