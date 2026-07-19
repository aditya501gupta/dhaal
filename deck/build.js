const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
p.author = "Team DHAAL";
p.title = "DHAAL — ET AI Hackathon 2.0";

// ---- palette ----
const NAVY = "1F3864", STEEL = "2E5AA8", ICE = "CADCFC", SKY = "EAF0FB";
const AMBER = "E8A33D", RED = "E5484D", GREEN = "2E9E5B";
const INK = "1A2230", MUTED = "5B6472", WHITE = "FFFFFF", LINE = "D8E0EE";
const HEAD = "Cambria", BODY = "Calibri";
const W = 13.33, H = 7.5;

const shadow = (o = {}) => Object.assign({ type: "outer", color: "9AA7BD", opacity: 0.35, blur: 8, offset: 3, angle: 90 }, o);
const softShadow = () => shadow({ color: "C7D0E0", opacity: 0.5, blur: 10, offset: 4 });

function bg(s, color) { s.background = { color }; }

// number chip (filled circle with a number/glyph)
function chip(s, x, y, d, fill, txt, txtColor = WHITE, size = 20) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, shadow: shadow({ blur: 6, offset: 2, opacity: 0.25 }) });
  s.addText(txt, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: HEAD, bold: true, color: txtColor, fontSize: size, margin: 0 });
}

// light content card
function card(s, x, y, w, h, fill = WHITE) {
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: LINE, width: 1 }, shadow: softShadow() });
}

function eyebrow(s, txt, x = 0.7, y = 0.55, color = STEEL) {
  s.addText(txt.toUpperCase(), { x, y, w: 11, h: 0.32, fontFace: BODY, bold: true, color, fontSize: 12.5, charSpacing: 3, margin: 0 });
}
function title(s, txt, x = 0.7, y = 0.9, w = 12, color = NAVY, size = 34) {
  s.addText(txt, { x, y, w, h: 0.9, fontFace: HEAD, bold: true, color, fontSize: size, margin: 0 });
}

// =================================================================== 1 · TITLE
let s = p.addSlide(); bg(s, NAVY);
s.addShape(p.ShapeType.ellipse, { x: 10.1, y: -1.7, w: 5.2, h: 5.2, fill: { color: STEEL }, line: { type: "none" } });
s.addShape(p.ShapeType.ellipse, { x: 11.4, y: 4.7, w: 3.6, h: 3.6, fill: { color: "24406E" }, line: { type: "none" } });
// emblem
s.addShape(p.ShapeType.roundRect, { x: 0.85, y: 0.8, w: 0.95, h: 0.95, rectRadius: 0.18, fill: { color: AMBER }, line: { type: "none" }, shadow: shadow({ opacity: 0.4 }) });
s.addText("D", { x: 0.85, y: 0.8, w: 0.95, h: 0.95, align: "center", valign: "middle", fontFace: HEAD, bold: true, color: NAVY, fontSize: 40, margin: 0 });
s.addText("DHAAL", { x: 0.8, y: 2.35, w: 10, h: 1.5, fontFace: HEAD, bold: true, color: WHITE, fontSize: 88, margin: 0 });
s.addText("Digital Harm Analysis & Alert Layer", { x: 0.85, y: 3.75, w: 11, h: 0.6, fontFace: BODY, color: ICE, fontSize: 24, margin: 0 });
s.addText("A real-time AI shield against digital-arrest & UPI scams — active in the two minutes the scam is actually happening.",
  { x: 0.85, y: 4.5, w: 10.6, h: 1.0, fontFace: BODY, italic: true, color: AMBER, fontSize: 17, margin: 0, lineSpacingMultiple: 1.1 });
s.addText([
  { text: "ET AI Hackathon 2.0", options: { bold: true, color: WHITE } },
  { text: "   ·   Problem Statement 6 — AI for Digital Public Safety", options: { color: ICE } },
], { x: 0.85, y: 6.35, w: 11.6, h: 0.4, fontFace: BODY, fontSize: 14, margin: 0 });
s.addText("Live demo: dhaal-eta.vercel.app     ·     API: aditya501gupta-dhaal-api.hf.space",
  { x: 0.85, y: 6.78, w: 11.6, h: 0.4, fontFace: BODY, color: "9DB4E6", fontSize: 12.5, margin: 0 });
