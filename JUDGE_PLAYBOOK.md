# DHAAL — Judge Playbook (win the room)

Your product is already strong and live. Rounds like this are won or lost on how you
*present and defend* it. This is your script for the pitch and the Q&A. Rehearse the
bold lines until they're automatic.

---

## 1. The 15-second pitch (memorise this)

> "Digital-arrest and UPI scams cost Indians ₹22,000 crore last year. DHAAL is a live AI
> shield: paste any message or screenshot, or turn on the app, and in under a second it
> tells you — in your language — whether it's a scam and *why*, warns your family, and
> gives police a live map of the campaign. It's deployed and working right now, not a
> mockup."

Say "**live**" and "**right now**" early. Most teams demo a prototype; you demo a product.

## 2. The one-line differentiator (your sharpest weapon)

When a judge thinks "Truecaller / Google already do this," you win with:

> "Truecaller blocks *known* numbers. Google flags *some* calls on *some* phones. DHAAL
> works on the actual **message** — SMS, WhatsApp, email, a screenshot, any channel —
> explains the manipulation so the user *learns*, and loops in a family guardian for the
> elderly who are targeted most. It's explainable and channel-agnostic; they're neither."

Three words to repeat: **explainable, channel-agnostic, family-aware.**

## 3. The three hard questions — and your answers

**Q1. "Your 100% accuracy is on synthetic data — does it really work?"**
Don't get defensive; agree and redirect to your strongest evidence.
> "Correct — and we say so openly. The 673-sample benchmark measures robustness across
> paraphrase and code-mixing, not real-world generalisation. The real-world signals are
> three: 100% recall on a temporal hold-out of *hand-collected* messages the model never
> trained on, 24 of 25 on a live drill against the deployed API, and surviving a 32-case
> red-team. We'd rather show honest numbers than a suspicious 99% on data we curated."
*Turning your caveat into a credibility signal is the move.*

**Q2. "Isn't this too broad — three layers, six languages, an app? Where's the depth?"**
> "The depth is the detection engine. Rules give a 0.45 ms deterministic floor; an LLM
> catches the subtle social-engineering the rules miss; and when they disagree we flag for
> human review instead of guessing — never a silent miss. The layers and languages are
> distribution, not scope-creep: the same engine, reaching the citizen, the family, and
> the police."

**Q3. "Can this actually scale nationally — cost, latency, permissions?"**
> "Yes, by design. Rules resolve most messages in under a millisecond with zero LLM cost,
> so the model only fires on the hard minority — that keeps it cheap. It's stateless and
> horizontally scalable. The SMS-reading permission needs Google's restricted-permission
> review for the Play Store — a policy step, not a technical one — which is why we ship a
> sideload build for the demo and are upfront about it."

## 4. Demo run-of-show (≤ 3 min) + failure plan

Follow `DEMO_SCRIPT.md`. Key discipline:
- **Pre-load** 3–4 scam texts in a notes app so you paste instantly.
- **Record a backup video** of the full flow *before* demo day. If the wifi or the API is
  slow live, play the video — never debug in front of judges.
- Lead with the **live SCAM verdict on a real phone**; that's the moment that sells.
- End on the **police command map** — it makes a citizen app look like national infrastructure.

## 5. How to frame your metrics (don't let "100%" sound fake)

Say it as a range with context, never a bare number:
> "Rules alone: 79% recall but zero false alarms. Add the LLM and we recover effectively
> all the misses — 24 of 24 in the live ablation — with precision untouched. On freshly
> collected real messages, 100% recall; on a 25-input live drill, 24 of 25."

## 6. Your closing line

> "Every other defence acts *after* the money's gone — the bank call, the 1930 complaint.
> DHAAL acts in the two minutes the scam is actually happening, in the victim's own
> language. That's the difference between a report and a rescue."

## 7. Pre-submission polish checklist (fast wins that raise your score)

- [ ] **Record the backup demo video** (biggest single risk-reducer).
- [ ] Put the **three live links + APK link** on the final slide and in the Unstop form.
- [ ] If you have even 1 hour: **collect 20–30 more *real* scam messages** (ask family,
      search public complaint forums) and add them to the hold-out — it directly hardens
      your answer to Q1.
- [ ] Rehearse Q1–Q3 out loud twice. That's worth more than any code change now.
- [ ] Have the app open and the API warm *before* you walk in (hit `/health` once).
