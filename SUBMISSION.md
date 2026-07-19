# DHAAL — ET AI Hackathon 2.0 · Phase 2 Submission

**Digital Harm Analysis & Alert Layer** — a real-time, multilingual anti-scam shield for
digital-arrest, KYC, UPI and courier fraud.
**Problem statement:** PS-6 — *AI for Digital Public Safety.*

---

## 1. One-line pitch

DHAAL is a hybrid AI shield that reads a suspicious message or call and, in under a
second, tells a citizen — in their own language — whether it is a scam, warns their
family, and gives police a live campaign map to act on.

## 2. Live links

| What | URL |
|---|---|
| Citizen app (PWA, 6 languages) | https://dhaal-eta.vercel.app |
| Police / LEA command center | https://dhaal-command.vercel.app |
| Detection API (`POST /analyze`) | https://aditya501gupta-dhaal-api.hf.space/analyze |
| API health | https://aditya501gupta-dhaal-api.hf.space/health |
| Android app | build from `android/` via GitHub Actions → download `DHAAL.apk` |

> Try it: paste a scam SMS into the citizen app, or
> `curl -s -X POST .../analyze -H 'Content-Type: application/json' -d '{"text":"Your KYC expired, share OTP at hdfc-rekyc.xyz"}'`

## 3. The three layers

1. **L1 — Citizen app.** Paste/scan a message or screenshot (Tesseract OCR), or use the
   live-call guardian (speech-to-text on speakerphone). Verdict in 6 Indian languages,
   with a plain-language "why" and the 1930 cyber-crime helpline one tap away.
2. **L2 — Guardian.** An elderly user sets a family "guardian." On a SCAM verdict the app
   vibrates and offers a one-tap WhatsApp/call warning to that guardian. Native Android
   build extends this to **incoming SMS scanned in the background**.
3. **L3 — LEA command center.** A dark-map dashboard of scam campaigns (clusters, hashes,
   exportable dossier with a SHA-256 hash chain) so police see patterns, not just cases.

## 4. How the detection engine works (hybrid, fail-safe)

```
message ─▶ Rules (deterministic, 0.45 ms) ─▶ Forensic Agent (URL/UPI analysis, SSRF-safe)
          └▶ LLM (Groq Llama-3.3-70B ▸ Gemini Flash fallback) ─▶ Calibrated Fusion ─▶ verdict
```

- **Rules and LLM disagree → SUSPICIOUS + needs_review** — never a silent miss.
- Every layer **degrades to the deterministic rules verdict** rather than erroring.
- Message text is treated as untrusted **data, never instructions** — prompt-injection proof.

## 5. Evidence (measured, honest)

| Test | Result |
|---|---|
| Rules-only recall / precision / FP — real hold-out (103) | **100% / 100% / 0%** |
| Rules-only — full 673-sample corpus | 78.9% / 100% / 0% |
| Hybrid recovery of rules-missed scams (live) | **24/24 = 100%** |
| Live production drill (25 fresh inputs) | **24/25** |
| Red-team (32 adversarial cases, live) | 31/32 → **32/32 after fix** |

Full detail: `eval/benchmark_v3_frozen.md`, `eval/redteam_report.md`, `eval/drill_report.md`.
Rules metrics **re-run in CI on every commit** (`.github/workflows/bench.yml`).

**Honest caveats we state openly to judges:** the 673-corpus is synthetic-augmented
(robustness across paraphrase/code-mixing, not real-world generalisation — the credible
real-world signals are the hold-out, live drill and red-team); SUSPICIOUS counts as
"caught" (means *verify via 1930*); corpus languages evaluated = 3 (EN/HI/Hinglish),
UI ships 6.

## 6. Consent & privacy (built in, not bolted on)

- First-run consent screen in 6 languages with an explicit **"what DHAAL will never do"** box.
- All scanning is **opt-in and off by default**; toggles are per-feature.
- Message/call text is sent only to the DHAAL endpoint over HTTPS and **never stored**.
- Native app: cleartext traffic disabled; SMS reading requires an explicit OS grant.

## 7. Native Android app

`android/` is a complete, GitHub-buildable project (no Android Studio needed). It wraps
the live web app in a WebView and adds the one thing a browser cannot do on modern
Android: **scan incoming SMS and fire a phone-level vibrate + heads-up alert + guardian
warning.** See `android/README.md`. CI: `.github/workflows/android-apk.yml`.

## 8. Run it yourself

```
# Backend (FastAPI)
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
# Frontend — static, no build
open frontend/index.html
# Benchmarks
python eval/gen_corpus.py && python eval/bench600.py
```

## 9. Tech stack

FastAPI · Groq Llama-3.3-70B · Gemini 2.0 Flash · Hugging Face Spaces (Docker) ·
Vercel · vanilla JS PWA + Tesseract.js + Web Speech API · Android (Java/WebView) ·
GitHub Actions CI.
