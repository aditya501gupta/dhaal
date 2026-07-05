"""DHAAL fusion layer — combines the deterministic rules engine with the LLM.

Design contract (this is the anti-'GPT-wrapper' architecture):
1. Rules run ALWAYS — free, <1 ms, explainable, works offline.
2. Decisive rules SCAM (score >= FASTPATH_T) short-circuits: no LLM needed
   to know a digital-arrest script is a scam. LLM adds nothing but latency.
3. Ambiguous zone -> LLM reasons over India-specific context.
4. Disagreements are handled honestly:
   - one-step gap  -> higher severity wins, confidence damped
   - SAFE vs SCAM  -> verdict SUSPICIOUS + needs_review flag (never silently
     trust either model at the extremes)
5. LLM unavailable (no key / quota / outage) -> rules verdict, clearly tagged.
"""
from __future__ import annotations

import time

from . import llm as llm_mod
from .rules import analyze as rules_analyze

RANK = {"SAFE": 0, "SUSPICIOUS": 1, "SCAM": 2}
FASTPATH_T = 6.0


def analyze_hybrid(text: str, llm_fn=None, allow_llm: bool = True) -> dict:
    t0 = time.perf_counter()
    r = rules_analyze(text)
    r["needs_review"] = False

    # 1) decisive rules scam — fast path
    if r["score"] >= FASTPATH_T:
        r["engine"] = "hybrid-v1 (rules fast-path)"
        r["latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        return r

    # 2) LLM pass
    fn = llm_fn or llm_mod.llm_classify
    l = fn(text) if (allow_llm and (llm_fn or llm_mod.available())) else None
    if l is None:
        r["engine"] = "rules-v0 (llm unavailable)"
        r["latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
        return r

    rv, lv = RANK[r["verdict"]], RANK[l["verdict"]]

    # 3) fuse
    if rv == lv:
        verdict = r["verdict"]
        confidence = min(0.99, max(r["confidence"], l["confidence"]) + 0.05)
        needs_review = False
    elif abs(rv - lv) == 1:
        verdict = r["verdict"] if rv > lv else l["verdict"]
        confidence = round(min(r["confidence"], l["confidence"]) * 0.9, 2)
        needs_review = confidence < 0.65
    else:  # SAFE vs SCAM — maximal disagreement
        verdict = "SUSPICIOUS"
        confidence = 0.55
        needs_review = True

    scam_type = r["scam_type"] if r["scam_type"] not in ("none", "unknown") else l["scam_type"]
    if verdict == "SAFE":
        scam_type = "none"

    llm_extra_tactics = [t for t in l.get("tactics", []) if t not in r["tactics"]]

    out = dict(r)
    out.update({
        "verdict": verdict,
        "confidence": round(confidence, 2),
        "scam_type": scam_type,
        "needs_review": needs_review,
        "llm": {
            "verdict": l["verdict"], "confidence": l["confidence"],
            "rationale": l.get("rationale", ""), "provider": l.get("provider", ""),
            "extra_tactics": llm_extra_tactics, "cached": l.get("cached", False),
        },
        "engine": "hybrid-v1",
        "latency_ms": round((time.perf_counter() - t0) * 1000, 2),
    })
    if l.get("rationale") and verdict != "SAFE":
        out["explanation"] = f"{out['explanation']} AI analysis: {l['rationale']}"
    if needs_review:
        out["explanation"] += " (Models disagreed — flagged for human review. Verify via 1930 before acting.)"
    return out
