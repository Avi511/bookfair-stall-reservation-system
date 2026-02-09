package org.example.backend.controllers;

import org.example.backend.dtos.ReservationEmailRequest;
import org.example.backend.services.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public String sendEmail(@RequestBody ReservationEmailRequest request) {

        emailService.sendEmail(
                request.getTo(),
                request.getBusinessName(),
                request.getStall()
        );

        return "Email sent successfully!";
    }
}
