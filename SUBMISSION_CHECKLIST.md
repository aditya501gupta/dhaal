# DHAAL — Final submission checklist (deadline 22 Jul 2026, 11:59 PM IST)

## Ship-live steps (do these to finish)

- [ ] **Push the repo** to trigger the Android build:
      `git add -A && git commit -m "Native Android app + submission hub" && git push`
- [ ] In GitHub → **Actions**, confirm "Build DHAAL Android APK" is green; download `DHAAL.apk` from the run artifacts.
- [ ] (Optional, for a permanent APK link) `git tag v1.0 && git push --tags` → grab the APK from the **Release**.
- [ ] *(Optional polish)* **Redeploy the citizen web app** so the in-web guardian
      hand-off arms the shield automatically. Not required — the app has a native
      **🛡 SMS shield** button that works standalone. Source of truth: `frontend/index.html`.
- [ ] **Refresh `HF_TOKEN`** and redeploy the backend so the G4 IPv6/SSRF fix (`forensic.py`, commit `4a7e98f`) reaches the live Space — then the live endpoint is 32/32 on the red-team.
- [ ] Sanity-check the three live URLs open and `/analyze` returns a verdict.

## Record & submit

- [ ] Record the demo video following `DEMO_SCRIPT.md` (target ≤ 3 min, captions on).
- [ ] Install `DHAAL.apk` on your Android phone and test: consent → guardian → a scam SMS fires the alert.
- [ ] Fill the **Unstop** Phase-2 submission form: title, PS-6, one-liner, the 3 live links + GitHub repo + APK link, video link, and the deck (`deck/DHAAL_pitch.pdf`).
- [ ] Paste the honest-caveats paragraph from `SUBMISSION.md §5` so judges see rigor, not overclaiming.

## What's already done (evidence in repo)

- [x] Hybrid detection engine (rules + forensic + LLM + fusion), live on HF Spaces.
- [x] Citizen PWA — 6 languages, OCR, live-call guardian, consent, guardian alerts, elderly mode.
- [x] LEA command center with exportable hash-chained dossier.
- [x] Benchmarks + temporal hold-out + live drill + 32-case red-team (reports in `eval/`).
- [x] Native Android project + GitHub Actions APK build (`android/`).
- [x] Submission hub (`SUBMISSION.md`) + demo script (`DEMO_SCRIPT.md`).

## Nice-to-have if time permits

- [ ] Add one **native-app slide** to the deck (WebView + background SMS shield + consent).
- [ ] Extend the labelled corpus to Bengali/Tamil/Telugu/Marathi (currently EN/HI/Hinglish).
