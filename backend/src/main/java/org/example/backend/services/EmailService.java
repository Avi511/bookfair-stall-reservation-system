package org.example.backend.services;

import org.example.backend.entities.Reservation;
import org.example.backend.entities.User;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String businessName, String stall) {
        try {
            String subject = "Reservation Confirmed";
            String resolvedStall = (stall == null || stall.isBlank()) ? "N/A" : stall;
            String html = """
                    <div style="font-family:Arial,sans-serif;">
                      <h2>Reservation Confirmed</h2>
                      <p>Hello %s,</p>
                      <p>Your reservation is confirmed.</p>
                      <ul>
                        <li><b>Stall:</b> %s</li>
                      </ul>
                      <p>Thank you.</p>
                    </div>
                    """.formatted(
                    safe(businessName),
                    resolvedStall
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
    }

    public void sendReservationConfirmation(User user, Reservation reservation, byte[] qrPng) {
        try {
            String stallList = reservation.getReservationStalls()
                    .stream()
                    .map(rs -> rs.getStall().getStallCode())
                    .collect(Collectors.joining(", "));

            String subject = "Book Fair Reservation Confirmed";

            String html = """
                    <div style="font-family:Arial,sans-serif;">
                      <h2>Reservation Confirmed ✅</h2>
                      <p>Hello %s,</p>
                      <p>Your reservation is confirmed.</p>
                      <ul>
                        <li><b>Reservation ID:</b> %s</li>
                        <li><b>Event ID:</b> %s</li>
                        <li><b>Stalls:</b> %s</li>
                        <li><b>QR Token:</b> %s</li>
                      </ul>
                      <p>Show this QR at the entrance:</p>
                      <img src="cid:qrImage" style="width:220px;height:220px;" />
                      <p>Thank you.</p>
                    </div>
                    """.formatted(
                    safe(user.getBusinessName()),
                    reservation.getId(),
                    reservation.getEvent().getId(),
                    stallList,
                    reservation.getQrToken().toString()
            );

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(html, true);

            // Inline image (CID)
            helper.addInline("qrImage", new ByteArrayResource(qrPng), "image/png");

            // Also attach (optional, but useful)
            helper.addAttachment("reservation-qr.png", new ByteArrayResource(qrPng), "image/png");

            mailSender.send(message);

        } catch (Exception e) {
            // IMPORTANT: do not break reservation flow
            System.err.println("Email sending failed: " + e.getMessage());
        }
    }
    public void sendSimpleQrEmail(String to, String token, byte[] qrPng) {
        try {
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("QR Test - Book Fair");
            helper.setText("<p>Token: <b>" + token + "</b></p><img src='cid:qrImage'/>", true);

            helper.addInline("qrImage", new ByteArrayResource(qrPng), "image/png");
            helper.addAttachment("qr.png", new ByteArrayResource(qrPng), "image/png");

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }
    }


    private String safe(String s) {
        return (s == null || s.isBlank()) ? "Business User" : s;
    }
}
