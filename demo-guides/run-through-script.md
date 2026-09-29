# Run-Through Script: One Hour With Fraud Analysts, Data Scientists and Architects

The presenter's script for the fraud detection POC, in the order the demo runs, with what to say at every step, the detail underneath it, and what the room should leave with. It matches the build on the live site at <https://grahamcrooks.github.io/FraudPOC/> as of 27 September 2026: the five ChatGPT image slides, pre-flight with the claim data extracted first and then seven checks, with the What's happening card, and CLM-0842 as a doctored receipt.

Use it for the in-depth run-through, for Tuesday's full rehearsal on the presenting laptop and projector, and on Wednesday 30 September. [`demo-script.md`](demo-script.md) is the companion for system testing: it has the complete check-by-check test cases. This script is for presenting.

Each step has up to five parts:

- **On screen**: what the audience is looking at.
- **Do**: what you press or click.
- **Say**: the words, in your voice. Adapt them; don't read them.
- **Under the hood**: the technical detail, for when someone asks. The rules, checks and decisions are the ones built in Pega; anything planned rather than built is marked as planned. The data on screen is synthetic: made-up claims, receipts and members.
- **The room**: what each group is listening for, and what they're likely to ask. FA is the fraud analysts, DS the data scientists, AR the architects.

## What the hour is for

### The one message

Fraud is cheaper to stop before a claim is paid than to recover after it. This POC shows how, one layer at a time, with every decision explainable and a person making every call that matters.

### What each group should leave with

| Group | They should leave believing | Where it lands |
| --- | --- | --- |
| Fraud analysts | This takes work off their queue, not onto it. Unclaimable documents never reach them, and what does reach them arrives with the evidence assembled. | Pre-flight rejections (CLM-0847, CLM-0848), the device ring (CLM-0844), the investigation screen |
| Data scientists | The AI claims are testable and bounded, the score is arithmetic they can check, and the limits are stated before they find them. | The models moment, the pre-flight card and rows, the Phase 1 score, the questions |
| Architects | They know what's real and what's drawn, where AI is used, where each check runs, and which two decisions are theirs to make. | Slide 3's four questions, the models moment, the What's happening card, the questions |

### What you'd like from the room

There's no ask on Wednesday. The opening promises none, and the close keeps that promise.

- **Their view**: what it doesn't catch that it should. It's deliberately narrow: three things that work rather than nine that might.
- **The PAID stamp**: whether treating a stamped receipt as unclaimable holds depends on what their provider network actually stamps, and when. They know that; you don't.
- **Not this meeting**: sizing against real claims is a separate conversation. Don't drag it in; if someone's interested, they can find you afterwards.

### Principles to repeat

1. **Simple checks first.** Instant, deterministic rules run before anything else, so every early decision can be explained in one line and investigators only see claims that deserve them. AI is used in three places only: one read in pre-flight, three image checks in Phase 1 and the graph query in Phase 3. Everything else is business rules, a decision table and five real-time event strategies.
2. **AI assists, people decide.** Every signal goes to a named investigator in Pega AIM with the evidence attached. Nothing is decided for them.
3. **Every check shows its working.** What it looked at, the rule and what it found, on screen. That's the audit trail.
4. **Document, then pattern, then network.** Phase 1: is this individual receipt suspicious? Phase 2: is there an emerging pattern across claims over time? Phase 3: are there wider relationships connecting members, providers, devices or claims?
5. **Simulated, and labelled as such.** Every scene is marked Simulated. Names, numbers and addresses are fictional. Where something is planned rather than built, say so.

## Decisions to hold the line on

These came up in preparation. Have the answers ready and don't soften them on the day.

| Topic | Position |
| --- | --- |
| The PAID stamp (CLM-0848) | "Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception." Then ask the room how their provider network uses the stamp. Asking is stronger than softening the rule. |
| Claim value | Context for later checks, not a fraud signal. It's recorded at $5,000 or above and never routes a claim on its own. Nothing in the demo shows claim value causing an outcome. |
| The doctored total (CLM-0842) | A total that doesn't reconcile to its line items fails pre-flight but isn't rejected: the question is how it was altered, so the claim goes on to forensics. |
| Figures on the slides | The claims analytics panel on slides 2 and 3 ($270K, +42%, the chart and risk categories) and the impact row on slide 5 (−65%, +40%, +28%) are illustrative, not Bupa data and not measured results. Say so if asked, before anyone else does. |
| "Phase" means two things | Slide 4's image shows the delivery path (detection POC, workflow and review, prevention at scale). In the demo, Phase 1, 2 and 3 are three of the four questions you speak to on slide 3. Use the bridge line on slide 4. |
| Pre-flight rejections aren't fraud | CLM-0847 and CLM-0848 end in Reject Document, not in the fraud team's queue, and they don't appear in the report. That's correct. |
| Weights and thresholds | Expert judgement, to be calibrated on the replay. The integrity score is a rule-based score, not a probability. Never call it one. |

## Before you start

### Set-up

1. Open <https://grahamcrooks.github.io/FraudPOC/> and hard-refresh: Ctrl+Shift+R, or Cmd+Shift+R on a Mac. You should see the ChatGPT image slides (slide 3's button reads "Business Case") and, in the demo, the What's happening card during pre-flight.
2. Press F for fullscreen. Stay in Presenting mode (the default).
3. Captions are on. Press C if they compete with you.
4. Have the rehearsal page open in another tab for the architecture diagram, in case the architects ask: <https://claude.ai/artifact/UDXWJFLAadiKKFnwEZR3KS>. Some of its scenario notes predate the current build; this script supersedes them.
5. Check the projector resolution. The slides fit any screen; the demo is designed for 1366 × 768 and up.

### Controls

| Key | Action |
| --- | --- |
| → / ← | Next / previous slide. Space also moves to the next slide, so don't press it by accident on the slides |
| D / S | Demo / Slides |
| 1 to 8 | Open CLM-0841 to CLM-0848 |
| Space | In the sign-in scene: pause, and Space again to resume (a purple "Paused" pill shows). Elsewhere in the demo it does nothing |
| Esc | Skip the sign-in scene to its end |
| L | Replay the sign-in scene |
| P | Step-by-step: pauses after every phase result until you click Continue |
| C | Captions on or off |
| B | Backup slide ("three hops") |
| 0 | Emergency reset: slide 1, claim form cleared. Then 1 to 8 to reopen a scenario |

### How pausing works

- **Sign-in scene**: Space pauses it where it is.
- **Pre-flight**: can't be paused, but it's slow on purpose: 40 seconds, the fields filling first and then seven checks of about 4 seconds each. Talk over it. Once it finishes, click any check to bring its explanation back.
- **The pipeline**: it waits for you. It only moves on when you click Receipt Forensics or Continue. A phase's few seconds of animation can't be paused.
- **Close the investigation screen with its ✕.** Escape doesn't close it.

