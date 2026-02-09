package org.example.backend.repositories;

import org.example.backend.entities.Stall;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StallRepository extends JpaRepository<Stall, Long> {
}
