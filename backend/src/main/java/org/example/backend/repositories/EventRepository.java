package org.example.backend.repositories;

import org.example.backend.entities.Event;
import org.example.backend.entities.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByStatus(EventStatus status);

    @Query("""
        select e
        from Event e
        where (:status is null or e.status = :status)
          and (:year is null or e.year = :year)
        order by e.year desc, lower(e.name) asc
    """)
    List<Event> findAllWithFilters(
            @Param("status") EventStatus status,
            @Param("year") Integer year
    );

    boolean existsByNameIgnoreCaseAndYear(String name, Integer year);

    boolean existsByNameIgnoreCaseAndYearAndIdNot(String name, Integer year, Integer id);
}