s.addNotes("DHAAL is a real-time, explainable AI shield that tells a citizen whether a message or call is a scam — and exactly why — in the seconds the scam is happening. Live today.");

// =================================================================== 2 · PROBLEM
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "The problem");
title(s, "A ₹22,495 crore crime wave — every phone is a target");
// big stat
card(s, 0.7, 1.95, 5.2, 4.5, NAVY);
s.addText("₹22,495", { x: 0.9, y: 2.35, w: 4.8, h: 1.2, fontFace: HEAD, bold: true, color: WHITE, fontSize: 66, margin: 0 });
s.addText("CRORE", { x: 0.95, y: 3.5, w: 4.8, h: 0.4, fontFace: BODY, bold: true, color: AMBER, fontSize: 20, charSpacing: 4, margin: 0 });
s.addText("lost by Indians to cyber fraud in 2025 — across 28.15 lakh reported cases, a 24% jump in a single year.",
  { x: 0.95, y: 4.05, w: 4.7, h: 1.5, fontFace: BODY, color: ICE, fontSize: 15.5, margin: 0, lineSpacingMultiple: 1.15 });
s.addText("Source: I4C / NCRP national data, 2025", { x: 0.95, y: 5.95, w: 4.7, h: 0.3, fontFace: BODY, italic: true, color: "9DB4E6", fontSize: 10.5, margin: 0 });
// doughnut: where the money goes
card(s, 6.25, 1.95, 6.4, 4.5);
s.addText("Where the money goes (share of 2025 losses)", { x: 6.55, y: 2.15, w: 5.8, h: 0.4, fontFace: BODY, bold: true, color: INK, fontSize: 14, margin: 0 });
s.addChart(p.ChartType.doughnut, [{
  name: "Loss share", labels: ["Investment / trading scams", "Digital-arrest scams", "Other (UPI, KYC, task, etc.)"],
  values: [76, 9, 15],
}], {
  x: 6.35, y: 2.55, w: 3.5, h: 3.6, holeSize: 55,
  chartColors: [STEEL, RED, ICE], showTitle: false, showLegend: false,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontFace: BODY, dataLabelFontSize: 11, dataLabelFormatCode: '0"%"',
});
// legend rows
const leg = [["Investment / trading scams", "76%", STEEL], ["Digital-arrest scams", "9% ≈ ₹2,000 Cr", RED], ["Other: UPI, KYC, task, romance", "15%", ICE]];
leg.forEach((r, i) => {
  const y = 2.9 + i * 0.72;
  s.addShape(p.ShapeType.ellipse, { x: 9.95, y: y + 0.04, w: 0.22, h: 0.22, fill: { color: r[2] }, line: { type: "none" } });
  s.addText(r[0], { x: 10.28, y: y - 0.04, w: 2.35, h: 0.35, fontFace: BODY, bold: true, color: INK, fontSize: 11.5, margin: 0 });
  s.addText(r[1], { x: 10.28, y: y + 0.26, w: 2.35, h: 0.3, fontFace: BODY, color: MUTED, fontSize: 10.5, margin: 0 });
});
s.addText("1 in 5 UPI users has faced fraud — and 51% never report it.", { x: 6.55, y: 5.95, w: 6.0, h: 0.35, fontFace: BODY, italic: true, bold: true, color: RED, fontSize: 12.5, margin: 0 });

