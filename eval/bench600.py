import json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from eval.harness import run  # reuse metrics
from app.engine.rules import analyze as rules_analyze

rows = [json.loads(l) for l in open("data/samples_600.jsonl", encoding="utf-8") if l.strip()]
holdout = [r for r in rows if r["collected_date"] >= "2026-07-01"]   # newest 20% = real hold-out
full = run(rows, rules_analyze)
ho = run(holdout, rules_analyze)
def line(m, tag):
    return (f"{tag}: n={m['n']} recall={m['recall']:.1%} precision={m['precision']:.1%} "
            f"FPR={m['fpr']:.1%} acc={m['accuracy']:.1%} p50={m['latency_p50']:.2f}ms errs={len(m['errors'])}")
print(line(full, "FULL   "))
print(line(ho,   "HOLDOUT"))
json.dump({"full": {k: full[k] for k in ('n','recall','precision','fpr','accuracy','latency_p50')},
           "holdout": {k: ho[k] for k in ('n','recall','precision','fpr','accuracy','latency_p50')},
           "full_errors": full["errors"][:20]}, open("eval/bench600_result.json","w"), indent=2)
