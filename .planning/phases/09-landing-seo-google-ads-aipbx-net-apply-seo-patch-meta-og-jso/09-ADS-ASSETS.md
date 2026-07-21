# Phase 09 — Google Ads EN Campaign Assets (aipbx.net)

**Status:** DRAFT ONLY — founder loads and manages the live campaign in Google Ads.  
**Segment:** EN / `https://aipbx.net`  
**Requirement:** D-10  
**Date:** 2026-07-21  
**IDs (public client-side):** GA4 `G-G1KZQCKP5D` · Google Ads `AW-16711221644` · signup conversion label `-B6_CK72wtMcEIyDxKA-`

---

## Account / campaign layout

| Level | Recommendation |
|-------|----------------|
| Account | Existing (or new) Google Ads account linked to GA4 property for `aipbx.net` |
| Campaign | **1× Search — EN** (name e.g. `EN \| Search \| AI PBX`) |
| Networks | Search partners: off initially; Display: off |
| Geo | Founder input (start: US/UK/EU English markets OR exclude RU if RU is Direct-only) |
| Language | English |
| Bidding | Founder input — placeholder: Maximize conversions → then tCPA once volume exists |
| Budget | Founder input — placeholder daily/cap |
| Optional later | Performance Max (after Search learns conversions); remarketing RLSA |

Do **not** launch until plan **09-07** prerender verify passes — Ads quality bots must receive rendered LP HTML (title, H1, meta), not an empty SPA shell.

---

## Ad groups (intent → landing)

### Ad group 1 — AI Voice Assistant

- **Final URL:** `https://aipbx.net/voice-assistants`
- **Intent:** Buyers searching for AI phone agents / automated answering / AI receptionist.

**Keyword cluster (phrase + exact preferred; broad sparingly):**

| Match | Keyword |
|-------|---------|
| Exact | [ai voice assistant] |
| Exact | [ai phone agent] |
| Exact | [ai receptionist] |
| Phrase | "automated phone answering ai" |
| Phrase | "ai phone answering service" |
| Phrase | "ai voice agent for business" |
| Phrase | "virtual receptionist ai" |

---

### Ad group 2 — Asterisk / SIP voice bot

- **Final URL:** `https://aipbx.net/voice-assistants`
- **Intent:** Integrators and IT buyers with Asterisk/SIP/WebRTC stack.

**Keyword cluster:**

| Match | Keyword |
|-------|---------|
| Exact | [asterisk ai voice bot] |
| Exact | [sip ai agent] |
| Phrase | "asterisk voice bot" |
| Phrase | "sip voice assistant" |
| Phrase | "webrtc voice assistant" |
| Phrase | "ai bot for asterisk" |
| Phrase | "pbx ai voice agent" |

---

### Ad group 3 — Speech Analytics

- **Final URL:** `https://aipbx.net/speech-analytics`
- **Intent:** Call-center / sales leaders wanting recording analysis / speech AI.

**Keyword cluster:**

| Match | Keyword |
|-------|---------|
| Exact | [speech analytics software] |
| Exact | [call center speech analytics] |
| Phrase | "call recording analysis ai" |
| Phrase | "speech analytics for call center" |
| Phrase | "ai call analytics" |
| Phrase | "conversation analytics software" |

---

### Ad group 4 — Call QA / operator scoring

- **Final URL:** `https://aipbx.net/speech-analytics`
- **Intent:** QA managers scoring agents / conversation intelligence.

**Keyword cluster:**

| Match | Keyword |
|-------|---------|
| Exact | [call center qa software] |
| Exact | [agent call scoring] |
| Exact | [conversation intelligence] |
| Phrase | "call quality monitoring software" |
| Phrase | "operator call scoring" |
| Phrase | "ai agent coaching call center" |

---

## RSAs (Responsive Search Ads)

Character limits: headlines ≤30, descriptions ≤90. Pin headline 1 to brand only if QS stays healthy; otherwise leave unpinned.