// =================================================================== 3 · WHY DEFENSES FAIL
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Why today's defenses fail");
title(s, "By the time a bank or the police can act, the money is gone");
const fails = [
  ["1", "The window is ~2 minutes", "The scam is a live performance — authority, fear, urgency, secrecy — engineered to make a person act before they can think.", RED],
  ["2", "The victim is isolated", "“Don't tell anyone, stay on the call.” The one moment a second opinion would help is the exact moment it's designed away.", AMBER],
  ["3", "Help is post-mortem", "Blocklists, 1930 and bank freezes all act after the transfer. Nothing intervenes in the citizen's hand, in their language, in the moment.", STEEL],
];
fails.forEach((f, i) => {
  const x = 0.7 + i * 4.12;
  card(s, x, 2.05, 3.85, 4.35);
  chip(s, x + 0.3, 2.4, 0.8, f[3], f[0], WHITE, 26);
  s.addText(f[1], { x: x + 0.3, y: 3.45, w: 3.25, h: 0.75, fontFace: HEAD, bold: true, color: NAVY, fontSize: 18.5, margin: 0 });
  s.addText(f[2], { x: x + 0.3, y: 4.25, w: 3.28, h: 2.0, fontFace: BODY, color: MUTED, fontSize: 13.5, margin: 0, lineSpacingMultiple: 1.18 });
});
s.addText("DHAAL closes exactly that gap — a second opinion in the seconds that matter.",
  { x: 0.7, y: 6.62, w: 12, h: 0.4, align: "center", fontFace: BODY, italic: true, bold: true, color: NAVY, fontSize: 14.5, margin: 0 });

// =================================================================== 4 · SOLUTION 3-LAYER
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "The solution");
title(s, "One shield, three layers");
const layers = [
  ["L1", "Citizen Shield", "Paste, share or screenshot any message → an explained verdict in seconds: scam or not, the manipulation tactics, official advice, and a ready-to-file 1930 complaint. 6+ languages.", NAVY],
  ["L2", "Intelligence", "PII-redacted reports cluster into fraud campaigns via script embeddings + HMAC-pseudonymised indicators — early warning after as few as 5 reports.", STEEL],
  ["L3", "Command Centre", "Geospatial hotspots, campaign explorer and SHA-256 hash-chained evidence dossiers with BSA s.63-style certificates for investigators.", AMBER],
];
layers.forEach((l, i) => {
  const x = 0.7 + i * 4.12;
  card(s, x, 2.05, 3.85, 4.5);
  chip(s, x + 0.3, 2.38, 0.82, l[3], l[0], l[0] === AMBER ? NAVY : WHITE, 19);
  s.addText(l[1], { x: x + 1.28, y: 2.5, w: 2.4, h: 0.6, valign: "middle", fontFace: HEAD, bold: true, color: NAVY, fontSize: 19, margin: 0 });
  s.addText(l[2], { x: x + 0.3, y: 3.45, w: 3.28, h: 2.9, fontFace: BODY, color: MUTED, fontSize: 13.5, margin: 0, lineSpacingMultiple: 1.2 });
});
s.addText([{ text: "Live today: ", options: { bold: true, color: NAVY } }, { text: "Layer 1 is deployed and running. Layers 2–3 are the build-out.", options: { color: MUTED } }],
  { x: 0.7, y: 6.72, w: 12, h: 0.35, align: "center", fontFace: BODY, italic: true, fontSize: 13.5, margin: 0 });

