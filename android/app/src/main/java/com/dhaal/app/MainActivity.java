package com.dhaal.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.widget.Button;
import android.widget.FrameLayout;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.Locale;

/**
 * DHAAL native shell.
 *
 * The whole citizen experience is the existing web app, loaded here in a WebView.
 * The native layer adds only what a browser can't do reliably:
 *   - background SMS scanning with a vibrate + alert (see SmsReceiver / AlertManager),
 *   - a consent-gated "SMS shield" toggle so the APK works standalone, and
 *   - a "read the verdict aloud" voice button using Android's own text-to-speech,
 *     which auto-reads scam verdicts for elderly / low-literacy users.
 */
public class MainActivity extends AppCompatActivity {

    private WebView web;
    private Button shieldBtn;
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private static final int REQ_NOTIF = 101;
    private static final int REQ_SMS = 102;

    // Injected after each page load: a floating speaker button + auto-read on scam verdict.
    private static final String INJECT_JS = """
        (function(){
          if(window.__dhaalTTS)return; window.__dhaalTTS=1;
          function grab(){
            var card=document.getElementById('card');
            if(!card||getComputedStyle(card).display==='none')return null;
            var v=(document.getElementById('vlabel')||{}).textContent||'';
            var ty=(document.getElementById('vtype')||{}).textContent||'';
            var ex=(document.getElementById('explain')||{}).textContent||'';
            var t=(v+'. '+(ty?ty+'. ':'')+ex);
            try{ t=t.replace(/[\\p{So}\\p{Sk}\\uFE0F]/gu,' '); }catch(e){}
            return t.replace(/\\s+/g,' ').trim()||null;
          }
          var b=document.createElement('button');
          b.textContent=String.fromCodePoint(0x1F50A);
          b.setAttribute('aria-label','Read result aloud');
          b.style.cssText='position:fixed;left:14px;bottom:14px;z-index:99999;width:54px;height:54px;border-radius:50%;border:none;background:#0B1F3A;color:#fff;font-size:24px;box-shadow:0 3px 12px rgba(0,0,0,.35)';
          b.onclick=function(){ var t=grab(); if(window.DhaalNative)DhaalNative.speak(t||'Paste a message and tap check to hear the result.'); };
          document.body.appendChild(b);
          var last='';
          try{
            var card=document.getElementById('card');
            if(card){
              new MutationObserver(function(){
                var cls=card.className||'';
                if((cls.indexOf('SCAM')>=0||cls.indexOf('SUSPICIOUS')>=0)&&getComputedStyle(card).display!=='none'){
                  var t=grab();
                  if(t&&t!==last){ last=t; if(window.DhaalNative){ DhaalNative.speak(t); var vd=cls.indexOf('SCAM')>=0?'SCAM':'SUSPICIOUS'; if(DhaalNative.alertGuardian)DhaalNative.alertGuardian(vd,t); } }
                }
              }).observe(card,{attributes:true,childList:true,subtree:true});
            }
          }catch(e){}
        })();
        """;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AlertManager.ensureChannel(this);
        tts = new TextToSpeech(this, status -> ttsReady = (status == TextToSpeech.SUCCESS));

