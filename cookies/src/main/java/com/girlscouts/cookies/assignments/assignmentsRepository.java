package com.girlscouts.cookies.assignments;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByUserId(Long userId);

    List<Assignment> findByEventId(Long eventId);

    List<Assignment> findByStatus(String status);

}