package com.girlscouts.cookies.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * All outbound email goes through here — the frontend never sends email
 * directly (see NotificationSettingsService for per-feature enable/disable
 * toggles + editable templates).
 *
 * If app.mail.enabled=false (the default until real SMTP credentials are
 * configured), emails are logged to the console instead of actually sent, so
 * the rest of the app (signup, boost, reminders) works out of the box in dev
 * without requiring real mail credentials.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String to, String subject, String body) {
        if (to == null || to.isBlank()) return;

        if (!mailEnabled) {
            System.out.println("[EmailService] (mail disabled, logging instead) To: " + to
                    + " | Subject: " + subject + "\n" + body);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
