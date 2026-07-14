import json, urllib.request, os
API="https://aditya501gupta-dhaal-api.hf.space/analyze"
BASE=os.path.dirname(os.path.abspath(__file__))
cases=json.load(open(os.path.join(BASE,"missed_sample.json"),encoding="utf-8"))
caught=0; out=[]
for c in cases:
    data=json.dumps({"text":c["text"]}).encode("utf-8")
    req=urllib.request.Request(API,data=data,headers={"Content-Type":"application/json"})
    try:
        r=json.loads(urllib.request.urlopen(req,timeout=90).read().decode())
        hit=r.get("verdict") in ("SCAM","SUSPICIOUS")
        caught+=1 if hit else 0
        out.append({"id":c["id"],"type":c["scam_type"],"lang":c["lang"],"verdict":r.get("verdict"),"llm":bool(r.get("llm")),"hit":hit})
        print(f"{c['id']:12} {c['scam_type']:16} {c['lang']:8} -> {str(r.get('verdict')):11} {'RECOVERED' if hit else 'still missed'}",flush=True)
    except Exception as e:
        out.append({"id":c["id"],"error":str(e),"hit":False})
        print(c["id"],"ERR",e,flush=True)
    json.dump(out,open(os.path.join(BASE,"ablation_result.json"),"w"),indent=1)
print(f"\nHYBRID recovered {caught}/{len(cases)} of the rules-missed scams ({100*caught/len(cases):.0f}%)")
