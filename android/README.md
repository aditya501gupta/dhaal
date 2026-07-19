# DHAAL — Android app (native shield)

A thin native shell around the DHAAL citizen web app that adds the one thing a
browser cannot do: **read incoming SMS, run them through the DHAAL engine, and
fire a phone-level vibrate + alert (and a guardian warning) when a scam is
detected.** Everything else — the 6-language UI, consent screen, guardian setup,
elderly mode, OCR, live-call guardian — is the existing web app loaded in a
WebView, so there is one source of truth.

## What it does

- **WebView** loads the live app (`https://dhaal-eta.vercel.app`). Update the web
  app and the phone app updates with it — no rebuild needed.
- **SMS shield (opt-in, off by default):** when the user sets a guardian and
  grants SMS permission, an incoming SMS is sent to the DHAAL `/analyze` API. A
  `SCAM` / `SUSPICIOUS` verdict → strong vibration + a high-priority notification.
  If a guardian phone is set, the notification has a one-tap "Warn guardian"
  action that opens a pre-filled WhatsApp message.
- **Read-aloud voice (for elders / low-literacy):** a floating 🔊 button reads the
  verdict and explanation using Android's own text-to-speech, and it **auto-reads**
  when a scam verdict appears. The voice matches the message's script
  (Hindi / Tamil / Telugu / Bengali / English). Fully native — no web redeploy needed.
- **Privacy by design:** SMS scanning does nothing unless the toggle is on;
  message text is sent only to the DHAAL endpoint over HTTPS and never stored on
  the device; cleartext traffic is disabled.

## How the APK gets built (no Android Studio needed)

The workflow at `.github/workflows/android-apk.yml` builds the APK **on GitHub**:

1. Commit the `android/` folder and the workflow to your repo and push.
2. Open the repo's **Actions** tab → the "Build DHAAL Android APK" run.
3. When it's green, download **DHAAL.apk** from the run's *Artifacts*.
4. To also get a permanent download link, push a tag: `git tag v1.0 && git push --tags`
   — the same workflow then publishes a **Release** with the APK attached.

## Install on a phone

1. Copy `DHAAL.apk` to the phone (or open the Release link on the phone).
2. Tap it → allow "install from unknown sources" for your browser/files app.
3. Open **DHAAL** and accept the in-app consent.
4. Turn on background SMS scanning either way:
   - tap the **🛡 SMS shield** button (bottom-right), confirm the consent dialog,
     and allow the SMS permission — this works standalone, no redeploy needed; or
   - set a guardian in the web app's settings, which arms the shield via the bridge
     (needs the web app redeployed with the native-bridge hooks).
5. Allow the notification prompt so scam alerts can surface.

## Honest notes for judges

- This is a **debug-signed sideload APK** for the demo. Publishing on the Play
  Store with `RECEIVE_SMS` requires Google's restricted-permission review; that is
  a policy step, not a technical blocker, and is called out openly.
- The APK is unmodified open source in this repo; the CI build is reproducible.

## Build locally (optional)

```
cd android
gradle wrapper --gradle-version 8.7   # first time, if you don't have the wrapper
./gradlew assembleDebug
# APK at app/build/outputs/apk/debug/app-debug.apk
```
Requires JDK 17 and the Android SDK (`compileSdk 34`).