### Budget for interruptions

This room asks during the demo, not after. Answer briefly and park anything long for the questions at 42:00.

- **5 minutes behind at 25:00**: skip CLM-0847 and run CLM-0848 only. It carries both points: simple checks first, and the PAID question for the room.
- **Still behind at 37:00**: open the investigation screen and skip the report.
- **Never cut** the models moment or the questions. They're what this room came for.

## Timing at a glance

| Time | Section | On screen |
| --- | --- | --- |
| 00:00–03:00 | Open: set the contract | Slide 1 |
| 03:00–08:00 | The problem: three kinds of fraud | Slide 2 |
| 08:00–10:00 | How the pieces fit together, and the models moment | Slides 3 to 5 |
| 10:00–25:00 | CLM-0841, a clean claim, end to end | Sign-in, portal, pre-flight, Phases 1 to 3, outcome |
| 25:00–29:00 | CLM-0847 and CLM-0848: stopped in pre-flight | Reject panels |
| 29:00–33:00 | CLM-0842: a doctored receipt | Pre-flight fail, then Phase 1 forensics |
| 33:00–37:00 | CLM-0844: a device ring | Laptop sign-in, Phase 2 |
| 37:00–40:00 | CLM-0845: a shared practitioner | Phase 3 |
| 40:00–42:00 | What the investigator gets | Investigation screen, report |
| 42:00–55:00 | Questions | |
| 55:00–60:00 | Close: what I'd like from you | |

## 00:00–03:00 · Open: set the contract

**On screen**: Slide 1, Agenda.

**Say**: I'm not going to tell you about fraud. You know considerably more about it than I do, and I've spent the last few months being told so by your own team. That's the reason any of this exists.

*Pause. Let that sit.*

**Say**: What I've built is the thing they said they couldn't see. Not the altered receipt: you catch those. The five claims that each look perfect on their own.

So here's the contract for the next hour. I'll show you what it does, I'll tell you where it's deliberately incomplete, and I'm not asking you for anything at the end. If you walk out understanding the shape of it well enough to tell me where I'm wrong, that's the outcome I want.

**Say**: One thing before I start. Everything you'll see runs. It's not a mock-up. The receipts are synthetic, the claims are made up, and the member data is invented, but the rules, checks and decisions are the ones built in Pega. Where something is simulated, it says so on screen.

**Optional**: If the room is small and informal, this replaces the first three paragraphs:

**Say**: Everything I'm about to show you came out of conversations with your fraud team, so if it looks familiar, that's why. The part I'd like your view on is the last third, where no single claim looks wrong.

**The room**:

- **FA**: listening for whether this adds to their queue or takes work off it. "You know considerably more about it than I do" is for them.
- **DS**: listening for "AI" claims they can test. "Where it's deliberately incomplete" earns their trust early.
- **AR**: listening for what's real and what's drawn. "Everything you'll see runs" is the line they'll test.

## 03:00–08:00 · The problem: three kinds of fraud

### Slide 2: Problem (5 minutes)

**On screen**: The image slide "Problem: why prevention, not just recovery": a claim form under a magnifying glass, a claims analytics panel, and four cards: hidden anomalies in routine claims, manual review is reactive and slow, leakage compounds before recovery, members and providers need protection.

**Note**: Your words carry the argument here; the image is the backdrop. Don't read its cards. The three tiers below are the story.

**Say**: Three kinds of fraud, and they don't get caught the same way.

The member. An altered receipt. A claim put in twice. A quote submitted as an invoice. Small, frequent, and the evidence is sitting on the document.

The provider. Services billed that were never delivered. Item codes that don't match what happened in the chair. Every individual claim is plausible; the pattern only shows across that provider's whole book.

The network. Members and providers working together. Recruited members, shared devices, one bank account collecting from several practices. Every claim genuine. Every member real. No single claim looks wrong, because none of them is.

*Pause on the third.*

**Say**: Detection gets harder as the money gets bigger. That's the uncomfortable part. The tier you can catch cheapest is the tier that costs you least.

**Say**: I want to be straight about something. The first tier is largely solved: you've got controls for it, and a model will do it better than a rule will. The second is hard but tractable. It's the third one your team told me they can't see, and that's where I've spent the effort.

**Under the hood**: The analytics panel's figures ($270K, +42%) are illustrative, not Bupa data. If someone wants a real number: an estimated 1 to 3% of claims contain fraud, waste or abuse, against a global range of 3 to 10% (PKF Littlejohn / Centre for Counter Fraud Studies).

**The room**:

- **FA**: the provider row is their daily work. The demo doesn't cover provider billing patterns yet (item code validation is planned), so don't let the slide promise it.
- **DS**: "a model will do it better than a rule will" is the line they'll remember. It sets up the models moment at 10:00.

## 08:00–10:00 · How the pieces fit together

### Slide 3: Business Case, spoken as four questions (about 1 minute)

**On screen**: The image slide "Business Case: the value of earlier detection": a claims analytics panel ($270K total claims, +42% suspicious items, a monthly chart, top risk categories) beside four outcome cards: reduce improper payments, prioritise high-risk claims, improve operational efficiency, protect member trust.

**Note**: The slide shows the outcomes; your words give the design. Speak the four questions over it, counting them on your fingers if it helps the room hold them. The panel's figures are illustrative: if anyone points at them, say so.

**Say**: Four questions, asked in order, simplest first.

One. Is this claimable at all? Business rules on the extracted receipt. A quotation, a gym membership, a receipt already stamped paid. Included in Pega Platform.

Two. Is this receipt genuine? Forensic analysis: fonts, overlays, metadata, authoring trail. That's deeper analysis, so it only runs on receipts that clear question one.

Three. Does this claim fit the broader pattern? Real-time event strategies look for patterns across the claims stream over time, using windows, aggregations and thresholds. Nothing to do with the document.

Four. Who else is involved? Graph traversal from an entity we've already flagged.

**Say**: A claim that fails question one never reaches question two. That ordering is the design, not an optimisation. There's no sense running forensics on a treatment plan quotation: a rule can say why it's rejected in one line, instantly.

**Under the hood**: The four questions are the demo's four stages: one is pre-flight, two is Phase 1 receipt forensics, three is Phase 2 cross-claim signals, four is Phase 3 network intelligence. AI is used in three places only: one read in pre-flight, three image checks in Phase 1 and the graph query in Phase 3.

**The room**:

- **AR**: this is the slide they'll map everything back to.
- **DS**: question 04 is the widest search, across everything the claim touches, which is why it runs last.

### Slides 4 and 5: click through (about 30 seconds each)

**On screen**: Slide 4, "Three Phases": the delivery path, Detection POC, Workflow & Review, Prevention at Scale. Slide 5, "Why Pega?".

