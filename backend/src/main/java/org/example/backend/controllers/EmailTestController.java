package org.example.backend.controllers;

import org.example.backend.services.EmailService;
import org.example.backend.services.QrCodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email-test")
public class EmailTestController {

    private final EmailService emailService;
    private final QrCodeService qrCodeService;

    public EmailTestController(EmailService emailService, QrCodeService qrCodeService) {
        this.emailService = emailService;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping
    public ResponseEntity<?> sendTest(@RequestParam String to) {
        String token = "TEST-" + System.currentTimeMillis();
        byte[] qr = qrCodeService.generatePng(token);

        emailService.sendSimpleQrEmail(to, token, qr);

        return ResponseEntity.ok(Map.of("message", "Email sent", "token", token));
    }
}
