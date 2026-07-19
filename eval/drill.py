import json, time, urllib.request, os
from collections import defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(BASE)
SAMPLES = os.path.join(REPO, "data", "samples.jsonl")
API = "https://aditya501gupta-dhaal-api.hf.space/analyze"
OUT_MD = os.path.join(BASE, "drill_report.md")
OUT_JSON = os.path.join(BASE, "drill_results.json")

rows = [json.loads(l) for l in open(SAMPLES, encoding="utf-8") if l.strip()]
scams = [r for r in rows if r.get("label") == "scam"]
benign = [r for r in rows if r.get("label") == "benign"]

by_type = defaultdict(list)
for r in scams:
    by_type[r.get("scam_type", "other")].append(r)
picked = [lst[0] for lst in by_type.values()]  # one per scam class
i = 1
while len(picked) < 17:
    grew = False
    for lst in by_type.values():
        if i < len(lst) and len(picked) < 17:
            picked.append(lst[i]); grew = True
    if not grew: break
    i += 1
sel = (picked[:17] + benign[:8])[:25]

def analyze(text):
    data = json.dumps({"text": text}).encode("utf-8")
    req = urllib.request.Request(API, data=data,
        headers={"Content-Type": "application/json", "User-Agent": "dhaal-drill"})
    t0 = time.time()
    resp = urllib.request.urlopen(req, timeout=120).read().decode()
    return json.loads(resp), (time.time() - t0) * 1000

results = []
for idx, r in enumerate(sel, 1):
    exp_scam = r.get("label") == "scam"
    try:
        out, dt = analyze(r["text"])
        v = out.get("verdict", "ERR")
        correct = (v in ("SCAM", "SUSPICIOUS")) if exp_scam else (v == "SAFE")
        results.append({"id": r.get("id"), "type": r.get("scam_type", "-"),
            "lang": r.get("language", "?"), "label": r.get("label"), "verdict": v,
            "conf": out.get("confidence"), "engine": out.get("engine"),
            "llm_fired": bool(out.get("llm")), "latency_ms": round(dt, 1),
            "correct": correct, "text": r["text"][:75]})
        print(f"{idx:2}/{len(sel)} {r.get('id'):10} {r.get('label'):6} -> {v:11} "
              f"{'OK' if correct else 'MISS'} ({dt:.0f}ms)", flush=True)
    except Exception as e:
        results.append({"id": r.get("id"), "label": r.get("label"),
            "error": str(e), "correct": False})
        print(f"{idx:2}/{len(sel)} {r.get('id')} ERROR {e}", flush=True)
    json.dump(results, open(OUT_JSON, "w"), indent=2)

ok = [x for x in results if x.get("correct")]
scam_items = [x for x in results if x.get("label") == "scam"]
ben_items = [x for x in results if x.get("label") == "benign"]
recall = sum(1 for x in scam_items if x.get("correct")) / max(len(scam_items), 1)
fpr = sum(1 for x in ben_items if not x.get("correct")) / max(len(ben_items), 1)
lat = sorted(x["latency_ms"] for x in results if "latency_ms" in x)
p50 = lat[len(lat)//2] if lat else 0
p90 = lat[int(len(lat)*0.9)] if lat else 0
llm_n = sum(1 for x in results if x.get("llm_fired"))

L = []
L.append("# DHAAL G1 Accuracy Drill - Live Production Endpoint\n")
L.append(f"Endpoint: `{API}`  \nSamples fired: **{len(results)}** (stratified: 8 scam classes + benign hard-negatives)\n")
L.append("## Headline\n")
L.append(f"- Overall correct-side accuracy: **{len(ok)}/{len(results)} = {100*len(ok)/len(results):.1f}%**")
L.append(f"- Scam recall (caught): **{100*recall:.1f}%** ({sum(1 for x in scam_items if x.get('correct'))}/{len(scam_items)})")
L.append(f"- False-positive rate on benign: **{100*fpr:.1f}%** ({sum(1 for x in ben_items if not x.get('correct'))}/{len(ben_items)})")
L.append(f"- LLM layer engaged on: **{llm_n}/{len(results)}** inputs")
L.append(f"- Latency p50 **{p50:.0f} ms**, p90 **{p90:.0f} ms**\n")
L.append("## Per-input results\n")
L.append("| # | id | class | lang | expected | verdict | conf | llm | ms | result |")
L.append("|--|----|-------|------|----------|---------|------|-----|----|--------|")
for i, x in enumerate(results, 1):
    if "error" in x:
        L.append(f"| {i} | {x.get('id')} | - | - | {x.get('label')} | ERROR | - | - | - | MISS |")
    else:
        L.append(f"| {i} | {x['id']} | {x['type']} | {x['lang']} | {x['label']} | "
                 f"{x['verdict']} | {x['conf']} | {'yes' if x['llm_fired'] else '-'} | "
                 f"{x['latency_ms']:.0f} | {'OK' if x['correct'] else 'MISS'} |")
open(OUT_MD, "w", encoding="utf-8").write("\n".join(L) + "\n")
print("\nWROTE", OUT_MD)
print(f"ACCURACY {len(ok)}/{len(results)}  recall {100*recall:.0f}%  fpr {100*fpr:.0f}%  llm {llm_n}")
