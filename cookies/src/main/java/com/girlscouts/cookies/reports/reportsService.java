package com.girlscouts.cookies.reports;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportsService {

    private final ReportsRepository reportsRepository;

    public ReportsService(ReportsRepository reportsRepository) {
        this.reportsRepository = reportsRepository;
    }

    public List<Reports> getAllReports() {
        return reportsRepository.findAll();
    }

    public Optional<Reports> getReportById(Long reportId) {
        return reportsRepository.findById(reportId);
    }

    public Reports createReport(Reports report) {
        return reportsRepository.save(report);
    }

    public Reports updateReport(Long reportId, Reports updatedReport) {

        Reports report = reportsRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setEventId(updatedReport.getEventId());
        report.setUserId(updatedReport.getUserId());
        report.setLeadCards(updatedReport.getLeadCards());
        report.setNotes(updatedReport.getNotes());
        report.setSubmissionDate(updatedReport.getSubmissionDate());

        return reportsRepository.save(report);
    }

    public void deleteReport(Long reportId) {
        reportsRepository.deleteById(reportId);
    }
}