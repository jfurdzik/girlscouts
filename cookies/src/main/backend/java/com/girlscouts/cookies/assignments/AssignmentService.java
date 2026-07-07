package com.girlscouts.cookies.assignments;

import com.girlscouts.cookies.users.Users;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import com.girlscouts.cookies.users.UsersRepository;
import lombok.*;

@RequiredArgsConstructor
@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    private final UsersRepository usersRepository;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId);
    }

    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getUserId() != null) {
            Users user = usersRepository.findById(assignment.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setAssignmentCount(user.getAssignmentCount() + 1);
            usersRepository.save(user);
        }
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long assignmentId, Assignment updatedAssignment) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));


        Long oldUserId = assignment.getUserId();
        Long newUserId = updatedAssignment.getUserId();

        // Only update counts if the assignment owner changed
        if (!java.util.Objects.equals(oldUserId, newUserId)) {
            if (oldUserId != null) {
                Users oldUser = usersRepository.findById(oldUserId)
                        .orElseThrow(() -> new RuntimeException("Old user not found"));
                oldUser.setAssignmentCount(Math.max(0, oldUser.getAssignmentCount() - 1));
                usersRepository.save(oldUser);
            }
            if (newUserId != null) {
                Users newUser = usersRepository.findById(newUserId)
                        .orElseThrow(() -> new RuntimeException("New user not found"));
                newUser.setAssignmentCount(newUser.getAssignmentCount() + 1);
                usersRepository.save(newUser);
            }
        }
        assignment.setUserId(newUserId);
        assignment.setEventId(updatedAssignment.getEventId());
        assignment.setStatus(updatedAssignment.getStatus());

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (assignment.getUserId() != null) {
            Users user = usersRepository.findById(assignment.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

            user.setAssignmentCount(Math.max(0, user.getAssignmentCount() - 1));
            usersRepository.save(user);
        }
        assignmentRepository.delete(assignment);
    }
}