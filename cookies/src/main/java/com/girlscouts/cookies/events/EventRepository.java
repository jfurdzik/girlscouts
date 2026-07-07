package com.girlscouts.cookies.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByEventDate(LocalDate eventDate);

    List<Event> findBySchoolId(Long schoolId);

    List<Event> findByEventNameContainingIgnoreCase(String eventName);

}