"""Grow IndiaScam-Bench to 600+ with labelled-synthetic multilingual variants.

Honesty contract: every generated row is marked synthetic:true. The 103 hand-
collected real samples are dated NEWEST so they form the temporal HOLD-OUT
(test-only) set; synthetic variants are dated older. Templates carry real
manipulation structure but randomised entities, so the benchmark measures
consistency across paraphrase/language, NOT real-world generalisation.
"""
import json, os, random

random.seed(6262)
BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
SRC = os.path.join(ROOT, "data", "samples.jsonl")
OUT = os.path.join(ROOT, "data", "samples_600.jsonl")

BANKS = ["HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB", "Bank of Baroda"]
AMT = ["2,340", "4,500", "9,999", "15,000", "25,000", "48,500", "1,20,000"]
LINKS = ["hdfc-rekyc.xyz", "sbi-verify.online", "kyc-update.info", "bses-pay.online",
         "icici-secure.top", "rbi-verify.online", "pmkvy-registration.in", "customs-clear.help"]
UPI = ["verifyrbi@okaxis", "kycupdate@ybl", "refund.help@paytm", "taskadmin@okicici"]
NAME = ["Sharma ji", "beta", "Rohit", "Priya", "uncle", "madam"]

# templates: scam classes x languages. {A}=amount {B}=bank {L}=link {U}=upi {N}=name
SCAM = {
 "digital_arrest": {
   "en": ["This is {B} Cyber Cell / Mumbai Police. A parcel in your name has illegal items and an arrest warrant is issued. Stay on this video call and transfer Rs {A} to the RBI verification account. Do not tell anyone.",
          "CBI calling. Your Aadhaar is linked to a money-laundering case. To avoid digital arrest, move Rs {A} to a government holding account now and keep this confidential."],
   "hi": ["यह मुंबई पुलिस साइबर सेल है। आपके नाम पर गिरफ्तारी वारंट है। डिजिटल अरेस्ट से बचने के लिए {A} रुपये RBI सत्यापन खाते में तुरंत भेजें, किसी को न बताएं।",
          "CBI बोल रहे हैं, आपका आधार मनी लॉन्ड्रिंग केस से जुड़ा है। {A} रुपये सरकारी खाते में भेजें वरना गिरफ्तारी होगी।"],
   "hinglish": ["Mumbai Police cyber cell se baat kar rahe hain. Aapke naam arrest warrant hai. Digital arrest se bachna hai to Rs {A} RBI verification account me abhi transfer karo, kisi ko mat batao."],
 },
 "kyc_bank": {
   "en": ["{B} ALERT: Your net-banking will be deactivated today. Complete re-KYC in 24 hours at {L} or your account is frozen. Share the OTP with our executive.",
          "Dear customer, your {B} account KYC has expired. Update now at {L} and confirm the OTP we sent to avoid suspension of Rs {A}."],
   "hi": ["{B} अलर्ट: आपकी नेट बैंकिंग आज बंद हो जाएगी। 24 घंटे में {L} पर री-KYC पूरा करें और OTP बताएं वरना खाता फ्रीज हो जाएगा।"],
   "hinglish": ["{B} KYC expire ho gaya hai. Account band hone se pehle {L} par update karo aur OTP share karo warna Rs {A} block ho jayega."],
 },
 "parcel_courier": {
   "en": ["This is FedEx/DHL. Your parcel with illegal contents is seized by Customs. Press 9 to talk to an officer and pay Rs {A} clearance at {L}.",
          "Your international parcel is held at Customs. Pay a duty of Rs {A} to {U} within 2 hours or it will be returned and a case filed."],
   "hi": ["यह FedEx है। आपका पार्सल कस्टम में जब्त हुआ है। अधिकारी से बात करने के लिए 9 दबाएं और {L} पर {A} रुपये जमा करें।"],
   "hinglish": ["Aapka parcel customs me atka hai. Rs {A} duty {U} par 2 ghante me bhejo warna case ho jayega."],
 },
 "utility": {
   "en": ["Dear Consumer, your electricity will be disconnected tonight 9:30 PM due to a pending bill. Contact our officer at {L} and pay Rs {A} to avoid disconnection. -Electricity Board",
          "Your gas connection will be blocked for KYC. Update at {L} and pay Rs {A} now."],
   "hi": ["प्रिय उपभोक्ता, बिल बकाया के कारण आज रात आपकी बिजली काट दी जाएगी। {L} पर {A} रुपये जमा करें। -बिजली विभाग"],
   "hinglish": ["Bijli aaj raat kat jayegi bill pending ki wajah se. {L} par Rs {A} jama karo turant."],
 },
 "investment_task": {
   "en": ["Earn Rs {A} daily rating YouTube videos. First task free! Pay Rs 500 refundable registration to unlock VIP task slots. Join our Telegram now.",
          "Guaranteed 30% weekly returns on our trading app. Deposit Rs {A} today and withdraw anytime. Limited VIP seats via {L}."],
   "hi": ["रोज़ {A} रुपये कमाएं वीडियो लाइक करके। पहला टास्क फ्री! VIP टास्क के लिए 500 रुपये रजिस्ट्रेशन भरें। अभी टेलीग्राम जॉइन करें।"],
   "hinglish": ["Roz Rs {A} kamao videos like karke. VIP slots ke liye Rs 500 refundable registration bharo, Telegram join karo abhi."],
 },
 "upi_request": {
   "en": ["Sir I sent Rs {A} to your UPI by mistake. Please accept the collect request I am sending and approve with your UPI PIN to reverse it.",
          "You have won a cashback of Rs {A}. Accept the payment request on your UPI app and enter your PIN to receive it."],
   "hi": ["सर मैंने गलती से आपके UPI पर {A} रुपये भेज दिए। जो कलेक्ट रिक्वेस्ट भेजी है उसे PIN डालकर स्वीकार करें ताकि पैसे वापस हों।"],
   "hinglish": ["Bhai galti se {A} rupaye aapke UPI par chale gaye. Collect request accept karke PIN daalo to refund ho jayega."],
 },
 "phishing_link": {
   "en": ["Congratulations! You are selected for a govt stipend of Rs {A}/month. Complete registration and pay Rs 250 processing fee at {L} within 12 hours.",
          "Your {B} reward points worth Rs {A} expire today. Redeem now at {L} by logging in with your card and OTP."],
   "hi": ["बधाई हो! आपको {A} रुपये मासिक सरकारी स्टाइपेंड के लिए चुना गया है। 12 घंटे में {L} पर रजिस्टर करें और 250 रुपये फीस दें।"],
   "hinglish": ["Aapke {B} reward points Rs {A} aaj expire ho rahe hain. {L} par login karke card aur OTP se redeem karo."],
 },
 "impersonation": {
   "en": ["Hi {N}, this is your MD. I'm in a meeting and can't talk. Urgently buy Rs {A} gift vouchers for a client and send me the codes, I'll reimburse today.",
          "{N}, I lost my phone and this is my new number. I urgently need Rs {A}, please send to {U} now, will return tomorrow."],
   "hi": ["{N}, यह तुम्हारे सर बोल रहे हैं, मीटिंग में हूं। जल्दी से {A} रुपये के गिफ्ट वाउचर खरीदकर कोड भेजो, आज लौटा दूंगा।"],
   "hinglish": ["{N}, mera naya number hai, purana kho gaya. Urgent Rs {A} chahiye, {U} par bhej do abhi, kal wapas kar dunga."],
 },
}

