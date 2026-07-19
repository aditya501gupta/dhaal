package com.dhaal.app;

import android.content.Context;
import android.content.SharedPreferences;

/** Small typed wrapper over SharedPreferences for the native-only settings. */
final class Prefs {
    private static final String FILE = "dhaal_native";
    private static final String K_SMS = "sms_guard";
    private static final String K_GNAME = "guardian_name";
    private static final String K_GPHONE = "guardian_phone";

    private Prefs() {}

    private static SharedPreferences p(Context c) {
        return c.getSharedPreferences(FILE, Context.MODE_PRIVATE);
    }

    static boolean isSmsGuardEnabled(Context c) {
        return p(c).getBoolean(K_SMS, false); // OFF by default — consent required
    }

    static void setSmsGuardEnabled(Context c, boolean on) {
        p(c).edit().putBoolean(K_SMS, on).apply();
    }

    static void setGuardian(Context c, String name, String phone) {
        p(c).edit().putString(K_GNAME, name).putString(K_GPHONE, phone).apply();
    }

    static String guardianPhone(Context c) {
        return p(c).getString(K_GPHONE, "");
    }

    static String guardianName(Context c) {
        return p(c).getString(K_GNAME, "");
    }
}