**Say**, on slide 4: That's the delivery path, and we're at the first step. Inside it, every claim is asked those four questions. In the demo the first is pre-flight, and the other three are Phase 1, 2 and 3: the document, then the pattern, then the network.

**Say**, on slide 5: It's built on Pega because the rules, the investigation workflow and the audit trail sit in one governed platform. And it gives us real-time event intelligence: we detect emerging fraud patterns as claims occur, rather than relying only on retrospective audits.

**Under the hood**: Slide 4's phases are delivery stages, not the demo's Phase 1, 2 and 3; the bridge line keeps them apart. Slide 5's impact row (−65%, +40%, +28%) is illustrative, not measured. Don't quote it.

### The models moment (before you launch the demo)

Don't wait to be asked. Land it here, at the end of how the pieces fit, then press → to launch the demo.

**Say**: Someone's going to ask why rules, when you've got models. Fair question, and here's my honest answer.

A model scores a claim. How suspicious is this one, given everything we've seen before. It's better at that than any rule I could write.

An event strategy asks a different question entirely: have three unrelated members now lodged from this device in the last seventy-two hours. That's not a prediction. It's a count, over a window, across claims your model never sees together, because each of those five claims scores perfectly clean on its own.

So these don't compete. Every signal here is a feature your models can't calculate at scoring time. Distinct members on a device. Distinct practices paying into one account. Distance from the registered address. Hand those to your data scientists and their models get better.

**Say**: And the limit, before you find it yourselves: this only catches what somebody defined. Patterns nobody has thought of: that's what a model is for. The two belong together.

**The room**:

