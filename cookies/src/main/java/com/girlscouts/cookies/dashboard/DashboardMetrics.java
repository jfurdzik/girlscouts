package com.girlscouts.cookies.dashboard;

public record DashboardMetrics(
        long upcomingEvents,
        long openEvents,
        long totalVolunteers,
        long totalLeads,
        long leadsThisMonth,
        double averageCoveragePercent
) {}
