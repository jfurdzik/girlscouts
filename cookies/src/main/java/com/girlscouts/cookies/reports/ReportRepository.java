@Repository
public interface ReportRepository
        extends JpaRepository<Report, Long> {

    List<Report> findByEventId(Long eventId);

    List<Reports> findByUserId(Long userId);

}
