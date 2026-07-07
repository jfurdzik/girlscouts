package com.girlscouts.cookies.reports;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping
    public List<Reports> getAllReports() {
        return reportsService.getAllReports();
    }

    @GetMapping("/{reportId}")
    public Reports getReportById(@PathVariable Long reportId) {
        return reportsService.getReportById(reportId)
                .orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("Report not found"));
    }

    @PostMapping
    public Reports createReport(@Valid @RequestBody Reports report) {
        return reportsService.createReport(report);
    }

    @PutMapping("/{reportId}")
    public Reports updateReport(
            @PathVariable Long reportId,
            @Valid @RequestBody Reports report) {

        return reportsService.updateReport(reportId, report);
    }

    @DeleteMapping("/{reportId}")
    public void deleteReport(@PathVariable Long reportId) {
        reportsService.deleteReport(reportId);
    }
}