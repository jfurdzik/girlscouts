package com.girlscouts.cookies.reports;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository
        extends JpaRepository<Reports, Long> {

    List<Reports> findByEventId(Long eventId);

    List<Reports> findByUserId(Long userId);

}