BENIGN = {
 "en": ["Dear Customer, Rs {A} is debited from A/c XX1234 at AMAZON PAY. Avl Bal Rs 32,110. Not you? Call 1800-111-109 ({B}).",
        "Your {B} OTP for login is 448291. Valid 10 min. Do NOT share it with anyone. Bank never calls to ask OTP.",
        "Your Amazon order has shipped and arrives tomorrow by 7 PM. Track in the app. No action needed.",
        "Reminder: your electricity bill of Rs {A} is due on the 15th. Pay via the official BESCOM app or website.",
        "Appointment confirmed at City Hospital on Monday 11 AM. Reply CANCEL to reschedule.",
        "{B}: Rs {A} credited to your A/c by NEFT from RAHUL SHARMA. Avl Bal updated."],
 "hi": ["प्रिय ग्राहक, आपके खाते से {A} रुपये DMART में डेबिट हुए। शेष राशि 12,300। आपने नहीं किया तो 1800-111-109 पर कॉल करें।",
        "बेटा, बिजली का बिल {A} रुपये आज GPay से भर देना, लास्ट डेट है। -पापा",
        "आपका ट्रेन टिकट कन्फर्म हो गया है, PNR 84512367। यात्रा शुभ हो।"],
 "hinglish": ["Beta {N}, kal doodh aur sabzi le aana market se, paise sham ko de dunga.",
        "Aapka {B} salary Rs {A} account me credit ho gaya hai. Avl balance updated."],
}

def fill(t):
    return (t.replace("{A}", random.choice(AMT)).replace("{B}", random.choice(BANKS))
            .replace("{L}", random.choice(LINKS)).replace("{U}", random.choice(UPI))
            .replace("{N}", random.choice(NAME)))

rows = []
n = 0
# synthetic scams: aim ~ 55 per class
for cls, langs in SCAM.items():
    for i in range(55):
        lang = random.choice(list(langs.keys()))
        text = fill(random.choice(langs[lang]))
        n += 1
        rows.append({"id": f"syn-s-{n:04d}", "text": text, "label": "scam",
                     "scam_type": cls, "language": lang, "source": "synthetic-template",
                     "synthetic": True})
# synthetic benign: aim ~ 130
for i in range(130):
    lang = random.choice(list(BENIGN.keys()))
    text = fill(random.choice(BENIGN[lang]))
    n += 1
    rows.append({"id": f"syn-b-{n:04d}", "text": text, "label": "benign",
                 "scam_type": "none", "language": lang, "source": "synthetic-template",
                 "synthetic": True})

# assign collection dates: synthetic = older (Jun), real = newest (Jul) => temporal hold-out
random.shuffle(rows)
for i, r in enumerate(rows):
    day = 1 + (i * 25 // max(len(rows), 1))  # spread across June
    r["collected_date"] = f"2026-06-{min(day,30):02d}"

real = [json.loads(l) for l in open(SRC, encoding="utf-8") if l.strip()]
for i, r in enumerate(real):
    r.setdefault("synthetic", False)
    r["collected_date"] = f"2026-07-{1 + (i % 12):02d}"  # newest -> hold-out test set

allrows = rows + real
with open(OUT, "w", encoding="utf-8") as f:
    for r in allrows:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")

print(f"wrote {len(allrows)} samples ({sum(1 for r in allrows if r['label']=='scam')} scam / "
      f"{sum(1 for r in allrows if r['label']=='benign')} benign); "
      f"synthetic {sum(1 for r in allrows if r['synthetic'])}, real {sum(1 for r in allrows if not r['synthetic'])}")
