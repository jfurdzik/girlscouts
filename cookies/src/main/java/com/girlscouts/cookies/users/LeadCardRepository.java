package com.girlscouts.cookies.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadCardRepository extends JpaRepository<LeadCard, Long> {

    List<LeadCard> findBySchool(String school);

    List<LeadCard> findByStatus(LeadStatus status);

    List<LeadCard> findByUserId(Long userId);
}