### Ad group 1 — AI Voice Assistant RSA

**Headlines (15):**

1. aiPBX Voice Assistant  
2. AI Phone Agent for Business  
3. Automate Phone Answering  
4. AI Receptionist, 24/7  
5. Answer Calls with AI  
6. Voice AI for Call Centers  
7. Start Free — aiPBX  
8. Book a Demo Today  
9. SIP-Ready AI Agent  
10. Replace Missed Calls  
11. Cloud AI Voice Bot  
12. Deploy in Minutes  
13. AI That Talks Like Staff  
14. Scale Without Hiring  
15. Try aiPBX Free  

**Descriptions (4+):**

1. Deploy an AI voice assistant that answers, routes, and qualifies callers around the clock.  
2. Connect via SIP or WebRTC — automate front-desk and support without replacing your PBX.  
3. Start free, configure your agent, and take your first AI call in minutes on aipbx.net.  
4. Built for SMB and call centers that need reliable phone automation with real telephony.  
5. Book a demo to see AI answering, CRM hooks, and analytics in one cloud PBX stack.  

---

### Ad group 2 — Asterisk / SIP RSA

**Headlines (12):**

1. Asterisk AI Voice Bot  
2. SIP AI Agent — aiPBX  
3. WebRTC Voice Assistant  
4. AI Bot for Your PBX  
5. Asterisk-Ready AI  
6. SIP Trunk Compatible  
7. Voice AI Integrators  
8. Start Free on aiPBX  
9. Book a Demo  
10. Keep Your Asterisk  
11. Add AI to SIP Stack  
12. API & Webhooks Ready  

**Descriptions (4):**

1. Add an AI voice bot to Asterisk or SIP without ripping out your existing telephony.  
2. WebRTC playground plus production SIP — build, test, and go live on one platform.  
3. Integrator-friendly: APIs, webhooks, and cloud AI PBX built for real phone systems.  
4. Start free and connect your trunk — AI handles the conversation layer on aiPBX.  

---

### Ad group 3 — Speech Analytics RSA

**Headlines (12):**

1. Speech Analytics Software  
2. AI Call Recording Analysis  
3. Call Center Speech AI  
4. Analyze Every Call  
5. Custom QA Metrics  
6. Speech Insights Fast  
7. Start Free — aiPBX  
8. Book a Demo  
9. Operator Analytics  
10. Turn Audio into Scores  
11. LLM Call Analysis  
12. No Data Science Team  

**Descriptions (4):**

1. Speech analytics for call centers — STT plus LLM scoring on your recordings and metrics.  
2. Build custom QA metrics without a data science team; review insights in the dashboard.  
3. Pair speech analytics with AI voice assistants on one cloud platform — aipbx.net.  
4. Start free or book a demo to see call analysis and coaching workflows in action.  

---

### Ad group 4 — Call QA / scoring RSA

**Headlines (12):**

1. Call Center QA Software  
2. Agent Call Scoring AI  
3. Conversation Intelligence  
4. Automate Call QA  
5. Score Every Operator  
6. Coach From Real Calls  
7. Start Free — aiPBX  
8. Book a Demo Today  
9. QA Without Sampling  
10. Custom Scoring Rubrics  
11. Reduce QA Headcount Load  
12. AI Call Quality Monitor  

**Descriptions (4):**

1. Automate agent call scoring with AI — consistent QA across every recording, not samples.  
2. Conversation intelligence for sales and support teams that need coaching at scale.  
3. Define your own rubrics and metrics; aiPBX scores calls and surfaces coaching gaps.  
4. Start free on aipbx.net or book a demo for call QA and speech analytics together.  

---

## Extensions

### Sitelinks

| Sitelink text | Description line 1 | Description line 2 | URL |
|---------------|--------------------|--------------------|-----|
| Pricing | Transparent plans | Cloud AI PBX | `https://aipbx.net/pricing` |
| Voice Assistants | AI phone agents | SIP & WebRTC ready | `https://aipbx.net/voice-assistants` |
| Speech Analytics | Call QA & insights | Custom metrics | `https://aipbx.net/speech-analytics` |
| Docs | Setup guides | API & product help | `https://aipbx.net/docs` |

