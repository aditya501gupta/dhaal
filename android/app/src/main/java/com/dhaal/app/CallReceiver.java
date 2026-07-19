package com.dhaal.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;

/**
 * Detects when a phone call becomes active and — only if the user enabled call guard —
 * posts a one-tap prompt inviting them to let DHAAL listen (with the call on speaker).
 *
 * Honest note: Android reserves the microphone for the telephony stack during a live
 * call, so on many devices a third-party app cannot capture the call audio itself. The
 * prompt + native listener work whenever the OS permits mic access; the reliable,
 * always-works protection is the SMS shield and the auto-text-guardian.
 */
public class CallReceiver extends BroadcastReceiver {

    private static String lastState = "";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Prefs.isCallGuardEnabled(context)) return;
        String state = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        if (state == null || state.equals(lastState)) return;
        lastState = state;
        // OFFHOOK = a call is now in progress (answered incoming, or outgoing connected).
        if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(state)) {
            AlertManager.showCallListenPrompt(context);
        }
    }
}
