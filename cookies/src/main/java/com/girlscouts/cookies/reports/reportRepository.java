@Repository
public interface ReportRepository
        extends JpaRepository<Report, Long> {

    List<Report> findByEventId(Long eventId);
}