- **DS**: this is their moment. Expect "so where does the model go?" Answer: alongside, fed by these signals as features. Park the detail for questions.
- **AR**: if they want the full picture of how the pieces connect, the architecture diagram is on the rehearsal page (<https://claude.ai/artifact/UDXWJFLAadiKKFnwEZR3KS>). Keep it for questions rather than spending the two minutes on it.

**Priority**: The models moment is the last thing to cut. It only works pre-empted: once someone asks it out loud, the same answer is a defence rather than evidence you'd already thought about it. Slides 4 and 5 are each recoverable in one sentence. That moment isn't.

## Scenario quick reference

Pick the scenarios for the room. Press the key to jump straight to one. The last column shows where each sits in this hour; the two marked alternative are ready if the room asks.

| Key | Claim | Member | The point it makes | Where it stops | Outcome | Time | In this hour |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | CLM-0841 | James Kowalski | The clean baseline: every step, explained | Runs all three phases | Clean, sent for adjudication | 15 min | 10:00 |
| 2 | CLM-0842 | Sarah Nguyen | A doctored receipt: the arithmetic says something is wrong, forensics shows how | Pre-flight reconciliation fails, then Phase 1 | Doctored total, score 0.28, investigator queue, HIGH | 4 min | 29:00 |
| 3 | CLM-0843 | David Okafor | Follow the money: four practices paying into one bank account | Phase 2, ES-003 | Bank account ring, SIU queue, HIGH | About 3 min | Alternative to CLM-0844 |
| 4 | CLM-0844 | Linda Pham | A device ring no single claim can show | Phase 2, ES-002 | Device ring, SIU queue, HIGH | 4 min | 33:00 |
| 5 | CLM-0845 | Michael Torres | The risk is in who delivered the service; then the investigation screen | Phase 3, graph and similarity | Two weak signals, investigator queue, standard priority, investigation screen | 3 min, plus 2 for the investigation screen | 37:00 |
| 6 | CLM-0846 | Angela Wu | An organised ring, three hops away | Phase 3, graph | Fraud ring Community #47, SIU queue, HIGH | About 3 min | Alternative to CLM-0845 |
| 7 | CLM-0847 | Priya Raman | Not claimable: stopped before any forensics | Pre-flight | Quotation rejected, no pipeline | 2 min | 25:00 |
| 8 | CLM-0848 | Oliver Hartmann | A genuine receipt that still isn't claimable, and the PAID question for the room | Pre-flight | Genuine receipt stamped PAID, rejected, no pipeline | 2 min | 27:00 |

Short on time? CLM-0841, one pre-flight stop (7 or 8), and one scenario from each later phase (2, 4 and 5) cover every layer.

### The technology behind the checks

**Pega event strategies (Phase 2).** An event strategy is a Pega rule that watches a live stream of events, here claims and sign-ins as they arrive, rather than looking at one claim on its own. It is built from configured parts: filters, time windows (for example the last 72 hours, 30 days or 90 days), aggregations such as counting distinct members on one device, joins to reference data, and thresholds. When a pattern crosses its threshold, the strategy emits a signal that the case acts on, and the alert attaches to the entity (the device, the account), so it reaches claims already assessed. In this POC five run: ES-001 distance from home, ES-002 device ring, ES-003 bank account ring, ES-004 phantom ABN and ES-005 waiver abuse; ES-006 and ES-007 are planned. They are configured, not coded, which is why a new pattern the fraud team spots can become a live strategy in days.

**Pega GenAI Knowledge Buddy and RAG (Phase 3, fraud case similarity).** Knowledge Buddy is Pega's retrieval-augmented generation (RAG) capability: content is indexed so it can be searched by meaning rather than keywords, the passages that best match a question are retrieved, and the model answers only from those passages, citing them. Here the content is the fund's library of closed investigation write-ups, ingested when an investigator publishes a case and seeded from existing closed investigations on day one. The check describes the claim's shape in words (services, billing pattern, practitioner and practice relationships) and asks for comparable confirmed cases. It returns the cases it found, cited by reference, never a score, and a similarity result never routes a claim on its own; it adds weight to other signals, as in CLM-0845.

**Graph database (Phase 3, network graph).** A graph database stores members, practices, practitioners, devices, IP addresses, addresses and payment accounts as nodes, and the links between them (uses device, paid into account, works at practice, shares a phone or email) as relationships. That makes "is anything within three hops of a known fraud entity?" a single path query rather than a chain of table joins, and it returns the path itself, so the investigator sees exactly how the claim connects. Graph analytics such as community detection are how a confirmed ring like Community #47 is identified. In this design the Pega agent queries the graph through an MCP server, and the product is still to be chosen. Confirmed outcomes from AIM feed back into the graph, so a new ring becomes visible to the next claim that touches it.

## 10:00–25:00 · CLM-0841: a clean claim, end to end

Take your time here. Every later scenario reuses these steps, so this is where the technical questions land.

**Do**: Press → on slide 5 to Launch Demo, or press 1. The sign-in scene starts.

### Sign-in: three signals before any claim exists (about 2½ minutes)

**On screen**: A phone, labelled Simulated. James Kowalski signs in to the H+ app with Face ID, "Verified", "Welcome back, James." Three boxes rise one at a time:

- **Device**: DEV-2291 · H+ App v4.2 (iOS)
- **Location**: Carlton VIC · 203.0.113.18
- **Session**: 12 Jul 2026, 09:14 AEST

The phone shrinks into the header, and the boxes land in the session chip: 📱 DEV-2291 ✓ recognised device · 📍 Carlton VIC · 🕒 09:14 AEST.

**Do**: Press Space to hold the scene when the three boxes are up, talk, then Space again to let it finish.

**Say**: Before there's a claim, there's a session. James signs in with Face ID, and three signals are captured right there: the device, the location from the IP address, and the time. None of them is judged yet. They travel with the claim, and Phase 2 is the first thing that reads them. Note what we don't collect: no browsing history, no contacts, no background location.

**Under the hood**:

- The platform records the device fingerprint, the submission IP and its geolocation, and the session time.
- In Pega they're stored on the Claim as two embedded data objects: `GeoSession` (`SubmissionIPAddress`, `IPGeoLatitude` / `IPGeoLongitude`, VPN and hosting-range flags) and `DeviceSession` (`DeviceFingerprintID`, device type, app version, fingerprint method).
- ES-001 uses the geolocation; ES-002 counts members per `DeviceFingerprintID`.
- The device is marked recognised (used by this member before) or new. A new device is a signal in its own right.

**The room**:

- **AR**: will ask on what basis the device and location are captured. Answer: the consent and privacy basis needs a formal privacy review before production.

### The claim portal (about ½ minute)

**On screen**: The H+ member portal. James's policy (POL-2021-44210, Gold Hospital + Extras), claims this year, benefit remaining and member details (MBR-33291, Carlton VIC 3053) on the left. The claim card has numbered panels in the order things happen: 1 · Data extracted from the receipt, and 2 · Pre-flight checks once a receipt is loaded.

**Say**: James is now in the member portal. Notice the second panel: every field in it will be filled from the receipt. The member only uploads a receipt. They type nothing.

**Under the hood**: The portal is the member's view of the Claim case. Member data comes from the Member record. ES-001 needs the member's registered address as coordinates (`RegisteredAddressLatitude` / `RegisteredAddressLongitude`).

### Pre-flight: is this a claimable receipt at all? (about 5 minutes)

**Do**: Click Load Receipt. Panel 1 first: the sign-in capture, then the claim fields fill in one after another from a single AI read (about 13 seconds). Nothing is judged there. Then panel 2's seven checks run, about 4 seconds each, 40 seconds in all. The What's happening card at the top of the left column explains each one as it runs.

**Say, as it starts**: James uploads a dental receipt. Before any forensics, pre-flight asks one question: is this a claimable receipt at all? AI reads the receipt once. Then business rules included in Pega Platform do the rest. A quotation, a proforma, an unpaid invoice or a receipt that doesn't add up is caught here. Watch the card on the left: it says in plain words what each check is doing and why.

Talk to each check as the card changes. The table gives what the row shows for James, what to say, and the detail underneath.

| # | Check | On screen for James | Say | Under the hood |
| --- | --- | --- | --- | --- |
| Panel 1 | Device and location | DEV-2291 · Carlton VIC · captured at sign-in | The device, location and time from sign-in are attached. Nothing is judged here. | Capture, no verdict. Used by ES-001 distance and ES-002 device ring in Phase 2. |
| Panel 1 | The fields fill | Claim type, service date, provider, ABN, amount, item codes, one after another | One AI read turns the receipt into a claim. The member types nothing, and nothing is judged yet. The checks wait until every field is in. | One vision model call returns eleven fields, each with its own confidence score, and says what kind of document it is. |
| 1 | Field extraction | 11 of 11 fields · $312.00 · items 011, 022, 114 · Pass | All eleven details a claim needs came back from that read. | Every later check works from these fields. |
| 2 | Extraction confidence | Lowest 0.92 (ServiceDate) · threshold 0.70 · Pass | Is the extraction usable at all? Any critical field under 0.70 goes to a person rather than being guessed, so this check comes second: it gates the rest. | Per-field confidence from the same model call. Below 0.70 routes to Needs Review. |
| 3 | Receipt type | TAX INVOICE · ABN and AHPRA present · Pass | Is this the right kind of document? Only a genuine tax invoice from a health provider can be claimed. | From the same model call: it must be a tax invoice from a registered health provider. |
| 4 | Disqualifying content | 11 terms checked · none found · Pass | Is it claimable? A rule scans for eleven terms the fraud team maintains: quotation, proforma, non-medical, a PAID stamp. | Data transform `SetKeywordMatchResults`, included in Pega Platform. Matches on the phrase or word boundary, not the substring. |
| 5 | Receipt completeness | $312.00 received of $312.00 · ABN ✓ · 3 lines · signed · Pass | Complete, and paid by the member: the amount received against the amount charged, an ABN, itemised services, a signature. | Data transform `SetMarkerFlagResults`, included in Pega Platform. |
| 6 | Line item reconciliation | Items reconcile to the total (items sum to $312.00 · stated total $312.00) · Pass | Right after completeness, on the same fields: do the line items add up to the total printed? Whoever edits a receipt usually changes the total and leaves the breakdown alone. Hold that thought. | Data transform, included in Pega Platform. Line items must sum to the total charged. |
| 7 | Claim value | $312.00 claimable · marker at $5,000 · Pass | How much is at stake. It's context for later, not a fraud signal, and it never routes a claim on its own. | `SetHighValueFlag`. `"routes": false`: its verdict never decides the route. |

**On screen when it finishes**: Green: "Receipt pre-validated — passing to forensic authentication" and "7 of 7 checks passed · 3 AI calls · 4 business rules · 1 capture recorded". The capture and all seven checks open, each showing what it looked at, the rule and what it found. "Receipt Forensics →" appears.

**Say, at rest**: Every check shows what it looked at, the rule and what it found. That's the audit trail, on screen. The Valid Claim decision table takes the first matching row. Nothing matched, so the claim goes on. (Click any check to bring its explanation back to the card if someone asks about it.)

**Under the hood**:

- Routing: any fail goes to Reject Document (Resolved-Rejected). Any flag goes to Needs Review (Pending-Review). All passes open the pipeline.
- Two exceptions. Claim value never routes. Line item reconciliation, on a fail, sends the claim on to forensics instead of rejecting it; you'll see that with CLM-0842.
- AI so far: one read. The three "AI call" badges are three results from the same read.

**The room**:

- **DS**: will ask how 0.70 was set. Answer: a starting point, to be calibrated. Park the detail for questions.
- **FA**: will like that the term list is theirs to own.
- **AR**: will ask where the vision model runs. It's one of the two open choices; take it as an action, don't guess.

### Phase 1: is the receipt genuine? (about 3 minutes)

**Do**: Click Receipt Forensics →. The pipeline opens. Five checks run about 2.8 seconds apart.

**On screen**:

| Check | Type | James |
| --- | --- | --- |
| Font consistency | AI call | 1 typeface, Arial 9pt throughout · Pass |
| Colour and stamp analysis | AI call | No overlay regions, uniform compression · Pass |
| AI-generated detection | AI call | Score 0.02, threshold 0.15 · Pass |
| Metadata and provenance | Business rule | Clinic practice software, created on the service date · Pass |
| Duplicate detection | Business rule | 0 prior submissions of this fingerprint · Pass |

Then the Receipt integrity score: every check at −0.00, total 1.00, "Threshold 0.70 — No adverse findings", and "Phase 1 Passed — No Adverse Findings".

**Say**: The receipt is claimable. Now: is it genuine? Five forensic checks look for spliced text, pasted overlays, AI-generated images, a suspicious authoring trail and duplicates. Three are AI calls on the image; two are rules. The score starts at 1.00 and only adverse findings take points off, and you can check the arithmetic line by line. James has none. But a genuine receipt isn't a clean claim.

**Under the hood**:

- Font consistency: text edited into a genuine receipt rarely matches the original typeface.
- Colour and stamp analysis: finds figures or stamps pasted onto a genuine scan.
- AI-generated detection: scores the image against image-generator signatures, for receipts that were never printed.
- Metadata and provenance: the authoring trail travels inside the file. Practice software, and timestamps not after the service.
- Duplicate detection: the same practice and receipt number, or an identical fingerprint, on any earlier submission.
- Below 0.70 goes to the investigator queue, HIGH priority, 4-hour SLA. The total is computed from the lines above it, never typed in.
- Extraction confidence isn't scored here: a low-confidence field is already routed in pre-flight.

**Do**: Click Continue to Phase 2 — Cross-Claim Signals →.

### Phase 2: does this claim fit a pattern across other claims? (about 2 minutes)

**On screen**: The phase header reads "Cross-claim pattern detection. Does this claim fit the broader pattern? 5 real-time event strategies running, 2 planned, more configurable." Five checks, 6 seconds apart, each badged "Real-time event strategy — included in Pega Platform":

- ES-001 Distance anomaly: 0.4 km from the registered address, threshold 500 km · Pass
- ES-002 Device ring: 1 member on this device, threshold 3 · Pass
- ES-003 Bank account ring: 1 practice on this account, threshold 3 · Pass
- ES-004 Phantom ABN: ABN active, registered to the billing practice · Pass
- ES-005 Waiver abuse: 0 waivers, practice volume 1.1× its 90-day baseline, threshold 3× · Pass

A two-line summary: "Signals raised 0 of 5 · ES-001 no signal · … · ES-005 no signal", then "No suspicious cross-claim pattern detected. Continuing to Phase 3." Under the five live checks, two planned strategies show as grey dashed cards marked "Planned — not in this build" (ES-006 item code validation, ES-007 terminal mismatch), then a blue dashed "Your next strategy" card marked "Configurable". The finished stages above sit as single lines.

**Say**: Phase 1 asked whether this receipt is suspicious. Phase 2 asks a different question: is there an emerging pattern across claims over time? Five real-time Pega Event Strategies evaluate the claims stream continuously, using filters, time windows, aggregations and thresholds: a claim lodged far from home, one device used by unrelated members, one bank account collecting from unrelated practices, a practice billing under an ABN that isn't live, and a run of waiting-period waivers. Each strategy raises a signal or it doesn't. Nothing is raised for James: no suspicious cross-claim pattern.

**Say, pointing at the planned cards**: Five running, two designed, and the eighth is whatever your team spots next month. Each one is configured, not coded: a new pattern becomes a live strategy in days, not a development cycle.

**Under the hood**:

- ES-001: distance from the submission IP's location to the registered address. Graded: over 500 km moderate, over 1,500 km high, overseas critical.
- ES-002: distinct members on one `DeviceFingerprintID` in 72 hours. Three or more unrelated members fires. Members sharing a membership and address are a household, not a ring.
- ES-003: distinct practice ABNs paying into one account in 30 days. Three or more fires. It follows where the benefit lands, not who lodged the claim.
- ES-004: the billing practice's ABN against the Australian Business Register. A cancelled, deregistered or invalid ABN, or one registered to a different entity, fires.
- ES-005: waiting-period waivers and practice claim volume over a rolling 90 days. Repeated waivers for one member, or practice volume at three times its own 90-day baseline, fires.
- Planned, not built, and shown as such: ES-006 item code validation (codes against provider type) and ES-007 terminal mismatch (a HICAPS terminal used away from its registered practice). Planned cards carry no verdict, so nothing reads as a check that ran.

**The room**:

- **FA**: mention the household exception on ES-002. They'll like it.

**Do**: Click Continue to Phase 3.

### Phase 3 and the outcome (about 2 minutes)

**On screen**: The phase explanation is one line: "No entity known, no connection within 3 hops, and no comparable confirmed case." Three checks, each Pass: Watchlist match ("7 entities checked · 0 matches"), Network graph, tagged "MCP · Graph" ("0 connections within 3 hops"), and Fraud case similarity, tagged "GenAI · Knowledge Buddy" ("412 cases searched · no comparable case"). The network graph card stays open with four extra rows: Hops (6, 8 and 4 entities at hops 1, 2 and 3), Relationships (the edges it follows), Analytics (shortest paths, community membership, shared-attribute links) and What it is. A two-line summary: "Network verdict CLEAR · Watchlist 0 confirmed · 0 monitored · Graph 18 entities within 3 hops · 0 confirmed · Similarity 412 cases searched · 0 comparable", then "Claim approved and sent for adjudication." Then the summary: "Fraud Detection — No Suspicious Activity", "Sent for Claim Adjudication".

**Say**: The last question: who else is involved? The graph follows everything this claim touches (member, practice, practitioner, device, IP, payment account) up to three hops out, looking for confirmed fraud or anything under investigation. It runs last because it's the widest search, across everything the claim touches. James is clear, so his claim goes to normal adjudication, with every check recorded. Now let's see where fraud gets stopped.

**Under the hood**:

- Three checks, in escalating order of "have we seen this before": P3-WATCHLIST (known: a direct match on the confirmed or monitored lists, a business rule), P3-GRAPH (connected: a graph query over an MCP connection) and P3-SIMILARITY (resembles: Pega GenAI Knowledge Buddy over closed investigations).
- P3-GRAPH rule: any path within three hops to a confirmed fraud community or an entity under investigation. It follows the edges between members, practices, practitioners, devices, IPs, addresses and accounts, including shared device, account, address, phone or email, and reports shortest paths to flagged entities and membership of confirmed rings such as Community #47.
- An alert attaches to the entity (a device, an account, a practitioner), so it reaches every claim linked to it, including ones already closed.
- Similarity never routes a claim on its own; it adds weight to other signals, with the matching cases cited.

**The room**:

- **AR**: point back at the architecture whenever a phase starts. It keeps the pieces connected for them.

## 25:00–29:00 · CLM-0847 and CLM-0848: stopped before any forensic AI

**Transition**: *That was a clean claim. Now two that never reach forensics at all.*

On these, talk over pre-flight with the story rather than each check. The card still explains each one if you glance at it.

### CLM-0847, Priya Raman: a quotation

**Do**: Press 7, then Load Receipt.

**On screen**: Field extraction, extraction confidence, receipt type, line item reconciliation and claim value pass. Receipt completeness **fails** ($0.00 received of $448.00, "Nothing has been paid") and Disqualifying content **fails** (2 of 11 terms: "treatment plan and quotation" in the header and "this is not a tax invoice" in the footer, "Classified as a quotation"). The panel reads "Claim rejected — not a claimable receipt", "Quotation, not a tax invoice · nothing paid", Stage: Reject Document, Status: Resolved-Rejected, and "No forensic AI checks were run on this claim." The card rests on Disqualifying content. Receipt Forensics doesn't appear.

**Say**: Priya uploads what looks like a dental invoice. It's a treatment plan and quotation for work she hasn't had, and nothing has been paid. Two business rules catch it, instantly, with the reason in one line. No forensics run, and nothing reaches the fraud team. That's the case for simple checks first.

### CLM-0848, Oliver Hartmann: a genuine receipt, already settled

**Do**: Press 8, then Load Receipt.

**On screen**: Every check passes except Disqualifying content, which **fails**: "1 of 11 terms matched · PAID stamp", "Account already settled, nothing to claim". The panel reads "Claim rejected — nothing to claim", "Receipt is stamped PAID · the account is already settled", and "The receipt is genuine and complete. It simply isn't claimable."

**Say**: Oliver's physio receipt is genuine in every respect. The practitioner signed it, the ABN is valid, the line items reconcile and nothing's been altered. But the practice has stamped it PAID, so the account is settled and there's nothing left to claim. The document is fine; it just isn't claimable. That's readable from the page, so a business rule included in Pega Platform catches it.

**Under the hood**:

- The rule matches the stamp, not the word "paid" wherever it appears: "amount paid", "paid in full", "unpaid" and "prepaid" on an ordinary receipt don't trigger it.
- Disposition `AlreadyPaid`, one of 11 terms in `SetKeywordMatchResults`.
- There's no forensic finding, and that matters: the document is genuine.

**The room**:

- **FA**: expect "our members' receipts say PAID when they paid at reception". Give the prepared answer: *"Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception."* Then ask: how does your provider network use the stamp today? That question is the point of the scene.
- **DS**: will like the word-boundary matching.
- **AR**: both end in Reject Document, the left-hand exit. They're not fraud cases, which is why they don't appear in the report.

## 29:00–33:00 · CLM-0842, Sarah Nguyen: a doctored receipt

**Transition**: *Both of those stopped for nothing. This one's worth paying for.*

This is the best forensics scene in the demo. Pre-flight catches what's wrong; forensics shows how it was done.

**Do**: Press 2, then Load Receipt. When pre-flight finishes, click Receipt Forensics →.

**On screen, pre-flight**: Field extraction reads a stated total of $487.50. Line item reconciliation **fails**: "$100.00 + $185.00 + $160.00 = $445.00 against a stated total of $487.50 · $42.50 discrepancy", "Total does not reconcile to the line items". Pre-flight ends amber, not green: "Line item reconciliation: Total does not reconcile to the line items", then **"The total doesn't reconcile. Running forensics to see how it was altered."** The card rests on Line item reconciliation, and "Receipt Forensics →" appears: the claim isn't rejected.

**Say, at pre-flight**: Sarah uploads an optical receipt, and it's been doctored. The printed total reads $487.50, but the line items add up to $445.00. Whoever edited the PDF changed the number that mattered and left the breakdown alone, which is the usual mistake. Pre-flight catches it with arithmetic, a business rule included in Pega Platform. But it doesn't reject the claim. The question now is how the total was altered, so it goes on to forensics.

**On screen, Phase 1**: Font consistency **fails** (3 typefaces, Arial 9pt, Helvetica 10pt and Times New Roman 8pt, with breaks in the amount and date: "Text has been spliced"). Metadata and provenance **fails** (authored in Adobe Photoshop, modified 16 Jul 2026, two days after the service: "Provenance inconsistent with the service"). The score block lists −0.40 font, −0.25 metadata and −0.07 "Line item reconciliation (pre-flight)", total **0.28**, "Threshold 0.70 — below · SUSPICIOUS". A panel headed "Doctored receipt — the total doesn't reconcile to its line items" shows stated total $487.50, line items sum to $445.00, discrepancy $42.50 (total inflated by 10.8%), "Result: TOTAL ALTERED", and how it was altered.

**Say, at Phase 1**: Now we know how. Three typefaces spliced into the amount and the date, and a file edited in Photoshop two days after the service. The arithmetic told us something was wrong; forensics shows exactly what was done. No single finding is conclusive. Together, with the reconciliation, they take the score from 1.00 to 0.28, well under 0.70. The claim goes to an investigator at high priority with a four-hour SLA, with both the what and the how. Phases 2 and 3 don't run.

**Under the hood**:

- The reconciliation check is marked `"onFail": "forensics"`: a fail sends the claim on to Phase 1 rather than rejecting it.
- Its verdict carries into the Phase 1 score as a row marked "(pre-flight)", so the outcome combines both stages.
- The weights (−0.40, −0.25, −0.07) are expert-set, to be calibrated on the replay.

**The room**:

- **DS**: will ask why the reconciliation costs only 0.07. The weights are expert-set; and how a total that doesn't reconcile on an otherwise genuine receipt should be routed on its own is still open. Say so.
- **FA**: will want the evidence in the case, not just the score. It is: each finding carries its rule and what it found.
- **FA**: may ask why not reject at pre-flight. Answer: a doctored total is evidence of intent, which is a fraud question, not a document question. Rejecting it would lose the evidence.

## 33:00–37:00 · CLM-0844, Linda Pham: a device ring no single claim can show

**Transition**: *Everything so far has been one claim at a time. Here's where that stops working.*

**Do**: Press 4. The sign-in plays in a laptop browser, with a one-time code instead of Face ID. Press Esc if you're short of time. Then Load Receipt, Receipt Forensics, and Continue through Phase 1.

**On screen**: The session chip reads 💻 DEV-1196 ⚠ new device, Footscray. Pre-flight and Phase 1 are clean. In Phase 2, ES-002 **fails**: "5 members on one device in 26 hours · threshold 3", "Five unrelated members on one device". "Signals raised 1 of 3". The action line: this claim is marked suspicious and referred; separately, a network assessment is raised against device DEV-1196, covering the four earlier claims that were cleared before the pattern existed.

**Say**: Linda lodges through the H+ website from a Windows laptop she's never used, in Footscray; she lives in Springvale. Her receipt is genuine and Phase 1 is clean. But five unrelated members have lodged from that laptop in 26 hours, with different surnames, addresses and policies. This claim is the one that tipped it over. The four before it were cleared, because until now there was no pattern to see. So two things happen: this claim is referred, and a network assessment is raised against the device, which reaches back to the four earlier claims.

**Under the hood**: ES-002 counts distinct members per device over 72 hours, as claims arrive. The household exception means families sharing a membership and address don't fire it.

**The room**:

- **FA**: will ask about families, reception kiosks and corporate practice groups. The household exception covers families. **Check first**: kiosks and chains would need allow-lists; confirm who would own them before offering the fraud team.
- **DS**: will spot that a backward-looking window can't fire until the third claim. That's inherent to real-time rules, and it's why the retrospective network assessment exists.
- **AR**: the same idea with money is CLM-0843 (ES-003, four practices paying into one bank account). Mention it in one line rather than running it.

## 37:00–40:00 · CLM-0845, Michael Torres: the risk is in who delivered the service

**Transition**: *Nothing wrong with this claim. The question is who else is attached to it.*

**Do**: Press 5. Load Receipt, Receipt Forensics, Continue to Phase 2, Continue to Phase 3.

**On screen**: Pre-flight, Phase 1 and Phase 2 are clean. In Phase 3, the network graph **flags**: "2-hop path to a practitioner shared with 2 practices under investigation". The path: member MBR-29034 → ClearView Optometry → optometrist PR-5518, who also bills through Northgate Eyecare (INV-2024-0612) and Riverbend Optical (INV-2024-0688), both under investigation. Fraud case similarity also **flags**: three closed investigations with the same shape and no identifier in common. The summary reads "Network verdict PATTERN, REFERRED FOR REVIEW": two weak signals, referred to the investigator queue at standard priority, with the path and the cited cases attached.

**Say**: Michael's optical claim clears forensics and all five event strategies. But the graph finds that the optometrist on the claim also bills through two practices already under investigation. The risk isn't in the claim. It's in who delivered the service, and no single claim contains that connection.

**The room**:

- **DS**: will ask how "under investigation" gets into the graph and how fresh it is. Similarity never routes a claim on its own; here it adds weight to the graph link, which is why the claim goes to review, not the SIU.
- **FA**: if they'd rather see an organised ring, run CLM-0846 instead (press 6): a 3-hop path through a shared submission IP into Community #47, a confirmed ring of 14 members and 3 providers.

## 40:00–42:00 · What the investigator gets

**Do**: On CLM-0845's summary, click "Open Alert & Investigation Manager". Close it with its ✕. Then open the Report.

**On screen**: The investigation screen: "Two weak signals — referred for review", the case in the investigator queue with its priority and SLA, the result of every phase with Phase 3 "Flagged — Shared Practitioner", the path chain with the two practices marked under investigation, the evidence lines including the three similar closed cases and "Why review, not SIU", and an investigator briefing assembled by a Pega agent. The report: every case, filterable by member, provider, date and outcome.

**Say**: This is what lands in the investigator's queue: the case, its priority and SLA, every phase's result, the path drawn out, and a briefing drafted by a Pega agent for the investigator to review. Nothing is decided for them. The decision is theirs, and it's recorded. Across claims, the report is the team's view of every case.

**The room**:

- **FA**: this is the screen they'll judge the whole thing on. Let them read it, and ask what's missing from the evidence package.
- **Watch for**: the report's fraud score column isn't defined in the demo. CLM-0842 shows 85% there and 0.28 in the pipeline. If asked, the report's score is illustrative; the pipeline's integrity score is the one with defined arithmetic. CLM-0847 and CLM-0848 aren't in the list because pre-flight rejections never become cases.

## 42:00–55:00 · Questions

Where the honest answer is "the POC will tell us", say that. This audience trusts it more than a confident guess. Answers marked **Check first** are recommendations: confirm them before you use them.

### If anyone asks how you'd know it works

This is a backup answer. Never present it unprompted: the sizing conversation is "not this meeting", and raising it would read as an ask.

**How would you know it works?**

**Say**: The honest way is a replay. Take claims you've already paid, run them through, and see what comes out, because you already know the outcome. The output isn't a dollar figure, though. It's a list of claims that went through without question, each with the reason it was flagged, and your team decides which of those are real. That's a separate conversation and it's already happening elsewhere.

**Supporting notes**: only if the conversation goes further.

- **The replay**: about 10,000 historical receipts from a defined period, run through pre-flight and Phase 1 exactly as new claims would be, using only what was known when each claim was lodged.
- **The truth we compare against**: confirmed fraud from past investigations and recoveries. For the rest, the fraud team reviews what the pipeline flags, and a random sample of what it doesn't. Without that sample we could only ever measure what we already knew how to find.
- **The baseline**: today's process on the same receipts. The question isn't whether it's good in the abstract; it's whether it finds more fraud than we do now, at the same review capacity.

At a 1 to 3% fraud rate, a system that approves everything is 97% accurate, so accuracy isn't a useful measure. The measures the replay would use, with targets agreed before it runs:

| Measure | What it tells us | How it's computed | Target |
| --- | --- | --- | --- |
| Precision at review capacity | Whether investigators' time is spent on fraud | Of the claims the team can review each week, the share confirmed as fraud | To agree |
| Recall on known fraud | How much known fraud it finds | Share of confirmed historical fraud in the replay that the pipeline flags | To agree |
| Estimated missed fraud | What it misses that nobody knew about | Fraud found in the random sample of unflagged claims, scaled up | Report |
| Wrongful pre-flight rejections | Harm to honest members | Claimable receipts rejected in pre-flight, each reviewed by hand | Near zero |
| Referrals per week | The load on the fraud team | Claims sent to AIM at the chosen thresholds | Within capacity |
| Claims stopped before forensics | Whether simple checks first keeps forensics and investigators on the right claims | Share of claims settled in pre-flight, and AI checks per confirmed referral | Report |
| Against today's process | Whether it beats what we do now | The same measures for the current rules on the same receipts | Better on precision and recall |

- **DS**: will push for a time-based split if a model comes later, and will point out that past confirmed fraud is biased towards what old rules caught. The random sample answers both.
- **FA**: the cost of this plan is their review time. Size it with them: how many flagged and sampled claims a week they can take.
- **AR**: the replay needs a harness that feeds historical receipts into the case with their original timestamps. Phases 2 and 3 need claim events replayed in order, which is why they come after Phase 1.

**Check first**: the random sample and the targets commit the fraud team's time. They're for the separate conversation, not for Wednesday.

### Fraud analysts

**How much will this add to my queue?** That's one of the first things the replay measures: referrals per week at the chosen thresholds, before anything goes live. The design aims to take work off you. Pre-flight rejects unclaimable documents without referring them, and what reaches you arrives with its evidence assembled.

**Won't families and busy practices trip the device and account rules?** Families, no: ES-002 treats members sharing a membership and address as a household. **Check first**: reception kiosks and corporate practice groups would need allow-lists, and the thresholds would be tuned on the replay against your judgement.

**Members' receipts say PAID. Will you reject them?** Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception. That's why it's in the demo: the stamp doesn't say who paid, and that ambiguity is where a double claim hides. How does your provider network use it today?

**Why doesn't a doctored total get rejected in pre-flight?** Because it's evidence of intent. A quotation or a PAID receipt is a document that can't be claimed; a total that's been changed is a fraud question. Sending it to forensics finds out how it was done and gives the investigator both.

**Does the member find out they were flagged?** A pre-flight rejection gives a document reason ("not a claimable receipt"). A fraud referral goes to an investigator, and a person decides what happens next. **Check first**: what the member sees while a referral is open is a process decision for the organisation.

**What about claims paid before a ring was spotted?** The alert attaches to the entity (the device, the account, the practitioner), not only the claim, so a network assessment reaches every linked claim, including ones already closed. That's the recovery path for what prevention missed.

### Data scientists

**Where's the model? This looks like rules.** Mostly it is, deliberately. AI does perception: reading the receipt, spotting spliced text, overlays and generated images, and walking the graph. Decisions are rules and a decision table, because they have to be explainable and auditable. A trained classifier can come once there are trustworthy labels, and the replay, with the fraud team's review and the random sample, is how we get them.

**How will you measure success?** Give the replay answer from "How would you know it works?" above. Go into the measures only if they push.

**Isn't "self-improving" a biased feedback loop?** Yes, if you only learn from what you flag, and that's the right challenge. Investigator decisions only exist for referred claims. **Check first**: the mitigation is the random sample of unflagged claims, kept running after go-live, which is an ongoing commitment of review time.

**Where do the weights and thresholds come from?** Expert judgement, for now. The integrity weights (−0.40 font, −0.25 metadata, −0.07 line item reconciliation) and thresholds (0.70 integrity, 0.70 field confidence, 0.15 AI-generated) are starting points, to be calibrated on the replay. The integrity score is a rule-based score, not a probability.

**How do you avoid leakage in a historical replay?** Every signal is computed as of the claim's lodgement time. The event strategy windows look backwards only, so a replayed claim sees the 72 hours or 30 days before it, never after. Anything an investigator filled in later stays out of the inputs.

**What happens when fraudsters adapt?** They will. Once a device rule is known, rings spread across more devices. We'd monitor signal rates by strategy over time, and the graph is harder to evade because it links entities rather than counting them. Detection is reviewed on a cadence, not set once.

### Architects

**Where does each check run?** Pre-flight runs in the Claim case: one vision model call, then the data transforms `SetMarkerFlagResults`, `SetKeywordMatchResults` and `SetHighValueFlag` and the reconciliation, then the Valid Claim decision table. Phase 2 is Pega Event Strategies over claim events. Phase 3 is a graph query over MCP. Investigations run in Pega AIM.

**Receipts hold health information. Where does the model run?** One of the two open choices, and it has to be settled before the replay touches real receipts: hosting region, data retention and whether receipts leave the tenancy, checked against privacy obligations and CPS 234. Don't guess in the room; take it as an action.

**Who pays for the model calls?** The badges say no token cost: Pega prices per case, so cost scales with claims volume rather than AI usage. **Check first**: exactly which model calls sit inside that price is a commercial point to confirm with Pega. The ordering doesn't depend on it: simple checks run first because they're instant, explainable and keep investigators' time for the claims that matter.

**What's captured at sign-in, and on what basis?** The device fingerprint, the IP and its geolocation, and the session time, stored as `GeoSession` and `DeviceSession` on the claim. No browsing history, contacts or background location. The consent and privacy basis needs a formal privacy review before production.

**Why MCP for the graph?** **Check first**: it gives the case a standard, auditable way to call the graph as a tool, so the graph store can change without rewriting the case. Which store, and how it's fed, is the second open choice.

**How do event strategies hold state at our volume?** They aggregate over windows (72 hours per device, 30 days per account) as events arrive, without re-reading history for each claim. Sizing and retention need load testing against the real claim rate; the replay is a good first test.

## 55:00–60:00 · Close: what I'd like from you

**Say**: I said at the beginning I wouldn't ask you for anything, so I won't.

What I'd like instead is your view. It's deliberately narrow: I'd rather show you three things that work than nine that might. So the useful question is what it doesn't catch that it should.

**Say**: There's a separate conversation happening about sizing this against real claims. That's not this meeting, and I'm not going to drag it in. If it's interesting to you, it's easy to find me.

**Say**: The one thing I'd genuinely value: the PAID stamp rule. We treat a stamped receipt as unclaimable. Whether that holds depends entirely on what your provider network actually stamps and when, and you know that and I don't.

**Why no ask**: the opening set a contract, "I'm not asking you for anything at the end". Making an ask in the last minute would contradict it. Asking for their view keeps the promise and still gets their objections while you can answer them.

## If something goes wrong

| Problem | Fix |
| --- | --- |
| The old slides or no What's happening card | The browser has an old copy. Hard-refresh: Ctrl+Shift+R, or Cmd+Shift+R |
| Pressed Space on a slide by mistake | Press ← to go back |
| The sign-in scene is taking too long | Esc skips to its end |
| Lost your place in a scenario | Press its number (1 to 8) to reopen it |
| Anything else | Press 0 (slide 1, form cleared), then the scenario number |
| The investigation screen won't close with Esc | Use its ✕ |
| A question you can't answer | "That's one the POC should answer. Let me write it down." Then write it down |

## Checklist for the run-through

Work through these and note anything that doesn't match this script.

1. Hard-refresh the live site; the slides are the five images and the timing table's slide names match.
2. Slides: your three tiers and four questions land over the image slides 2 and 3 without reading their cards, the bridge line on slide 4 points back to the four questions, and you say "illustrative" about the slide figures unprompted.
3. CLM-0841: Space pauses the sign-in; you can talk to all eight pre-flight checks in their 5 seconds each; clicking a check at rest brings its card back; Phase 1 to 3 and the outcome read as above.
4. CLM-0847 and CLM-0848: the PAID answer, word for word, and the question to the room.
5. CLM-0842: the two-stage story lands: arithmetic in pre-flight, then how it was done in Phase 1, with the score at 0.28.
6. CLM-0844 and CLM-0845: the sign-in for 0844 plays in a laptop frame; the Phase 2 and Phase 3 findings read as above.
7. The investigation screen opens from CLM-0845 and closes with its ✕; the report opens.
8. Time each section against the table, and decide in advance what you'll cut if you're behind.
9. Tuesday: the full hour on the presenting laptop and projector, at its real resolution.
