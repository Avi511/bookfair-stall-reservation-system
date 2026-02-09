package org.example.backend.repositories;

import org.example.backend.entities.Reservation;
import org.example.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByUser(User user);
}