package com.girlscouts.cookies.users;

import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadCardService {

    private final LeadCardRepository leadCardRepository;
    private final UsersRepository usersRepository;

    public LeadCardService(LeadCardRepository leadCardRepository, UsersRepository usersRepository) {
        this.leadCardRepository = leadCardRepository;
        this.usersRepository = usersRepository;
    }

    public List<LeadCard> getAllLeadCards() {
        return leadCardRepository.findAll();
    }

    public LeadCard getLeadCardById(Long id) {
        return leadCardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lead not found"));
    }

    /** Public endpoint — anyone scanning the QR code can submit a lead, no auth required. */
    public LeadCard submitLead(LeadCard leadCard, Long volunteerId) {
        if (volunteerId != null) {
            usersRepository.findById(volunteerId).ifPresent(leadCard::setUser);
        }
        leadCard.setStatus(LeadStatus.NEW);
        return leadCardRepository.save(leadCard);
    }

    public LeadCard updateStatus(Long id, LeadStatus status) {
        LeadCard lead = getLeadCardById(id);
        lead.setStatus(status);
        return leadCardRepository.save(lead);
    }

    public List<LeadCard> getLeadsBySchool(String school) {
        return leadCardRepository.findBySchool(school);
    }

    public void deleteLeadCard(Long id) {
        if (!leadCardRepository.existsById(id)) {
            throw new EntityNotFoundException("Lead not found");
        }
        leadCardRepository.deleteById(id);
    }
}
