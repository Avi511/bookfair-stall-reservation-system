package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.repositories.EmailOtpRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class OtcCleanupService {

    private final EmailOtpRepository emailOtpRepository;

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanupOtps() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(1);
        emailOtpRepository.deleteCreatedBefore(cutoff);
    }
}
