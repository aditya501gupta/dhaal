# DHAAL — Test-before-submit checklist

Work top to bottom. Parts A–C need no push (they're already live). Part D is after
the APK builds. If anything fails, note it and I can fix it.

## Sample messages to test with (copy-paste these)

**Scam 1 — digital arrest:**
> This is Mumbai Police Cyber Cell. A parcel in your name has illegal items and an arrest warrant is issued. Stay on this video call and transfer Rs 25,000 to the RBI verification account. Do not tell anyone.

**Scam 2 — fake KYC:**
> HDFC ALERT: Your net-banking will be deactivated today. Complete re-KYC in 24 hours at hdfc-rekyc.xyz or your account is frozen. Share the OTP with our executive.

**Benign (should NOT be flagged):**
> Your Amazon order has shipped and arrives tomorrow by 7 PM. Track in the app. No action needed.

---

## A. Citizen web app — https://dhaal-eta.vercel.app

- [ ] Page loads; you see the input box and language selector.
- [ ] Paste **Scam 1** → tap check → verdict shows **SCAM** with a confidence %, an explanation, and highlighted manipulation tactics.
- [ ] Paste the **Benign** message → verdict is **SAFE** (this proves it doesn't cry wolf).
- [ ] Paste **Scam 2** → **SCAM** or **SUSPICIOUS**, and a **Draft 1930 complaint** button appears.
- [ ] Switch language to **हिंदी**, re-check a scam → the interface and verdict switch language.
- [ ] Upload a **screenshot** of a scam message → OCR reads the text → verdict appears.
- [ ] Open **Settings (⚙)** → set a **guardian** name + phone → save.
- [ ] Re-run **Scam 1** → the family-alert sheet pops up with a WhatsApp/call warning option.
- [ ] In Settings, turn on **Easy-view (XL)** mode → text and buttons enlarge.
- [ ] Browser menu → **Add to Home screen** → it installs like an app (PWA check).

## B. Detection API — warm it up before the demo

- [ ] Open https://aditya501gupta-dhaal-api.hf.space/health → should return an OK/JSON response.
- [ ] Open https://aditya501gupta-dhaal-api.hf.space/docs → the live API docs load.
  *(Tip: hit /health once ~1 min before you demo so the server is warm and fast.)*

## C. Police command center — https://dhaal-command.vercel.app

- [ ] Dark map loads with campaign markers.
- [ ] Filters work (by scam type / status).
- [ ] **Export dossier** produces a report with the SHA-256 hash chain.

## D. Native Android app (after `git push` → APK builds)

- [ ] GitHub → **Actions** → "Build DHAAL Android APK" run is **green**; download **DHAAL.apk**.
- [ ] Install on your phone (allow "install from unknown sources").
- [ ] Open DHAAL → the **consent screen** shows → accept.
- [ ] Tap **🛡 SMS shield** (bottom-right) → confirm → allow the SMS permission → it reads **ON**.
- [ ] Run a scam text inside the app → tap the **🔊** button (bottom-left) → it **reads the verdict aloud**; a scam verdict also auto-reads.
- [ ] **Live SMS test:** from a second phone (or ask a friend) send yourself **Scam 1** as an SMS → your phone should **vibrate + show a scam notification**, and if a guardian is set, a "Warn guardian" action.

## Known limits (so nothing surprises you)

- Background **SMS** scanning is the **app only** — a browser can't do it. Don't try to demo SMS on the website.
- **Calls:** there's no silent call recording (Android blocks it). The call guardian works in the app with the call on **speakerphone**; grant the mic permission.
- The read-aloud voice uses the phone's installed TTS voices — English/Hindi are usually present; other languages fall back to English if that voice pack isn't installed.

## Green-light to submit when…

A, B, C all pass in the browser, and D passes on your phone (or at minimum the APK
builds green and installs). Then record the demo and fill the Unstop form.