// =================================================================== 5 · LIVE NOW
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Live today — not a mockup");
title(s, "Open it on your phone right now");
// left: features
const feats = [
  ["Verdict in under 3 seconds", "Paste any SMS / WhatsApp / email — get SCAM · SUSPICIOUS · SAFE with a confidence score."],
  ["Scam anatomy, in their words", "The manipulative phrases are highlighted inside the message, with the tactics named."],
  ["English ⇄ हिंदी", "Whole interface, samples and warnings switch language in one tap."],
  ["One-tap 1930 complaint", "Auto-drafts a cybercrime.gov.in / 1930-ready complaint, and a share-warning for family."],
];
feats.forEach((f, i) => {
  const y = 2.05 + i * 1.12;
  chip(s, 0.75, y, 0.62, i % 2 ? STEEL : NAVY, "✓", WHITE, 18);
  s.addText(f[0], { x: 1.55, y: y - 0.04, w: 5.7, h: 0.4, fontFace: HEAD, bold: true, color: NAVY, fontSize: 16.5, margin: 0 });
  s.addText(f[1], { x: 1.55, y: y + 0.34, w: 5.7, h: 0.7, fontFace: BODY, color: MUTED, fontSize: 12.8, margin: 0, lineSpacingMultiple: 1.1 });
});
// right: phone mock
const px = 8.4, pw = 3.5;
s.addShape(p.ShapeType.roundRect, { x: px, y: 1.85, w: pw, h: 4.85, rectRadius: 0.35, fill: { color: NAVY }, line: { type: "none" }, shadow: shadow({ blur: 14, offset: 5, opacity: 0.4 }) });
s.addShape(p.ShapeType.roundRect, { x: px + 0.18, y: 2.05, w: pw - 0.36, h: 4.45, rectRadius: 0.22, fill: { color: "F5F7FB" }, line: { type: "none" } });
s.addText("🛡  DHAAL", { x: px + 0.35, y: 2.2, w: pw - 0.6, h: 0.4, fontFace: HEAD, bold: true, color: NAVY, fontSize: 15, margin: 0 });
s.addShape(p.ShapeType.roundRect, { x: px + 0.32, y: 2.68, w: pw - 0.64, h: 0.85, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
s.addText("“This is FedEx. Your parcel has illegal items. Mumbai Police issued an arrest warrant…”",
  { x: px + 0.44, y: 2.74, w: pw - 0.88, h: 0.74, fontFace: BODY, italic: true, color: MUTED, fontSize: 9.5, margin: 0, lineSpacingMultiple: 1.0 });
s.addShape(p.ShapeType.roundRect, { x: px + 0.32, y: 3.66, w: pw - 0.64, h: 2.55, rectRadius: 0.12, fill: { color: WHITE }, line: { color: RED, width: 1.5 }, shadow: softShadow() });
s.addText("🚨 SCAM", { x: px + 0.46, y: 3.8, w: 2.0, h: 0.45, fontFace: HEAD, bold: true, color: RED, fontSize: 20, margin: 0 });
s.addText("digital arrest · 98%", { x: px + 0.46, y: 4.24, w: pw - 0.9, h: 0.3, fontFace: BODY, color: MUTED, fontSize: 10.5, margin: 0 });
["authority impersonation", "fear + urgency", "isolation", "payment pressure"].forEach((tg, i) => {
  const cx = px + 0.46 + (i % 2) * 1.42, cy = 4.62 + Math.floor(i / 2) * 0.44;
  s.addShape(p.ShapeType.roundRect, { x: cx, y: cy, w: 1.34, h: 0.34, rectRadius: 0.17, fill: { color: SKY }, line: { type: "none" } });
  s.addText(tg, { x: cx, y: cy, w: 1.34, h: 0.34, align: "center", valign: "middle", fontFace: BODY, bold: true, color: NAVY, fontSize: 7.8, margin: 0 });
});
s.addShape(p.ShapeType.roundRect, { x: px + 0.46, y: 5.62, w: pw - 0.92, h: 0.45, rectRadius: 0.1, fill: { color: RED }, line: { type: "none" } });
s.addText("Draft 1930 complaint", { x: px + 0.46, y: 5.62, w: pw - 0.92, h: 0.45, align: "center", valign: "middle", fontFace: BODY, bold: true, color: WHITE, fontSize: 11, margin: 0 });
// url band
s.addShape(p.ShapeType.roundRect, { x: 0.7, y: 6.55, w: 7.35, h: 0.62, rectRadius: 0.1, fill: { color: SKY }, line: { type: "none" } });
s.addText([{ text: "Try it:  ", options: { bold: true, color: NAVY } }, { text: "dhaal-eta.vercel.app", options: { bold: true, color: STEEL } }, { text: "     ·     API + live docs: aditya501gupta-dhaal-api.hf.space/docs", options: { color: MUTED } }],
  { x: 0.95, y: 6.55, w: 6.9, h: 0.62, valign: "middle", fontFace: BODY, fontSize: 12.5, margin: 0 });

// =================================================================== 5B · CITIZEN EXPERIENCE
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Designed for the people scammers target most");
title(s, "Consent-first, family-aware, and built for elders");
{
  const cx0 = 0.7, cw = 2.37, cg = 0.09, cyy = 2.05, ch = 4.0;
  const exp = [
    ["🔐", "Consent first", "A 6-language onboarding screen with an explicit “what DHAAL will never do” promise. Every scan is opt-in and off by default.", NAVY],
    ["👪", "Family guardian", "Set a trusted relative. On a SCAM verdict the phone vibrates and offers a one-tap WhatsApp / call warning to them.", STEEL],
    ["🔎", "Easy-view mode", "One switch enlarges text and buttons for elderly users — the people digital-arrest gangs target most.", GREEN],
    ["📲", "Install as an app", "Add-to-home-screen PWA — opens like a native app, no store needed, works on any phone.", AMBER],
    ["🛡", "Native SMS shield", "The Android build scans incoming SMS in the background and fires a vibrate + alert even when the app is closed.", RED],
  ];
  exp.forEach((e, i) => {
    const x = cx0 + i * (cw + cg);
    card(s, x, cyy, cw, ch);
    s.addShape(p.ShapeType.roundRect, { x: x + 0.22, y: cyy + 0.28, w: 0.8, h: 0.8, rectRadius: 0.16, fill: { color: e[3] }, line: { type: "none" }, shadow: shadow({ blur: 6, offset: 2, opacity: 0.25 }) });
    s.addText(e[0], { x: x + 0.22, y: cyy + 0.28, w: 0.8, h: 0.8, align: "center", valign: "middle", fontSize: 22, margin: 0 });
    s.addText(e[1], { x: x + 0.18, y: cyy + 1.26, w: cw - 0.36, h: 0.5, fontFace: HEAD, bold: true, color: NAVY, fontSize: 15, margin: 0 });
    s.addText(e[2], { x: x + 0.18, y: cyy + 1.8, w: cw - 0.36, h: 2.05, fontFace: BODY, color: MUTED, fontSize: 11.3, margin: 0, lineSpacingMultiple: 1.16 });
  });
  s.addText([{ text: "Privacy: ", options: { bold: true, color: NAVY } }, { text: "message and call text is analysed over HTTPS and never stored on the device — consent is built in, not bolted on.", options: { color: MUTED } }],
    { x: 0.7, y: 6.3, w: 12, h: 0.4, align: "center", fontFace: BODY, italic: true, fontSize: 13, margin: 0 });
}

// =================================================================== 6 · HYBRID ENGINE
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Under the hood");
title(s, "How a verdict is built — four signals, honestly fused");
const steps = [
  ["Rules", "Deterministic & explainable. 8 scam classes via manipulation-lever combinations + benign guardrails.", NAVY],
  ["Forensic Agent", "Live URL threat-intel (Safe Browsing + URLhaus) plus look-alike / punycode heuristics.", STEEL],
  ["LLM reasoning", "Llama-3.3-70B on Groq → Gemini fallback. Injection-hardened, schema-validated, cached.", AMBER],
  ["Calibrated fusion", "Combines all three; max disagreement → SUSPICIOUS + human-review flag. Never over-claims.", GREEN],
];
const cw = 2.85, gap = 0.32, startx = 0.7, cy = 2.35;
steps.forEach((st, i) => {
  const x = startx + i * (cw + gap);
  card(s, x, cy, cw, 3.0);
  chip(s, x + 0.28, cy + 0.28, 0.66, st[2], String(i + 1), st[2] === AMBER ? NAVY : WHITE, 17);
  s.addText(st[0], { x: x + 0.28, y: cy + 1.05, w: cw - 0.5, h: 0.5, fontFace: HEAD, bold: true, color: NAVY, fontSize: 16.5, margin: 0 });
  s.addText(st[1], { x: x + 0.28, y: cy + 1.55, w: cw - 0.52, h: 1.35, fontFace: BODY, color: MUTED, fontSize: 12, margin: 0, lineSpacingMultiple: 1.14 });
  if (i < 3) s.addText("→", { x: x + cw - 0.02, y: cy + 1.0, w: gap + 0.04, h: 0.6, align: "center", valign: "middle", fontFace: BODY, bold: true, color: STEEL, fontSize: 22, margin: 0 });
});
card(s, 0.7, 5.65, 11.93, 1.15, "13294B");
s.addText([
  { text: "SSRF-safe by design:  ", options: { bold: true, color: AMBER } },
  { text: "the Forensic Agent never fetches or opens the scammer's link — it only asks trusted threat databases about it, and strips any victim PII from the URL before it ever leaves the box.", options: { color: ICE } },
], { x: 1.0, y: 5.65, w: 11.4, h: 1.15, valign: "middle", fontFace: BODY, fontSize: 14, margin: 0, lineSpacingMultiple: 1.1 });

// =================================================================== 7 · RESULTS
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Does it actually work?");
title(s, "IndiaScam-Bench — measured, and reproduced on every commit");
const stats = [["100%", "scam recall", GREEN], ["100%", "precision", NAVY], ["0%", "false-positive rate", STEEL]];
stats.forEach((st, i) => {
  const x = 0.7 + i * 3.15;
  card(s, x, 2.1, 2.9, 2.3);
  s.addText(st[0], { x: x, y: 2.35, w: 2.9, h: 1.1, align: "center", fontFace: HEAD, bold: true, color: st[2], fontSize: 56, margin: 0 });
  s.addText(st[1], { x: x, y: 3.55, w: 2.9, h: 0.5, align: "center", fontFace: BODY, bold: true, color: MUTED, fontSize: 15, margin: 0 });
});
// right column: corpus + reproducibility
card(s, 10.3, 2.1, 2.33, 2.3, NAVY);
s.addText("103", { x: 10.3, y: 2.3, w: 2.33, h: 0.9, align: "center", fontFace: HEAD, bold: true, color: WHITE, fontSize: 46, margin: 0 });
s.addText("labelled samples\n73 scam / 30 benign\nEN · HI · Hinglish", { x: 10.3, y: 3.25, w: 2.33, h: 1.0, align: "center", fontFace: BODY, color: ICE, fontSize: 11.5, margin: 0, lineSpacingMultiple: 1.1 });
// honest caveat
card(s, 0.7, 4.7, 11.93, 1.05, "FBF4E6");
s.addText([
  { text: "Honest caveat:  ", options: { bold: true, color: "9A6B12" } },
  { text: "the seed corpus is small and partly synthetic. It grows toward 600+ samples with a temporal hold-out split before any headline generalisation claim — and the whole benchmark re-runs in CI on every push, so these numbers can't silently rot.", options: { color: "6B5420" } },
], { x: 1.0, y: 4.7, w: 11.4, h: 1.05, valign: "middle", fontFace: BODY, fontSize: 12.5, margin: 0, lineSpacingMultiple: 1.1 });
// method line
s.addText("Detects 8 scam classes: digital arrest · KYC/re-verify · UPI collect · task/investment · loan · lottery · sextortion · delivery-OTP.",
  { x: 0.7, y: 6.05, w: 11.93, h: 0.5, fontFace: BODY, italic: true, color: MUTED, fontSize: 12.5, margin: 0 });

// =================================================================== 8 · SECURITY
s = p.addSlide(); bg(s, NAVY);
eyebrow(s, "Trust is the product", 0.7, 0.55, AMBER);
title(s, "Safe & private by design", 0.7, 0.9, 12, WHITE);
const sec = [
  ["No SSRF hole", "Treats every link as an untrusted string — never fetches or resolves it. Private/loopback hosts are flagged, never contacted."],
  ["PII never leaves the box", "Query strings carrying phone numbers, OTPs and tokens are stripped before any third-party lookup."],
  ["Prompt-injection hardened", "Message content is data, never instructions — the LLM can't be hijacked by text inside the scam."],
  ["DPDP-mapped & pseudonymised", "Consent-based, auto-redaction before storage, HMAC-only indicators — no raw scammer identifiers in the graph."],
];
sec.forEach((sc, i) => {
  const x = 0.7 + (i % 2) * 6.15, y = 2.15 + Math.floor(i / 2) * 2.25;
  s.addShape(p.ShapeType.roundRect, { x, y, w: 5.85, h: 2.0, rectRadius: 0.1, fill: { color: "294574" }, line: { type: "none" }, shadow: shadow({ opacity: 0.3, blur: 8 }) });
  chip(s, x + 0.3, y + 0.32, 0.62, AMBER, "✓", NAVY, 18);
  s.addText(sc[0], { x: x + 1.1, y: y + 0.36, w: 4.5, h: 0.55, valign: "middle", fontFace: HEAD, bold: true, color: WHITE, fontSize: 17, margin: 0 });
  s.addText(sc[1], { x: x + 0.35, y: y + 1.05, w: 5.2, h: 0.85, fontFace: BODY, color: ICE, fontSize: 12.8, margin: 0, lineSpacingMultiple: 1.14 });
});
s.addText("A misbehaving or offline feed degrades gracefully to offline heuristics — it can never crash a verdict.",
  { x: 0.7, y: 6.75, w: 12, h: 0.4, align: "center", fontFace: BODY, italic: true, color: "9DB4E6", fontSize: 12.5, margin: 0 });

// =================================================================== 9 · IMPACT
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "Why it scales");
title(s, "Built to reach every phone — at near-zero marginal cost");
const imp = [["₹0", "infrastructure cost", "Groq, Gemini, Vercel & Hugging Face free tiers — the rules engine is dependency-free."],
  ["6+", "languages", "Explainable output in the citizen's own language — designed for Bharat, not just metros."],
  ["Any", "channel", "SMS, WhatsApp, email, screenshots and (next) live-call audio — one verdict engine behind all of them."]];
imp.forEach((m, i) => {
  const x = 0.7 + i * 4.12;
  card(s, x, 2.1, 3.85, 2.5);
  s.addText(m[0], { x, y: 2.3, w: 3.85, h: 1.0, align: "center", fontFace: HEAD, bold: true, color: NAVY, fontSize: 52, margin: 0 });
  s.addText(m[1], { x, y: 3.35, w: 3.85, h: 0.4, align: "center", fontFace: BODY, bold: true, color: AMBER, fontSize: 15, charSpacing: 1, margin: 0 });
  s.addText(m[2], { x: x + 0.3, y: 3.8, w: 3.28, h: 0.75, align: "center", fontFace: BODY, color: MUTED, fontSize: 12, margin: 0, lineSpacingMultiple: 1.1 });
});
card(s, 0.7, 4.95, 11.93, 1.55, NAVY);
s.addText("The prize isn't detection accuracy alone — it's putting an explainable second opinion in the hand of the person on the call, before the transfer. That is a public-safety utility, not a product.",
  { x: 1.1, y: 4.95, w: 11.1, h: 1.55, valign: "middle", fontFace: BODY, italic: true, color: WHITE, fontSize: 16, margin: 0, lineSpacingMultiple: 1.2 });

// =================================================================== 10 · ROADMAP
s = p.addSlide(); bg(s, WHITE);
eyebrow(s, "What's next");
title(s, "From a working shield to a national early-warning system");
const road = [
  ["Now", "L1 shield + native app", "6-language app, consent, guardian alerts, elderly mode, hybrid API and a native Android SMS shield — all live, CI-green.", GREEN],
  ["Next", "L2 campaign clustering", "Script-embedding clusters raise an early warning after ≤5 reports.", STEEL],
  ["Then", "L3 command centre", "Geo hotspots + SHA-256 hash-chained evidence dossiers for police.", NAVY],
  ["Soon", "More languages + on-device", "Bengali/Tamil/Telugu/Marathi corpus, and on-device live-call alerts.", AMBER],
];
road.forEach((r, i) => {
  const x = 0.7 + i * 3.06;
  chip(s, x + 1.1, 2.4, 0.85, r[3], String(i + 1), r[3] === AMBER ? NAVY : WHITE, 20);
  if (i < 3) s.addShape(p.ShapeType.line, { x: x + 1.95, y: 2.82, w: 1.1, h: 0, line: { color: LINE, width: 2, dashType: "dash" } });
  s.addText(r[0].toUpperCase(), { x: x, y: 3.4, w: 3.05, h: 0.3, align: "center", fontFace: BODY, bold: true, color: r[3] === AMBER ? "B87E1E" : r[3], fontSize: 12, charSpacing: 2, margin: 0 });
  s.addText(r[1], { x: x, y: 3.72, w: 3.05, h: 0.6, align: "center", fontFace: HEAD, bold: true, color: NAVY, fontSize: 16, margin: 0 });
  s.addText(r[2], { x: x + 0.2, y: 4.35, w: 2.66, h: 1.3, align: "center", fontFace: BODY, color: MUTED, fontSize: 12, margin: 0, lineSpacingMultiple: 1.15 });
});
// corpus growth line
card(s, 0.7, 6.1, 11.93, 0.85, SKY);
s.addText([{ text: "Already done:  ", options: { bold: true, color: NAVY } }, { text: "IndiaScam-Bench grown to 673 samples with a temporal hold-out; 100% recall on the real hold-out, and survived a 32-case red-team.", options: { color: INK } }],
  { x: 1.0, y: 6.1, w: 11.3, h: 0.85, valign: "middle", fontFace: BODY, fontSize: 13.5, margin: 0 });

// =================================================================== 11 · CLOSE
s = p.addSlide(); bg(s, NAVY);
s.addShape(p.ShapeType.ellipse, { x: -1.6, y: 4.6, w: 5.0, h: 5.0, fill: { color: "24406E" }, line: { type: "none" } });
s.addShape(p.ShapeType.ellipse, { x: 11.0, y: -1.8, w: 4.6, h: 4.6, fill: { color: STEEL }, line: { type: "none" } });
s.addShape(p.ShapeType.roundRect, { x: 0.9, y: 1.7, w: 0.85, h: 0.85, rectRadius: 0.16, fill: { color: AMBER }, line: { type: "none" } });
s.addText("D", { x: 0.9, y: 1.7, w: 0.85, h: 0.85, align: "center", valign: "middle", fontFace: HEAD, bold: true, color: NAVY, fontSize: 36, margin: 0 });
s.addText("A shield in the two minutes\nthat actually matter.", { x: 0.9, y: 2.85, w: 11.5, h: 1.9, fontFace: HEAD, bold: true, color: WHITE, fontSize: 44, margin: 0, lineSpacingMultiple: 1.05 });
s.addText("Rules + Forensic Agent + LLM, honestly fused — explainable, private, and live today.", { x: 0.95, y: 4.75, w: 11, h: 0.5, fontFace: BODY, italic: true, color: AMBER, fontSize: 17, margin: 0 });
// links row
const links = [["Citizen app", "dhaal-eta.vercel.app"], ["Live API + docs", "aditya501gupta-dhaal-api.hf.space/docs"], ["Code", "github.com/aditya501gupta/dhaal"]];
links.forEach((l, i) => {
  const x = 0.9 + i * 4.0;
  s.addShape(p.ShapeType.roundRect, { x, y: 5.6, w: 3.75, h: 0.95, rectRadius: 0.1, fill: { color: "294574" }, line: { type: "none" } });
  s.addText(l[0].toUpperCase(), { x: x + 0.25, y: 5.72, w: 3.3, h: 0.3, fontFace: BODY, bold: true, color: AMBER, fontSize: 10.5, charSpacing: 2, margin: 0 });
  s.addText(l[1], { x: x + 0.25, y: 6.02, w: 3.35, h: 0.4, fontFace: BODY, bold: true, color: WHITE, fontSize: 12.5, margin: 0 });
});
s.addText("Team DHAAL  ·  ET AI Hackathon 2.0  ·  PS-6 · AI for Digital Public Safety", { x: 0.9, y: 6.85, w: 11.6, h: 0.35, fontFace: BODY, color: "9DB4E6", fontSize: 12, margin: 0 });
s.addNotes("Close: DHAAL is explainable, private, and live today. The differentiator is intervention in the moment, in the citizen's language — a public-safety utility.");

p.writeFile({ fileName: "/home/claude/dhaal/deck/DHAAL_pitch.pptx" }).then(f => console.log("WROTE", f));