        FrameLayout root = new FrameLayout(this);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // the web app uses localStorage
        s.setMediaPlaybackRequiresUserGesture(false); // allow mic for live-call guardian
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript(INJECT_JS, null); // add the voice button
            }
        });
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new NativeBridge(), "DhaalNative");
        web.loadUrl(BuildConfig.WEB_APP_URL);
        root.addView(web, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));

        // Small native shield toggle (bottom-right). Standalone way to arm the SMS shield.
        shieldBtn = new Button(this);
        refreshShieldLabel();
        shieldBtn.setAllCaps(false);
        shieldBtn.setTextColor(Color.WHITE);
        shieldBtn.setBackgroundColor(Color.parseColor("#0B1F3A"));
        shieldBtn.setOnClickListener(v -> onShieldTapped());
        int m = dp(14);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT);
        lp.gravity = Gravity.BOTTOM | Gravity.END;
        lp.setMargins(0, 0, m, m);
        root.addView(shieldBtn, lp);

        setContentView(root);

        // Ask for notification permission up-front on Android 13+ so scam alerts can surface.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
            }
        }
    }

    private int dp(int v) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics()));
    }

    private void refreshShieldLabel() {
        boolean on = Prefs.isSmsGuardEnabled(this) || Prefs.isCallGuardEnabled(this);
        shieldBtn.setText(on ? "🛡 Protection: ON" : "🛡 Protection: OFF");
    }

    /** Native, consent-first path to arm/disarm the background SMS shield. */
    private void onShieldTapped() {
        if (Prefs.isSmsGuardEnabled(this) || Prefs.isCallGuardEnabled(this)) {
            Prefs.setSmsGuardEnabled(this, false);
            Prefs.setCallGuardEnabled(this, false);
            refreshShieldLabel();
            Toast.makeText(this, "Protection off", Toast.LENGTH_SHORT).show();
            return;
        }
        new AlertDialog.Builder(this)
                .setTitle("Turn on DHAAL protection?")
                .setMessage("DHAAL will watch for scams on this phone:\n\n"
                        + "• Scans incoming SMS and warns you on a scam.\n"
                        + "• When a call starts, offers to listen (on speaker) for scam tactics.\n"
                        + "• On a scam it vibrates, alerts you, and auto-texts your guardian "
                        + "(e.g. your son or daughter) if you've set one.\n\n"
                        + "Nothing is recorded or stored; text is checked over HTTPS. "
                        + "You can turn this off any time.")
                .setPositiveButton("Turn on", (d, w) -> requestSmsThenEnable())
                .setNegativeButton("Not now", null)
                .show();
    }

    private void requestSmsThenEnable() {
        String[] need = {
                Manifest.permission.RECEIVE_SMS,   // read incoming SMS
                Manifest.permission.SEND_SMS,      // auto-text the guardian
                Manifest.permission.READ_PHONE_STATE, // know when a call starts
                Manifest.permission.RECORD_AUDIO   // listen to a call on speaker
        };
        boolean allGranted = true;
        for (String pm : need) {
            if (ContextCompat.checkSelfPermission(this, pm) != PackageManager.PERMISSION_GRANTED) {
                allGranted = false;
                break;
            }
        }
        if (!allGranted) {
            ActivityCompat.requestPermissions(this, need, REQ_SMS);
        } else {
            Prefs.setSmsGuardEnabled(this, true);
            Prefs.setCallGuardEnabled(this, true);
            refreshShieldLabel();
            Toast.makeText(this, "Protection on", Toast.LENGTH_SHORT).show();
        }
    }

    /** Speak text with a voice matched to its script (Hindi/Tamil/Telugu/Bengali/English). */
    private void speakNow(String text) {
        if (tts == null || !ttsReady || text == null || text.trim().isEmpty()) return;
        Locale loc = Locale.ENGLISH;
        if (text.matches("(?s).*[\\u0900-\\u097F].*")) loc = new Locale("hi", "IN");        // Devanagari (Hindi/Marathi)
        else if (text.matches("(?s).*[\\u0B80-\\u0BFF].*")) loc = new Locale("ta", "IN");   // Tamil
        else if (text.matches("(?s).*[\\u0C00-\\u0C7F].*")) loc = new Locale("te", "IN");   // Telugu
        else if (text.matches("(?s).*[\\u0980-\\u09FF].*")) loc = new Locale("bn", "IN");   // Bengali
        try {
            int r = tts.setLanguage(loc);
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.setLanguage(Locale.ENGLISH);
            }
        } catch (Exception e) {
            tts.setLanguage(Locale.ENGLISH);
        }
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "dhaal-verdict");
    }

    /** Bridge the web app calls to control native-only features. */
    private class NativeBridge {
        @JavascriptInterface
        public boolean isSmsGuardOn() {
            return Prefs.isSmsGuardEnabled(MainActivity.this);
        }

        @JavascriptInterface
        public void enableSmsGuard() {
            runOnUiThread(MainActivity.this::requestSmsThenEnable);
        }

        @JavascriptInterface
        public void disableSmsGuard() {
            Prefs.setSmsGuardEnabled(MainActivity.this, false);
            runOnUiThread(MainActivity.this::refreshShieldLabel);
        }

        @JavascriptInterface
        public void setGuardian(String name, String phone) {
            Prefs.setGuardian(MainActivity.this, name, phone);
        }

        /** Read a verdict aloud (called by the injected voice button / auto-reader). */
        @JavascriptInterface
        public void speak(final String text) {
            runOnUiThread(() -> speakNow(text));
        }

        /** Auto-text the guardian when a scam is checked in the app (consent-gated + debounced). */
        @JavascriptInterface
        public void alertGuardian(String verdict, String snippet) {
            AlertManager.notifyGuardianBySms(MainActivity.this,
                    verdict == null ? "SCAM" : verdict, snippet);
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            AlertManager.vibrate(MainActivity.this, ms);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] perms, int[] results) {
        super.onRequestPermissionsResult(requestCode, perms, results);
        if (requestCode == REQ_SMS) {
            boolean sms = false, phone = false;
            for (int i = 0; i < perms.length; i++) {
                boolean ok = results[i] == PackageManager.PERMISSION_GRANTED;
                if (Manifest.permission.RECEIVE_SMS.equals(perms[i]) && ok) sms = true;
                if (Manifest.permission.READ_PHONE_STATE.equals(perms[i]) && ok) phone = true;
            }
            Prefs.setSmsGuardEnabled(this, sms);
            Prefs.setCallGuardEnabled(this, phone);
            refreshShieldLabel();
            Toast.makeText(this, sms ? "Protection on" : "Protection stays off",
                    Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        super.onDestroy();
    }

    // Let the hardware back button navigate WebView history first.
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && web.canGoBack()) {
            web.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
