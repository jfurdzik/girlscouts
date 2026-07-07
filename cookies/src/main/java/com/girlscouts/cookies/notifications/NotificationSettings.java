package com.girlscouts.cookies.notifications;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Singleton settings row (always id=1) controlling the email/notification
 * behavior described in the spec. Editable from the manager portal instead of
 * being hardcoded, per "store settings in the backend."
 */
@Getter
@Setter
@Entity
@Table(name = "notification_settings")
public class NotificationSettings {

    @Id
    private Long id = 1L;

    private boolean signupEmailsEnabled = true;
    private boolean boostEmailsEnabled = true;
    private boolean lowCoverageReminderEnabled = true;

    /** How many days before the event to send a low-coverage reminder. */
    private int reminderDaysBefore = 3;

    /** If volunteer coverage is below this percent of capacity, send a reminder. */
    private int reminderThresholdPercent = 60;

    @Column(length = 500)
    private String signupEmailSubject = "You're signed up for {eventName}!";

    @Column(length = 2000)
    private String signupEmailBody =
            "Hi {volunteerName},\n\nThanks for signing up to help with {eventName}!\n\n" +
            "Date: {eventDate}\nTime: {eventTime}\nLocation: {location}\n\n" +
            "Questions? Contact {contactName} at {contactEmail}.\n\nSee you there!";

    @Column(length = 500)
    private String boostEmailSubject = "We need volunteers for {eventName}!";

    @Column(length = 2000)
    private String boostEmailBody =
            "Hi {volunteerName},\n\n{eventName} is coming up and could use more volunteers.\n\n" +
            "Date: {eventDate}\nTime: {eventTime}\nLocation: {location}\n\n" +
            "Sign up here: {signupLink}\n\nThank you for all you do!";

    @Column(length = 500)
    private String reminderEmailSubject = "Reminder: {eventName} still needs volunteers";

    @Column(length = 2000)
    private String reminderEmailBody =
            "Hi {volunteerName},\n\n{eventName} on {eventDate} is still below our target volunteer coverage.\n\n" +
            "Time: {eventTime}\nLocation: {location}\n\nCan you help spread the word or sign up for another shift?\n\nThanks!";
}
