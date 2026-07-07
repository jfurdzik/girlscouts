package com.girlscouts.cookies.assignments;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @GetMapping("/{assignmentId}")
    public Assignment getAssignmentById(@PathVariable Long assignmentId) {
        return assignmentService.getAssignmentById(assignmentId)
                .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Assignment not found"));
    }

    @PostMapping
    public Assignment createAssignment(@Valid @RequestBody Assignment assignment) {
        return assignmentService.createAssignment(assignment);
    }

    @PutMapping("/{assignmentId}")
    public Assignment updateAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody Assignment assignment) {

        return assignmentService.updateAssignment(assignmentId, assignment);
    }

    @DeleteMapping("/{assignmentId}")
    public void deleteAssignment(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignment(assignmentId);
    }
}