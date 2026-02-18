package org.example.backend.repositories;

import org.example.backend.entities.EmailOtp;
import org.example.backend.entities.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    Optional<EmailOtp> findTopByEmailAndPurposeOrderByCreatedAtDesc(
            String email,
            OtpPurpose purpose
    );

    @Query("""
        SELECT COUNT(e) FROM EmailOtp e
        WHERE e.email = :email AND e.purpose = :purpose
        AND e.createdAt >= :since
    """)
    long countSince(
            @Param("email") String email,
            @Param("purpose") OtpPurpose purpose,
            @Param("since") LocalDateTime since);


    @Modifying
    @Query("DELETE FROM EmailOtp e WHERE e.createdAt < :cutoff")
    void deleteCreatedBefore(@Param("cutoff") LocalDateTime cutoff);

}
