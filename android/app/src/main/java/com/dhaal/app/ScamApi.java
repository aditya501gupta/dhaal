package com.dhaal.app;

import android.content.Context;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/** Thin client for the DHAAL /analyze endpoint. Returns the verdict string. */
final class ScamApi {
    private ScamApi() {}

    static String classify(Context c, String text) throws Exception {
        URL url = new URL(BuildConfig.API_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        try {
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("User-Agent", "dhaal-android");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(15000);
            conn.setDoOutput(true);

            JSONObject payload = new JSONObject();
            payload.put("text", text);
            payload.put("channel", "sms");

            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload.toString().getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            if (code < 200 || code >= 300) return "SAFE"; // fail safe: don't alarm on API error

            StringBuilder sb = new StringBuilder();
            try (BufferedReader r = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = r.readLine()) != null) sb.append(line);
            }
            JSONObject out = new JSONObject(sb.toString());
            return out.optString("verdict", "SAFE");
        } finally {
            conn.disconnect();
        }
    }
}
