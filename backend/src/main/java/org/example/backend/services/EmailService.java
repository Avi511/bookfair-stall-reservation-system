package org.example.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String businessName, String stall) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Stall Reservation Confirmed");
        message.setText(
                "Hello " + businessName + ",\n\n" +
                        "Your stall reservation is confirmed.\n" +
                        "Stall: " + stall + "\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }
}
