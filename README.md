# 🛡️ DHAAL — Digital Harm Analysis & Alert Layer

**Real-time AI shield against digital-arrest & UPI fraud — for every phone, every channel, in the two minutes the scam is actually happening.**

Built for **ET AI Hackathon 2.0** (Problem Statement 6 — AI for Digital Public Safety).

> **Judge quickstart (60 seconds):** open the live demo → paste any scam SMS from your own phone → watch the verdict, the highlighted manipulation tactics, and the official-advisory citation appear in under 3 seconds.

## Hub (single link to everything)

| Artifact | Link |
|---|---|
| Live citizen app | _(Vercel URL — day 1 of build)_ |
| Live API + dev demo | _(HF Space URL — day 1 of build)_ |
| 3-min demo video | _(day 15)_ |
| Presentation deck | _(day 14)_ |
| Benchmark report | [`eval/report_v0.md`](eval/report_v0.md) |
| Architecture diagram | `docs/architecture.png` |

## Current status — Day 0/1 (walking skeleton)

- ✅ **Rules engine v0** (`backend/app/engine/rules.py`): dependency-free, explainable; detects 8 scam classes via manipulation-lever combinations (authority, fear, urgency, secrecy, payment pressure, credential harvesting, sympathy bait, video-call coercion) + URL forensics (brand-impersonation domains, risky TLDs, shorteners) + benign guardrails.
- ✅ **IndiaScam-Bench v0** (`data/samples.jsonl`): 38 labelled samples (26 scam / 12 hard-negative benign, EN/HI/Hinglish) with per-sample source attribution.
- ✅ **Benchmark harness** (`eval/harness.py`): scam recall **100%**, benign FPR **0%**, p50 latency **0.5 ms** on v0 corpus. _Honest caveat: rules were tuned on this seed set; the corpus grows to 600+ with a temporal hold-out split before any headline claim (Gate G4)._
- ✅ FastAPI service + dev demo UI + Dockerfile (HF Spaces-ready) + keep-warm workflow.
- ⏭️ Next (Day 2): Groq LLM few-shot layer + advisory RAG citations + corpus → 100.

## Run locally

```bash
# Engine + benchmark: zero dependencies
python3 eval/harness.py
python3 backend/tests/test_rules.py

# API (needs: pip install -r backend/requirements.txt)
cd backend && uvicorn app.main:app --reload
# then open frontend/demo.html (it calls http://localhost:8000)
```

## Architecture (3 layers)

**L1 Citizen Shield** — paste/share/screenshot/audio → hybrid verdict (rules + fine-tuned IndicBERT + Llama-3.3-70B on Groq + RAG over RBI/TRAI/I4C advisories) with scam-anatomy highlighting, 6+ languages, guided 1930/NCRP reporting. **Guardian Live Call mode**: on-device speech → red alert < 30 s.
**L2 Intelligence** — PII-redacted reports, HMAC-pseudonymised indicators, script-embedding clustering → fraud-campaign graph, early warning after ≤ 5 reports.
**L3 Command Centre** — geospatial hotspots, campaign explorer, SHA-256 hash-chained evidence dossiers with BSA s.63-style certificates.

## Security & privacy by design

DPDP-mapped consent; PII auto-redaction **before** storage; no raw scammer identifiers in the graph (HMAC only); prompt-injection-hardened LLM calls (content is data, never instructions); velocity limits + probing detection; secrets only in env vars.

## Data provenance & ethics

Corpus samples come from public official advisories (I4C, RBI, TRAI, PIB, SEBI), press-documented case scripts, and labelled synthetic multilingual variants. **No real victim PII anywhere.** Each sample carries its source. The full benchmark will be open-sourced at submission.

## Team

Team DHAAL — ET AI Hackathon 2.0, Phase 2. Working title pending final branding.

## License

MIT (code). Benchmark data: CC BY 4.0 with source attributions.
