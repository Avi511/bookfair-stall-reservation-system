package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.entities.OtpPurpose;
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
@AllArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;


    public void sendReservationConfirmation(User user, Reservation reservation, byte[] qrPng) {
        try {
            String stallList = reservation.getReservationStalls()
                    .stream()
                    .map(rs -> rs.getStall().getStallCode())
                    .collect(Collectors.joining(", "));

            String subject = "Reservation Confirmed";

            String html = """
                    <div style="font-family:Arial,sans-serif;">
                      <h2>Reservation Confirmed</h2>
                      <p>Hello %s,</p>
                      <p>Reservation Confirmed. Thank you for the reservation.</p>
                      <ul>
                        <li><b>Reservation ID:</b> %s</li>
                        <li><b>Event ID:</b> %s</li>
                        <li><b>Stalls:</b> %s</li>
                      </ul>
                      <p>Show this QR at the entrance:</p>
                      <img src="cid:qrImage" style="width:220px;height:220px;" />
                      <p>Thank you.</p>
                    </div>
                    """.formatted(
                    safe(user.getBusinessName()),
                    reservation.getId(),
                    reservation.getEvent().getId(),
                    stallList
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



    public void sendOtpEmail(String to, OtpPurpose purpose, String otp) {
        String subject = (purpose == OtpPurpose.VERIFY_EMAIL)
                ? "Verify your email"
                : "Reset your password";

        String title = (purpose == OtpPurpose.VERIFY_EMAIL)
                ? "Email Verification"
                : "Password Reset";

        String html = """
                <div style="font-family:Arial,sans-serif; line-height:1.5;">
                  <h2>%s</h2>
                  <p>Your OTP code is:</p>
                  <div style="font-size:24px;font-weight:bold;letter-spacing:4px;margin:12px 0;">
                    %s
                  </div>
                  <p>This code expires in <b>%d minutes</b>.</p>
                  <p>If you did not request this, you can ignore this email.</p>
                </div>
                """.formatted(title, otp, OtpService.OTP_EXPIRY_MINUTES);

        sendHtmlEmail(to, subject, html);
    }

    private void sendHtmlEmail(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED,
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


    private String safe(String s) {
        return (s == null || s.isBlank()) ? "Business User" : s;
    }
}
