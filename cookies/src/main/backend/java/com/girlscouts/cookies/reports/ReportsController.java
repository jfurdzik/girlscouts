package com.girlscouts.cookies.reports;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
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
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @PostMapping
    public Reports createReport(@RequestBody Reports report) {
        return reportsService.createReport(report);
    }

    @PutMapping("/{reportId}")
    public Reports updateReport(
            @PathVariable Long reportId,
            @RequestBody Reports report) {

        return reportsService.updateReport(reportId, report);
    }

    @DeleteMapping("/{reportId}")
    public void deleteReport(@PathVariable Long reportId) {
        reportsService.deleteReport(reportId);
    }
}