### Callouts

- SIP / Asterisk ready  
- API & webhooks  
- 24/7 call automation  
- Custom QA metrics  
- Start free  
- Cloud AI PBX  

### Structured snippet

- **Header:** Types  
- **Values:** Voice assistants, Speech analytics, Call QA, SIP bots, WebRTC playground  

---

## Negative keywords (shared list)

Apply at campaign level (phrase/exact as noted):

| Negative | Why |
|----------|-----|
| free (broad/phrase carefully — keep “start free” in ads, negate job-seeker “free download” via exacts below) | Tire-kickers / software pirates |
| [free download] | Non-buyers |
| jobs | Employment seekers |
| salary | Careers |
| hiring | Careers |
| tutorial | Learners not buyers |
| course | Education |
| open source | OSS shoppers |
| github | DIY / OSS |
| resume | Careers |
| meaning | Definitional queries |
| wikipedia | Informational |
| what is | Ultra-top-funnel (optional — test) |
| phantom | Brand confusion (Phantom Bot etc.) |
| ivr script only | Misaligned DIY |

Add competitor brand negatives only if trademark policy and strategy require it (founder decision).

---

## Conversion mapping

| Priority | Event / action | Where it fires (product) | Google Ads setup |
|----------|----------------|--------------------------|------------------|
| **Primary** | `signup_complete` | Signup success paths (D-06/D-07) | Ads conversion with label **`-B6_CK72wtMcEIyDxKA-`** on `AW-16711221644` (`fireAdsConversion` / gtag `conversion`) |
| Secondary (observation) | `assistant_created` | First assistant create success | Import from GA4 or create Ads action — observe, do not optimize yet |
| Secondary (observation) | `first_call` | Playground / first CDR | Import from GA4 — observation |
| Secondary (observation) | `payment_success` | Payment return/success (founder-approved surface in 09-05) | Import from GA4 — observation; promote later if volume allows |

**Optimize the Search campaign to primary `signup_complete` only** until ≥30–50 conversions/month, then consider tCPA or adding value rules.

GA4 property should receive the same events for funnel diagnosis; Ads uses the tagged conversion for bidding.

---

## Landing / Quality Score note

- Publication **depends on prerender deliverable 09-07**. Without bot-visible HTML, expected CTR/QS collapse and policy/quality flags are likely.  
- Match ad copy keywords to prerendered **`<h1>`** and meta title/description on `/voice-assistants` and `/speech-analytics` (plans 09-02 / 09-04).  
- Prefer one primary CTA per LP (Start free / Book demo) consistent with RSA CTAs (D-08).  
- After launch: check landing experience in Ads → check URL against crawled title; fix copy drift in i18n, not in the ad alone.

---

## Budget & bidding (founder placeholders)

| Field | Value |
|-------|--------|
| Daily budget | `[FOUNDER: $___ / day]` |
| Bidding strategy | `[FOUNDER: Maximize conversions | tCPA $___]` |
| Start date | After 09-07 prerender verify + GSC property live |
| Owner | Founder (live campaign management outside codebase) |

---

## Launch checklist (founder)

1. Confirm production env has `GA4_MEASUREMENT_ID`, `GOOGLE_ADS_ID`, `ADS_SIGNUP_LABEL`.  
2. Confirm prerender verify PASS for Ads landing URLs.  
3. Create campaign + 4 ad groups from this draft.  
4. Import/verify `signup_complete` conversion with label `-B6_CK72wtMcEIyDxKA-`.  
5. Attach negatives + extensions.  
6. Soft launch low budget → watch Search terms → expand exacts / carve new ad groups.  
7. EEA traffic: resolve Consent Mode v2 per `09-SEO-AUDIT.md` before scaling personalized Ads.
