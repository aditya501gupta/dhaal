package com.dhaal.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;

/**
 * Listens for incoming SMS and, ONLY when the user has enabled the SMS shield,
 * runs the message text through the DHAAL API. A SCAM / SUSPICIOUS verdict fires
 * a vibrate + heads-up notification and (if set) a guardian warning.
 *
 * Privacy: nothing runs unless the toggle is on. The message text is sent only to
 * the DHAAL analysis endpoint over HTTPS and is never stored on the device.
 */
public class SmsReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Prefs.isSmsGuardEnabled(context)) return; // consent gate
        Bundle bundle = intent.getExtras();
        if (bundle == null) return;

        StringBuilder body = new StringBuilder();
        try {
            Object[] pdus = (Object[]) bundle.get("pdus");
            if (pdus == null) return;
            String format = bundle.getString("format");
            for (Object pdu : pdus) {
                SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu, format);
                if (sms != null) body.append(sms.getMessageBody());
            }
        } catch (Exception e) {
            return; // malformed PDU — never crash on a hostile message
        }

        final String text = body.toString().trim();
        if (text.isEmpty()) return;

        // Analyse off the main thread. goAsync() keeps the receiver alive for the call.
        final PendingResult pr = goAsync();
        new Thread(() -> {
            try {
                String verdict = ScamApi.classify(context, text);
                if ("SCAM".equals(verdict) || "SUSPICIOUS".equals(verdict)) {
                    AlertManager.fireScamAlert(context, verdict, text);
                }
            } catch (Exception ignored) {
                // network/parse failure — fail silent, never disturb the user on error
            } finally {
                pr.finish();
            }
        }).start();
    }
}
