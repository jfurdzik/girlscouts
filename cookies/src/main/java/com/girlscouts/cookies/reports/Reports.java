package com.girlscouts.cookies.reports;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "reports")
public class Reports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private Long eventId;

    private Long userId;

    private Integer leadCards;

    private String notes;

    private LocalDate submissionDate;

    public Reports() {
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setLeadCards(Integer leadCards) {
        this.leadCards = leadCards;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setSubmissionDate(LocalDate submissionDate) {
        this.submissionDate = submissionDate;
    }
}