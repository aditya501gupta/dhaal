# DHAAL G1 Accuracy Drill - Live Production Endpoint

Endpoint: `https://aditya501gupta-dhaal-api.hf.space/analyze`  
Samples fired: **25** (stratified: 8 scam classes + benign hard-negatives)

## Headline

- Overall correct-side accuracy: **24/25 = 96.0%**
- Scam recall (caught): **100.0%** (17/17)
- False-positive rate on benign: **12.5%** (1/8)
- LLM layer engaged on: **14/25** inputs
- Latency p50 **1529 ms**, p90 **1750 ms**

## Per-input results

| # | id | class | lang | expected | verdict | conf | llm | ms | result |
|--|----|-------|------|----------|---------|------|-----|----|--------|
| 1 | da-001 | digital_arrest | en | scam | SCAM | 0.99 | - | 1286 | OK |
| 2 | ky-001 | kyc_bank | en | scam | SCAM | 0.99 | - | 1059 | OK |
| 3 | pc-001 | parcel_courier | en | scam | SCAM | 0.99 | - | 1229 | OK |
| 4 | ut-001 | utility | en | scam | SCAM | 0.99 | - | 1228 | OK |
| 5 | it-001 | investment_task | en | scam | SCAM | 0.97 | yes | 1642 | OK |
| 6 | up-001 | upi_request | en | scam | SCAM | 0.99 | yes | 1732 | OK |
| 7 | ph-001 | phishing_link | en | scam | SCAM | 0.99 | yes | 1430 | OK |
| 8 | im-001 | impersonation | en | scam | SCAM | 0.99 | - | 1128 | OK |
| 9 | da-002 | digital_arrest | en | scam | SCAM | 0.99 | - | 1233 | OK |
| 10 | ky-002 | kyc_bank | en | scam | SCAM | 0.99 | - | 1221 | OK |
| 11 | pc-002 | parcel_courier | en | scam | SCAM | 0.99 | - | 1125 | OK |
| 12 | ut-002 | utility | en | scam | SCAM | 0.99 | - | 1326 | OK |
| 13 | it-002 | investment_task | en | scam | SCAM | 0.99 | yes | 1927 | OK |
| 14 | up-002 | upi_request | en | scam | SCAM | 0.99 | - | 1209 | OK |
| 15 | ph-002 | phishing_link | hinglish | scam | SCAM | 0.99 | yes | 1567 | OK |
| 16 | im-002 | impersonation | en | scam | SCAM | 0.97 | yes | 1744 | OK |
| 17 | da-003 | digital_arrest | en | scam | SCAM | 0.99 | - | 1121 | OK |
| 18 | bn-001 | none | en | benign | SAFE | 0.99 | yes | 1529 | OK |
| 19 | bn-002 | none | en | benign | SAFE | 0.99 | yes | 1637 | OK |
| 20 | bn-003 | none | en | benign | SAFE | 0.99 | yes | 1699 | OK |
| 21 | bn-004 | none | en | benign | SAFE | 0.99 | yes | 1574 | OK |
| 22 | bn-005 | none | en | benign | SAFE | 0.99 | yes | 1750 | OK |
| 23 | bn-006 | none | hinglish | benign | SAFE | 0.99 | yes | 1727 | OK |
| 24 | bn-007 | none | en | benign | SAFE | 0.99 | yes | 1636 | OK |
| 25 | bn-008 | none | en | benign | SUSPICIOUS | 0.55 | yes | 1761 | MISS |
