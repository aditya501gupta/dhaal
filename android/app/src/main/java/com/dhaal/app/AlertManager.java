package com.dhaal.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.telephony.SmsManager;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;

/** Central place for the scam-alert channel, vibration, and notifications. */
final class AlertManager {
    static final String CHANNEL_ID = "dhaal_scam_alert";
    private static int idSeq = 4200;
    // debounce so we don't spam the guardian while several messages are checked
    private static long lastGuardianSmsMs = 0;
    private static String lastGuardianSnippet = "";

    private AlertManager() {}

    /**
     * Automatically SMS the family guardian that a scam was detected. Consent-gated:
     * only fires if a guardian phone is set AND the user granted SEND_SMS. Debounced.
     */
    static void notifyGuardianBySms(Context c, String verdict, String snippet) {
        String phone = Prefs.guardianPhone(c);
        if (phone == null || phone.isEmpty()) return;
        if (ContextCompat.checkSelfPermission(c, Manifest.permission.SEND_SMS)
                != PackageManager.PERMISSION_GRANTED) return;

        long now = SystemClock.elapsedRealtime();
        String key = snippet == null ? "" : snippet.trim();
        if (now - lastGuardianSmsMs < 8000) return;                 // hard anti-burst floor
        if (key.equals(lastGuardianSnippet) && now - lastGuardianSmsMs < 60000) return; // same msg within 60s
        lastGuardianSmsMs = now;
        lastGuardianSnippet = key;

        String name = Prefs.guardianName(c);
        String body = key.length() > 100 ? key.substring(0, 97) + "…" : key;
        String v = (verdict == null ? "scam" : verdict.toLowerCase());
        String msg = "DHAAL alert: " + (name == null || name.isEmpty() ? "your family member" : name)
                + " may have received a " + v + " message. Please check on them. \"" + body + "\"";
        try {
            SmsManager sm = SmsManager.getDefault();
            ArrayList<String> parts = sm.divideMessage(msg);
            sm.sendMultipartTextMessage(phone, null, parts, null, null);
        } catch (Exception ignored) {
            // sending failed (no SIM / not permitted) — the on-screen alert still stands
        }
    }

    static void ensureChannel(Context c) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID, "Scam alerts", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("High-priority warnings when DHAAL detects a scam");
            ch.enableVibration(true);
            ch.setVibrationPattern(new long[]{0, 400, 200, 400});
            NotificationManager nm = c.getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    static void vibrate(Context c, int ms) {
        Vibrator v = (Vibrator) c.getSystemService(Context.VIBRATOR_SERVICE);
        if (v == null || !v.hasVibrator()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            v.vibrate(ms);
        }
    }

    /**
     * Fire the scam alert: strong vibrate + heads-up notification. If a guardian
     * phone is set, tapping the notification opens a pre-filled WhatsApp warning.
     */
    static void fireScamAlert(Context c, String verdict, String snippet) {
        vibrate(c, 800);

        String title = "⚠️ DHAAL: possible " + verdict.toLowerCase() + " message";
        String body = snippet.length() > 120 ? snippet.substring(0, 117) + "…" : snippet;

        NotificationCompat.Builder b = new NotificationCompat.Builder(c, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setVibrate(new long[]{0, 400, 200, 400})
                .setAutoCancel(true);

        String phone = Prefs.guardianPhone(c);
        if (phone != null && !phone.isEmpty()) {
            String name = Prefs.guardianName(c);
            String msg = "DHAAL alert: " + (name.isEmpty() ? "your family member" : name)
                    + " may have received a scam message. Please check on them. Message: \"" + body + "\"";
            Uri wa = Uri.parse("https://wa.me/" + phone.replaceAll("[^0-9]", "")
                    + "?text=" + Uri.encode(msg));
            Intent i = new Intent(Intent.ACTION_VIEW, wa);
            int flags = PendingIntent.FLAG_UPDATE_CURRENT
                    | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0);
            PendingIntent pi = PendingIntent.getActivity(c, 0, i, flags);
            b.addAction(android.R.drawable.ic_menu_send, "Warn guardian", pi);
        }

        try {
            NotificationManagerCompat.from(c).notify(idSeq++, b.build());
        } catch (SecurityException ignored) {
            // POST_NOTIFICATIONS not granted — the vibrate already fired.
        }

        // Auto-text the guardian (consent-gated + debounced inside).
        notifyGuardianBySms(c, verdict, snippet);
    }
}
