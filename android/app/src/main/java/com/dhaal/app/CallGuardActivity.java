package com.dhaal.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.util.TypedValue;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;

/**
 * Native "listen to the call" screen. Opened from the call prompt. Uses Android's own
 * SpeechRecognizer (the WebView cannot do speech recognition), transcribes what the mic
 * hears, checks it against the DHAAL engine, and on a scam raises a red alert + vibrate +
 * auto-texts the guardian. Put the call on speaker so the mic can hear it.
 */
public class CallGuardActivity extends AppCompatActivity {

    private SpeechRecognizer sr;
    private TextView status, transcript;
    private final StringBuilder heard = new StringBuilder();
    private boolean stopping = false;
    private long lastAnalyze = 0;
    private static final int REQ_MIC = 201;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        int pad = dp(22);
        root.setPadding(pad, pad, pad, pad);
        root.setBackgroundColor(Color.parseColor("#0B1F3A"));

        TextView title = new TextView(this);
        title.setText("DHAAL Call Guard");
        title.setTextColor(Color.WHITE);
        title.setTextSize(22);

        TextView hint = new TextView(this);
        hint.setText("Put the call on speaker. DHAAL is listening for scam tactics.");
        hint.setTextColor(Color.parseColor("#9DB4E6"));
        hint.setTextSize(13);
        hint.setPadding(0, dp(6), 0, 0);

        status = new TextView(this);
        status.setText("Listening…");
        status.setTextColor(Color.parseColor("#CADCFC"));
        status.setTextSize(28);
        status.setPadding(0, dp(26), 0, dp(12));

        transcript = new TextView(this);
        transcript.setTextColor(Color.parseColor("#9DB4E6"));
        transcript.setTextSize(15);
        ScrollView sv = new ScrollView(this);
        sv.addView(transcript);
        LinearLayout.LayoutParams svp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f);
        sv.setLayoutParams(svp);

        Button stop = new Button(this);
        stop.setText("Stop listening");
        stop.setOnClickListener(v -> { stopping = true; finish(); });

        root.addView(title);
        root.addView(hint);
        root.addView(status);
        root.addView(sv);
        root.addView(stop);
        setContentView(root);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
        } else {
            startListening();
        }
    }

    private int dp(int v) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
    }

    @Override
    public void onRequestPermissionsResult(int rc, String[] p, int[] r) {
        super.onRequestPermissionsResult(rc, p, r);
        if (rc == REQ_MIC) {
            if (r.length > 0 && r[0] == PackageManager.PERMISSION_GRANTED) startListening();
            else status.setText("Microphone permission needed to listen.");
        }
    }

    private void startListening() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            status.setText("Speech recognition isn't available on this device.");
            return;
        }
        sr = SpeechRecognizer.createSpeechRecognizer(this);
        sr.setRecognitionListener(new Listener());
        listen();
    }

    private void listen() {
        if (stopping || sr == null) return;
        Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        i.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        try { sr.startListening(i); } catch (Exception ignored) {}
    }

    // SpeechRecognizer stops after each pause; loop it to keep listening through the call.
    private void restart() {
        if (stopping) return;
        try { sr.cancel(); } catch (Exception ignored) {}
        new Handler(Looper.getMainLooper()).postDelayed(this::listen, 400);
    }

    private void handleText(String text) {
        if (text == null || text.trim().isEmpty()) return;
        transcript.setText(text);
        long now = SystemClock.elapsedRealtime();
        if (now - lastAnalyze < 2500) return;   // throttle API calls while speech streams
        lastAnalyze = now;
        final String snap = text.length() > 600 ? text.substring(text.length() - 600) : text;
        new Thread(() -> {
            try {
                final String v = ScamApi.classify(CallGuardActivity.this, snap);
                runOnUiThread(() -> onVerdict(v, snap));
            } catch (Exception ignored) {}
        }).start();
    }

    private void onVerdict(String v, String snap) {
        if ("SCAM".equals(v)) {
            status.setText("⚠ SCAM likely — hang up!");
            status.setTextColor(Color.parseColor("#E5484D"));
            AlertManager.vibrate(this, 800);
            AlertManager.notifyGuardianBySms(this, "SCAM", snap);
        } else if ("SUSPICIOUS".equals(v)) {
            status.setText("Caution — verify on 1930");
            status.setTextColor(Color.parseColor("#E8A33D"));
            AlertManager.vibrate(this, 300);
        } else {
            status.setText("Listening…");
            status.setTextColor(Color.parseColor("#CADCFC"));
        }
    }

    private class Listener implements RecognitionListener {
        @Override public void onResults(Bundle b) {
            ArrayList<String> m = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            if (m != null && !m.isEmpty()) { heard.append(' ').append(m.get(0)); handleText(heard.toString().trim()); }
            restart();
        }
        @Override public void onPartialResults(Bundle b) {
            ArrayList<String> m = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            if (m != null && !m.isEmpty()) handleText((heard + " " + m.get(0)).trim());
        }
        @Override public void onError(int e) { restart(); }
        @Override public void onReadyForSpeech(Bundle b) {}
        @Override public void onBeginningOfSpeech() {}
        @Override public void onRmsChanged(float r) {}
        @Override public void onBufferReceived(byte[] x) {}
        @Override public void onEndOfSpeech() {}
        @Override public void onEvent(int a, Bundle b) {}
    }

    @Override
    protected void onDestroy() {
        stopping = true;
        if (sr != null) { try { sr.destroy(); } catch (Exception ignored) {} }
        super.onDestroy();
    }
}
