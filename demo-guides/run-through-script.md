# Run-Through Script: One Hour With Fraud Analysts, Data Scientists and Architects

The presenter's script for the fraud detection POC, in the order the demo runs, with what to say at every step, the detail underneath it, and what the room should leave with. It matches the build on the live site at <https://grahamcrooks.github.io/FraudPOC/> as of 27 September 2026: the five image slides, the eight pre-flight checks at 5 seconds each with the What's happening card, and CLM-0842 as a doctored receipt.

Use it for the in-depth run-through, for Tuesday's full rehearsal on the presenting laptop and projector, and on Wednesday 30 September. [`demo-script.md`](demo-script.md) is the companion for system testing: it has the complete check-by-check test cases. This script is for presenting.

Each step has up to five parts:

- **On screen**: what the audience is looking at.
- **Do**: what you press or click.
- **Say**: the words, in your voice. Adapt them; don't read them.
- **Under the hood**: the technical detail, for when someone asks. Where it describes Pega, it describes the intended design. Everything on screen is simulated with illustrative data.
- **The room**: what each group is listening for, and what they're likely to ask. FA is the fraud analysts, DS the data scientists, AR the architects.

## What the hour is for

### The one message

Fraud is cheaper to stop before a claim is paid than to recover after it. This POC shows how, one layer at a time, with every decision explainable and a person making every call that matters.

### What each group should leave with

| Group | They should leave believing | Where it lands |
| --- | --- | --- |
| Fraud analysts | This takes work off their queue, not onto it. Unclaimable documents never reach them, and what does reach them arrives with the evidence assembled. | Pre-flight rejections (CLM-0847, CLM-0848), the device ring (CLM-0844), the investigation screen |
| Data scientists | The AI claims are testable and bounded, the score is arithmetic they can check, and the measurement plan is honest about base rates and label bias. | The pre-flight card and rows, the Phase 1 score, the measurement plan |
| Architects | They know what's real and what's drawn, where AI is spent, where each check runs, and which two decisions are theirs to make. | The architecture walk-through, the What's happening card, the questions |

### What you're asking the room for

- **Fraud team**: own the disqualifying term list and any allow-lists, agree the review capacity for the replay, and review the flagged claims and a random sample of unflagged ones.
- **Data science**: hold the POC to the measures, and help set the targets before anything runs.
- **Architecture**: settle where the vision model runs and which graph store sits behind MCP, before any real receipt goes through.
- **Everyone**: "What would stop you supporting this?"

### Principles to repeat

1. **Cheap checks first.** AI is spent in three places only: one read in pre-flight, three image checks in Phase 1 and the graph query in Phase 3. Everything else is rules and a decision table, at no AI cost.
2. **AI assists, people decide.** Every signal goes to a named investigator in Pega AIM with the evidence attached. Nothing is decided for them.
3. **Every check shows its working.** What it looked at, the rule and what it found, on screen. That's the audit trail.
4. **Simulated, and labelled as such.** Every scene is marked Simulated. Names, numbers and addresses are fictional. Where something is planned rather than built, say so.

## Decisions to hold the line on

These came up in preparation. Have the answers ready and don't soften them on the day.

| Topic | Position |
| --- | --- |
| The PAID stamp (CLM-0848) | "Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception." Then ask the room how their provider network uses the stamp. Asking is stronger than softening the rule. |
| Claim value | Context for later checks, not a fraud signal. It's recorded at $5,000 or above and never routes a claim on its own. Nothing in the demo shows claim value causing an outcome. |
| The doctored total (CLM-0842) | A total that doesn't reconcile to its line items fails pre-flight but isn't rejected: the question is how it was altered, so the claim goes on to forensics. |
| Figures on the slides | The claims analytics panel on slide 3 ($270K, +42%, the chart and risk categories) and the impact row on slide 5 (−65%, +40%, +28%) are illustrative, not Bupa data and not measured results. Say so if asked, before anyone else does. |
| "Phase" means two things | Slide 4's phases are the delivery path (detection POC, workflow and review, prevention at scale). In the demo, Phase 1, 2 and 3 are the three layers of checks every claim goes through. Use the bridge line on slide 4. |
| Pre-flight rejections aren't fraud | CLM-0847 and CLM-0848 end in Reject Document, not in the fraud team's queue, and they don't appear in the report. That's correct. |
| Weights and thresholds | Expert judgement, to be calibrated on the replay. The integrity score is a rule-based score, not a probability. Never call it one. |

## Before you start

### Set-up

1. Open <https://grahamcrooks.github.io/FraudPOC/> and hard-refresh: Ctrl+Shift+R, or Cmd+Shift+R on a Mac. You should see the image slides and, in the demo, the What's happening card during pre-flight.
2. Press F for fullscreen. Stay in Presenting mode (the default).
3. Captions are on. Press C if they compete with you.
4. Have the rehearsal page open in another tab for the architecture diagram and the measurement table: <https://claude.ai/artifact/UDXWJFLAadiKKFnwEZR3KS>. Some of its scenario notes predate the current build; this script supersedes them.
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
- **Pre-flight**: can't be paused, but it's slow on purpose: 5 seconds a check, 40 seconds for all eight. Talk over it. Once it finishes, click any check to bring its explanation back.
- **The pipeline**: it waits for you. It only moves on when you click Run Fraud Detection or Continue. A phase's few seconds of animation can't be paused.
- **Close the investigation screen with its ✕.** Escape doesn't close it.

### Budget for interruptions

This room asks during the demo, not after. Answer briefly and park anything long for the questions at 46:00.

- **5 minutes behind at 25:00**: skip CLM-0847 and run CLM-0848 only. It carries both points: cheap checks first, and the PAID question for the room.
- **Still behind at 37:00**: open the investigation screen and skip the report.
- **Never cut** the measurement plan or the questions. They're what this room came for.

## Timing at a glance

| Time | Section | On screen |
| --- | --- | --- |
| 00:00–03:00 | Open: set the contract | Slide 1 |
| 03:00–08:00 | The problem, the case and the approach | Slides 2 to 5 |
| 08:00–10:00 | How the pieces fit together | Architecture diagram (rehearsal page) |
| 10:00–25:00 | CLM-0841, a clean claim, end to end | Sign-in, portal, pre-flight, Phases 1 to 3, outcome |
| 25:00–29:00 | CLM-0847 and CLM-0848: stopped in pre-flight | Reject panels |
| 29:00–33:00 | CLM-0842: a doctored receipt | Pre-flight fail, then Phase 1 forensics |
| 33:00–37:00 | CLM-0844: a device ring | Laptop sign-in, Phase 2 |
| 37:00–40:00 | CLM-0845: a shared practitioner | Phase 3 |
| 40:00–42:00 | What the investigator gets | Investigation screen, report |
| 42:00–46:00 | How we'll know if it works | Measurement table (rehearsal page) |
| 46:00–55:00 | Questions | |
| 55:00–60:00 | Close: what you need from this room | |

## 00:00–03:00 · Open: set the contract

**On screen**: Slide 1, Agenda.

**Say**: Thanks for the hour. I'll keep the slides short, because you'll learn more from the working demo. Four things: why prevention rather than recovery, sizing the problem in Bupa's own claims, what success looks like for the first phase, and what we need to get started. I'll show you how a claim moves through the pipeline, where each kind of fraud gets stopped, how the pieces fit together and how we'd measure whether it works. Then I want your challenge.

One ground rule. Everything you'll see runs on simulated, illustrative data, and every scene is labelled that way. The components are the Pega ones we'd build with, and where something is planned rather than built, I'll say so.

**The room**:

- **FA**: listening for whether this adds to their queue or takes work off it.
- **DS**: listening for "AI" claims they can test. The ground rule earns their trust early.
- **AR**: listening for what's real and what's drawn. Same answer.

## 03:00–08:00 · The problem, the case and the approach

### Slide 2: Problem (1½ minutes)

**On screen**: "Problem: why prevention, not just recovery", with four cards: hidden anomalies in routine claims, manual review is reactive and slow, leakage compounds before recovery, members and providers need protection.

**Say**: You know this better than I do. Fraud hides in routine claims: unusual service patterns, duplicate items and incorrect billing, buried in volumes of legitimate claims. Our review is reactive. Rules and audits find it after we've paid, and by then the leakage has compounded across claim volumes and into premiums. It costs honest members and providers too. We estimate 1 to 3% of claims contain fraud, waste or abuse, against a global range of 3 to 10%, and healthcare is Australia's most targeted sector for data breaches, which is what organised rings feed on. This POC is about deciding before payment.

**Under the hood**: The sources aren't on the slide, so quote them if you use the figures: PKF Littlejohn / Centre for Counter Fraud Studies for the 3 to 10% range, and the OAIC Notifiable Data Breaches Report, January to June 2023, for the breach ranking.

**The room**:

- **DS**: if someone raises the base rate now, say "exactly, which is why accuracy won't be our measure. I'll show you what will be at minute 42."

### Slide 3: Business Case (1 minute)

**On screen**: "Business Case: the value of earlier detection". A claims analytics panel beside four outcome cards: reduce improper payments, prioritise high-risk claims, improve operational efficiency, protect member trust.

**Say**: Four outcomes: stop improper payments before they go out, put the highest-risk claims in front of the team first, spend review effort where it counts, and keep premiums fair for honest members. The POC puts real numbers on these by replaying about 10,000 historical receipts, starting with Phase 1. I'll come back to how we'd measure it.

**Under the hood**: The analytics panel ($270K, +42%, the monthly chart and the risk categories) is illustrative. It is not Bupa data. Say so before anyone asks.

### Slide 4: Three Phases (1½ minutes)

**On screen**: "Three Phases: a practical path from detection to prevention". Detection POC, Workflow & Review, Prevention at Scale.

**Say**: This is the delivery path: a detection POC to find suspicious patterns, then workflow and review so the team can triage and investigate, then prevention at scale with real-time intervention. We're at the first step.

Then the bridge line: *Inside the detection POC, every claim goes through three layers of checks, and in the demo you'll see them called Phase 1, 2 and 3. Receipt forensics: is the receipt genuine and does it match the claim? Cross-claim signals: does this claim fit a pattern across other claims? Network intelligence: is it connected to known fraud or an organised ring?*

**Under the hood**: The slide's phases are delivery stages, not the demo's Phase 1, 2 and 3. The bridge line keeps the two apart. Don't skip it.

**The room**:

- **FA**: the planned Phase 2 checks (phantom ABN, waiver abuse, item code validation) are their wish list. If they come up, ask which they'd want first, then keep moving.

### Slide 5: Why Pega (1 minute)

**On screen**: "Why Pega? Decisioning, workflow and orchestration in one platform". Decisioning and business rules, case management and workflow, integration across claims data, governance, audit trail and scale.

**Say**: We're building on Pega because the AI runs inside case management we already govern. Decisioning and rules, the investigation workflow, the connections to claims, member and provider data, and the audit trail a regulated insurer needs, in one platform, not bolted together.

**Under the hood**: The impact row at the foot (−65% suspicious claims, +40% investigation efficiency, +28% cost savings) is illustrative, not measured. Don't quote it as a result. Claims management is a named critical operation under APRA CPS 230, which is why the audit trail matters.

## 08:00–10:00 · How the pieces fit together

**On screen**: The architecture diagram from the rehearsal page (switch tabs), or talk to slide 5.

**Say**: Before the demo, here's how the pieces fit. A claim is one Pega case from sign-in to outcome. The session is captured at sign-in and waits; Phase 2 is the first thing that reads it.

AI is spent in three places only: one read in pre-flight, three image checks in Phase 1, and the graph query in Phase 3. Everything else is rules and a decision table.

There are three exits. A document that isn't claimable goes to Reject Document or Needs Review and never reaches the fraud team. Any signal goes to an investigator in AIM. A clear claim goes to adjudication in the claims system we have today.

Two things are still to be chosen: where the vision model runs, and which graph store sits behind MCP. They're the only services the case calls out to while it decides, so they're where the privacy and cost questions live, and they're the decisions I need your help with.

**The room**:

- **AR**: this is their section. Expect questions on the event stream, the replay harness and the two open choices. Answer what's decided and write down what isn't.
- **DS**: they'll notice there's no trained model in the picture. That's right for Phase 1; the measurement plan says when one could come.
- **FA**: the Reject Document / Needs Review exit is what keeps unclaimable documents off their queue. Point at it.

**Check first**: The diagram shows the demo's design. Confirm with your Pega architect that the vision model call, the event stream and the MCP connection sit where it shows them.

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

**On screen**: The H+ member portal. James's policy (POL-2021-44210, Gold Hospital + Extras), claims this year, benefit remaining and member details (MBR-33291, Carlton VIC 3053) on the left. The claim card has two numbered panels: 1 · Receipt and 2 · Extracted from the Receipt.

**Say**: James is now in the member portal. Notice the second panel: every field in it will be filled from the receipt. The member only uploads a receipt. They type nothing.

**Under the hood**: The portal is the member's view of the Claim case. Member data comes from the Member record. ES-001 needs the member's registered address as coordinates (`RegisteredAddressLatitude` / `RegisteredAddressLongitude`).

### Pre-flight: is this a claimable receipt at all? (about 5 minutes)

**Do**: Click Load Receipt. Eight checks run, one every 5 seconds, about 40 seconds in all. The What's happening card at the top of the left column explains each one as it runs.

**Say, as it starts**: James uploads a dental receipt. Before we spend anything on forensics, pre-flight asks one question: is this a claimable receipt at all? AI reads the receipt once. Then business rules do the rest at no AI cost. A quotation, a proforma, an unpaid invoice or a receipt that doesn't add up is caught here. Watch the card on the left: it says in plain words what each check is doing and why.

Talk to each check as the card changes. The table gives what the row shows for James, what to say, and the detail underneath.

| # | Check | On screen for James | Say | Under the hood |
| --- | --- | --- | --- | --- |
| 1 | Device and location | DEV-2291 · Carlton VIC · captured at sign-in | The device, location and time from sign-in are attached. Nothing is judged here. | Capture, no verdict. Used by ES-001 distance and ES-002 device ring in Phase 2. |
| 2 | Receipt type | TAX INVOICE · ABN and AHPRA present · Pass | The AI reads the receipt and decides what it is. Only a genuine tax invoice from a health provider can be claimed, so anything else stops here. | One vision model call classifies the document. It must be a tax invoice from a registered health provider. |
| 3 | Field extraction | 11 of 11 fields · $312.00 · items 011, 022, 114 · Pass | In the same AI read, it pulls out the eleven details a claim needs. Watch the form on the right fill in: the member types nothing. | The same model call returns eleven fields, each with its own confidence score. Every later check works from these fields. |
| 4 | Receipt completeness | $312.00 received of $312.00 · ABN ✓ · 3 lines · signed · Pass | Business rules confirm the receipt has what a valid claim needs: the amount received against the amount charged, an ABN, itemised services, a signature. | Data transform `SetMarkerFlagResults`, no AI cost. |
| 5 | Line item reconciliation | Items reconcile to the total (items sum to $312.00 · stated total $312.00) · Pass | Simple arithmetic: do the line items add up to the total printed on the receipt? Whoever edits a receipt usually changes the total and leaves the breakdown alone. Hold that thought. | Data transform, no AI cost. Line items must sum to the total charged. |
| 6 | Disqualifying content | 11 terms checked · none found · Pass | A rule scans for eleven terms the fraud team maintains: quotation, proforma, non-medical, a PAID stamp. These documents can't be claimed at all. | Data transform `SetKeywordMatchResults`, no AI cost. Matches on the phrase or word boundary, not the substring. |
| 7 | Claim value | $312.00 claimable · marker at $5,000 · Pass | Records whether the claim is $5,000 or more. It's context for later, not a fraud signal, and it never routes a claim on its own. | `SetHighValueFlag`. `"routes": false`: its verdict never decides the route. |
| 8 | Extraction confidence | Lowest 0.92 (ServiceDate) · threshold 0.70 · Pass | Every field came back with a confidence score. Any critical field under 0.70 goes to a person rather than being guessed. | Per-field confidence from the same model call. Below 0.70 routes to Needs Review. |

**On screen when it finishes**: Green: "Receipt pre-validated — passing to forensic authentication" and "7 of 7 checks passed · 3 AI calls · 4 business rules · 1 capture recorded". All eight checks open in two columns, each showing what it looked at, the rule and what it found. "Run Fraud Detection →" appears.

**Say, at rest**: Every check shows what it looked at, the rule and what it found. That's the audit trail, on screen. The Valid Claim decision table takes the first matching row. Nothing matched, so the claim goes on. (Click any check to bring its explanation back to the card if someone asks about it.)

**Under the hood**:

- Routing: any fail goes to Reject Document (Resolved-Rejected). Any flag goes to Needs Review (Pending-Review). All passes open the pipeline.
- Two exceptions. Claim value never routes. Line item reconciliation, on a fail, sends the claim on to forensics instead of rejecting it; you'll see that with CLM-0842.
- Cost so far: one AI call. The three "AI call" badges are three results from the same read.

**The room**:

- **DS**: will ask how 0.70 was set. Answer: a starting point, calibrated on the replay. Park the detail for the measurement plan.
- **FA**: will like that the term list is theirs to own.
- **AR**: will ask where the vision model runs. It's one of the two open choices; take it as an action, don't guess.

### Phase 1: is the receipt genuine? (about 3 minutes)

**Do**: Click Run Fraud Detection →. The pipeline opens. Five checks run about 2.8 seconds apart.

**On screen**:

| Check | Cost | James |
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

**On screen**: Three checks, 6 seconds apart, all "Business rule — no AI cost":

- ES-001 Distance anomaly: 0.4 km from the registered address, threshold 500 km · Pass
- ES-002 Device ring: 1 member on this device, threshold 3 · Pass
- ES-003 Bank account ring: 1 practice on this account, threshold 3 · Pass

"Signals raised 0 of 3" and "No signal raised. Continuing to Phase 3." An italic line lists the planned checks.

**Say**: Phase 1 looked at this claim on its own. Phase 2 compares it with every other claim as claims arrive: is it lodged far from home, is the device shared by unrelated members, is the bank account shared by unrelated practices? These are Pega Event Strategies over time windows, at no AI cost. Nothing is raised for James.

**Under the hood**:

- ES-001: distance from the submission IP's location to the registered address. Graded: over 500 km moderate, over 1,500 km high, overseas critical.
- ES-002: distinct members on one `DeviceFingerprintID` in 72 hours. Three or more unrelated members fires. Members sharing a membership and address are a household, not a ring.
- ES-003: distinct practice ABNs paying into one account in 30 days. Three or more fires. It follows where the benefit lands, not who lodged the claim.
- Planned, not built: phantom ABN, waiver abuse, item code validation.

**The room**:

- **FA**: mention the household exception on ES-002. They'll like it.

**Do**: Click Continue to Phase 3.

### Phase 3 and the outcome (about 2 minutes)

**On screen**: One check, Network graph, tagged "MCP · Graph", an AI call: "0 connections within 3 hops" · Pass. "Signals raised 0 of 1" and "No connections to known fraud or to anything under investigation. Claim approved and sent for adjudication." Then the summary: "Fraud Detection — No Suspicious Activity", "Sent for Claim Adjudication".

**Say**: The last question: who else is involved? The graph follows everything this claim touches (member, practice, practitioner, device, IP, payment account) up to three hops out, looking for confirmed fraud or anything under investigation. It runs last because it's the most expensive check. James is clear, so his claim goes to normal adjudication, with every check recorded. Now let's see where fraud gets stopped.

**Under the hood**:

- One check, P3-GRAPH: a graph query over an MCP connection. Rule: any path within three hops to a confirmed fraud community or an entity under investigation.
- An alert attaches to the entity (a device, an account, a practitioner), so it reaches every claim linked to it, including ones already closed.
- Fraud case similarity matching is planned. It needs a corpus of confirmed cases, which this system produces as it runs.

**The room**:

- **AR**: point back at the architecture whenever a phase starts. It keeps the pieces connected for them.

## 25:00–29:00 · CLM-0847 and CLM-0848: stopped before any forensic AI

On these, talk over pre-flight with the story rather than each check. The card still explains each one if you glance at it.

### CLM-0847, Priya Raman: a quotation

**Do**: Press 7, then Load Receipt.

**On screen**: Receipt type, field extraction, line item reconciliation, claim value and extraction confidence pass. Receipt completeness **fails** ($0.00 received of $448.00, "Nothing has been paid") and Disqualifying content **fails** (2 of 11 terms: "treatment plan and quotation" in the header and "this is not a tax invoice" in the footer, "Classified as a quotation"). The panel reads "Claim rejected — not a claimable receipt", "Quotation, not a tax invoice · nothing paid", Stage: Reject Document, Status: Resolved-Rejected, and "No forensic AI calls were spent on this claim." The card rests on Disqualifying content. Run Fraud Detection doesn't appear.

**Say**: Priya uploads what looks like a dental invoice. It's a treatment plan and quotation for work she hasn't had, and nothing has been paid. Two business rules catch it. No forensic AI is spent, and nothing reaches the fraud team. That's the case for cheap checks first.

### CLM-0848, Oliver Hartmann: a genuine receipt, already settled

**Do**: Press 8, then Load Receipt.

**On screen**: Every check passes except Disqualifying content, which **fails**: "1 of 11 terms matched · PAID stamp", "Account already settled, nothing to claim". The panel reads "Claim rejected — nothing to claim", "Receipt is stamped PAID · the account is already settled", and "The receipt is genuine and complete. It simply isn't claimable."

**Say**: Oliver's physio receipt is genuine in every respect. The practitioner signed it, the ABN is valid, the line items reconcile and nothing's been altered. But the practice has stamped it PAID, so the account is settled and there's nothing left to claim. The document is fine; it just isn't claimable. That's readable from the page, so a rule catches it at no AI cost.

**Under the hood**:

- The rule matches the stamp, not the word "paid" wherever it appears: "amount paid", "paid in full", "unpaid" and "prepaid" on an ordinary receipt don't trigger it.
- Disposition `AlreadyPaid`, one of 11 terms in `SetKeywordMatchResults`.
- There's no forensic finding, and that matters: the document is genuine.

**The room**:

- **FA**: expect "our members' receipts say PAID when they paid at reception". Give the prepared answer: *"Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception."* Then ask: how does your provider network use the stamp today? That question is the point of the scene.
- **DS**: will like the word-boundary matching.
- **AR**: both end in Reject Document, the left-hand exit. They're not fraud cases, which is why they don't appear in the report.

## 29:00–33:00 · CLM-0842, Sarah Nguyen: a doctored receipt

This is the best forensics scene in the demo. Pre-flight catches what's wrong; forensics shows how it was done.

**Do**: Press 2, then Load Receipt. When pre-flight finishes, click Run Fraud Detection →.

**On screen, pre-flight**: Field extraction reads a stated total of $487.50. Line item reconciliation **fails**: "$100.00 + $185.00 + $160.00 = $445.00 against a stated total of $487.50 · $42.50 discrepancy", "Total does not reconcile to the line items". Pre-flight ends amber, not green: "Line item reconciliation: Total does not reconcile to the line items", then **"The total doesn't reconcile. Running forensics to see how it was altered."** The card rests on Line item reconciliation, and "Run Fraud Detection →" appears: the claim isn't rejected.

**Say, at pre-flight**: Sarah uploads an optical receipt, and it's been doctored. The printed total reads $487.50, but the line items add up to $445.00. Whoever edited the PDF changed the number that mattered and left the breakdown alone, which is the usual mistake. Pre-flight catches it with arithmetic, at no AI cost. But it doesn't reject the claim. The question now is how the total was altered, so it goes on to forensics.

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

**Do**: Press 4. The sign-in plays in a laptop browser, with a one-time code instead of Face ID. Press Esc if you're short of time. Then Load Receipt, Run Fraud Detection, and Continue through Phase 1.

**On screen**: The session chip reads 💻 DEV-1196 ⚠ new device, Footscray. Pre-flight and Phase 1 are clean. In Phase 2, ES-002 **fails**: "5 members on one device in 26 hours · threshold 3", "Five unrelated members on one device". "Signals raised 1 of 3". The action line: this claim is marked suspicious and referred; separately, a network assessment is raised against device DEV-1196, covering the four earlier claims that were cleared before the pattern existed.

**Say**: Linda lodges through the H+ website from a Windows laptop she's never used, in Footscray; she lives in Springvale. Her receipt is genuine and Phase 1 is clean. But five unrelated members have lodged from that laptop in 26 hours, with different surnames, addresses and policies. This claim is the one that tipped it over. The four before it were cleared, because until now there was no pattern to see. So two things happen: this claim is referred, and a network assessment is raised against the device, which reaches back to the four earlier claims.

**Under the hood**: ES-002 counts distinct members per device over 72 hours, as claims arrive. The household exception means families sharing a membership and address don't fire it.

**The room**:

- **FA**: will ask about families, reception kiosks and corporate practice groups. The household exception covers families. **Check first**: kiosks and chains would need allow-lists; confirm who would own them before offering the fraud team.
- **DS**: will spot that a backward-looking window can't fire until the third claim. That's inherent to real-time rules, and it's why the retrospective network assessment exists.
- **AR**: the same idea with money is CLM-0843 (ES-003, four practices paying into one bank account). Mention it in one line rather than running it.

## 37:00–40:00 · CLM-0845, Michael Torres: the risk is in who delivered the service

**Do**: Press 5. Load Receipt, Run Fraud Detection, Continue to Phase 2, Continue to Phase 3.

**On screen**: Pre-flight, Phase 1 and Phase 2 are clean. In Phase 3, the network graph **fails**: "2-hop path to a practitioner shared with 2 practices under investigation". The path: member MBR-29034 → ClearView Optometry → optometrist PR-5518, who also bills through Northgate Eyecare (INV-2024-0612) and Riverbend Optical (INV-2024-0688), both under investigation. Referred to the SIU queue, HIGH priority, with the path attached.

**Say**: Michael's optical claim clears forensics and all three event strategies. But the graph finds that the optometrist on the claim also bills through two practices already under investigation. The risk isn't in the claim. It's in who delivered the service, and no single claim contains that connection.

**The room**:

- **DS**: will ask how "under investigation" gets into the graph and how fresh it is. Be clear about what's built (the traversal) and what's planned (similarity matching).
- **FA**: if they'd rather see an organised ring, run CLM-0846 instead (press 6): a 3-hop path through a shared submission IP into Community #47, a confirmed ring of 14 members and 3 providers.

## 40:00–42:00 · What the investigator gets

**Do**: On CLM-0845's summary, click "Open Alert & Investigation Manager". Close it with its ✕. Then open the Report.

**On screen**: The investigation screen: the case in the SIU queue with its priority and SLA, the result of every phase with Phase 3 "Flagged — Shared Practitioner", the path chain with the two practices marked under investigation, four evidence lines, the planned-similarity note, and an investigator briefing assembled by a Pega agent. The report: every case, filterable by member, provider, date and outcome.

**Say**: This is what lands in the investigator's queue: the case, its priority and SLA, every phase's result, the path drawn out, and a briefing drafted by a Pega agent for the investigator to review. Nothing is decided for them. The decision is theirs, and it's recorded. Across claims, the report is the team's view of every case.

**The room**:

- **FA**: this is the screen they'll judge the whole thing on. Let them read it, and ask what's missing from the evidence package.
- **Watch for**: the report's fraud score column isn't defined in the demo. CLM-0842 shows 85% there and 0.28 in the pipeline. If asked, the report's score is illustrative; the pipeline's integrity score is the one with defined arithmetic. CLM-0847 and CLM-0848 aren't in the list because pre-flight rejections never become cases.

## 42:00–46:00 · How we'll know if it works

**On screen**: The measurement table from the rehearsal page, or no screen at all.

**Say**: Everything you've seen runs on illustrative data. So how will we know whether it works on ours? Here's the proposal, and I'd rather you pull it apart now than after we've run it.

- **The replay**: about 10,000 historical receipts from a defined period, run through pre-flight and Phase 1 exactly as new claims would be, using only what was known when each claim was lodged.
- **The truth we compare against**: confirmed fraud from past investigations and recoveries. For the rest, the fraud team reviews what the pipeline flags, and a random sample of what it doesn't. Without that sample we could only ever measure what we already knew how to find.
- **The baseline**: today's process on the same receipts. The question isn't whether it's good in the abstract; it's whether it finds more fraud than we do now, at the same review capacity.

At a 1 to 3% fraud rate, a system that approves everything is 97% accurate, so accuracy isn't on the list. These are the measures, with targets agreed before we run it, not after:

| Measure | What it tells us | How it's computed | Target |
| --- | --- | --- | --- |
| Precision at review capacity | Whether investigators' time is spent on fraud | Of the claims the team can review each week, the share confirmed as fraud | To agree |
| Recall on known fraud | How much known fraud it finds | Share of confirmed historical fraud in the replay that the pipeline flags | To agree |
| Estimated missed fraud | What it misses that nobody knew about | Fraud found in the random sample of unflagged claims, scaled up | Report |
| Wrongful pre-flight rejections | Harm to honest members | Claimable receipts rejected in pre-flight, each reviewed by hand | Near zero |
| Referrals per week | The load on the fraud team | Claims sent to AIM at the chosen thresholds | Within capacity |
| AI calls and cost per claim | Whether cheap checks first saves money | AI calls per claim, and cost per confirmed referral | Report |
| Against today's process | Whether it beats what we do now | The same measures for the current rules on the same receipts | Better on precision and recall |

**The room**:

- **DS**: will push for a time-based split if a model comes later, and will point out that past confirmed fraud is biased towards what old rules caught. The random sample answers both.
- **FA**: the cost of this plan is their review time. Size it with them: how many flagged and sampled claims a week they can take.
- **AR**: the replay needs a harness that feeds historical receipts into the case with their original timestamps. Phases 2 and 3 need claim events replayed in order, which is why they come after Phase 1.

**Check first**: The random sample and the targets commit the fraud team's time. Agree them with the fraud lead before presenting them as the plan.

## 46:00–55:00 · Questions

Where the honest answer is "the POC will tell us", say that. This audience trusts it more than a confident guess. Answers marked **Check first** are recommendations: confirm them before you use them.

### Fraud analysts

**How much will this add to my queue?** That's one of the first things the replay measures: referrals per week at the chosen thresholds, before anything goes live. The design aims to take work off you. Pre-flight rejects unclaimable documents without referring them, and what reaches you arrives with its evidence assembled.

**Won't families and busy practices trip the device and account rules?** Families, no: ES-002 treats members sharing a membership and address as a household. **Check first**: reception kiosks and corporate practice groups would need allow-lists, and the thresholds would be tuned on the replay against your judgement.

**Members' receipts say PAID. Will you reject them?** Our position is that PAID means the account is settled, so there's nothing left to claim. That rule needs validating against the fund's provider network, because a practice could stamp it when the member paid at reception. That's why it's in the demo: the stamp doesn't say who paid, and that ambiguity is where a double claim hides. How does your provider network use it today?

**Why doesn't a doctored total get rejected in pre-flight?** Because it's evidence of intent. A quotation or a PAID receipt is a document that can't be claimed; a total that's been changed is a fraud question. Sending it to forensics finds out how it was done and gives the investigator both.

**Does the member find out they were flagged?** A pre-flight rejection gives a document reason ("not a claimable receipt"). A fraud referral goes to an investigator, and a person decides what happens next. **Check first**: what the member sees while a referral is open is a process decision for the organisation.

**What about claims paid before a ring was spotted?** The alert attaches to the entity (the device, the account, the practitioner), not only the claim, so a network assessment reaches every linked claim, including ones already closed. That's the recovery path for what prevention missed.

### Data scientists

**Where's the model? This looks like rules.** Mostly it is, deliberately. AI does perception: reading the receipt, spotting spliced text, overlays and generated images, and walking the graph. Decisions are rules and a decision table, because they have to be explainable and auditable. A trained classifier can come once there are trustworthy labels, and the replay, with the fraud team's review and the random sample, is how we get them.

**How will you measure success?** Precision at the team's real review capacity, recall on known fraud, estimated missed fraud from a random sample, wrongful rejections, and the same measures for today's process on the same receipts, with targets agreed before the run.

**Isn't "self-improving" a biased feedback loop?** Yes, if you only learn from what you flag, and that's the right challenge. Investigator decisions only exist for referred claims. **Check first**: the mitigation is the random sample of unflagged claims, kept running after go-live, which is an ongoing commitment of review time.

**Where do the weights and thresholds come from?** Expert judgement, for now. The integrity weights (−0.40 font, −0.25 metadata, −0.07 line item reconciliation) and thresholds (0.70 integrity, 0.70 field confidence, 0.15 AI-generated) are starting points, to be calibrated on the replay. The integrity score is a rule-based score, not a probability.

**How do you avoid leakage in a historical replay?** Every signal is computed as of the claim's lodgement time. The event strategy windows look backwards only, so a replayed claim sees the 72 hours or 30 days before it, never after. Anything an investigator filled in later stays out of the inputs.

**What happens when fraudsters adapt?** They will. Once a device rule is known, rings spread across more devices. We'd monitor signal rates by strategy over time, and the graph is harder to evade because it links entities rather than counting them. Detection is reviewed on a cadence, not set once.

### Architects

**Where does each check run?** Pre-flight runs in the Claim case: one vision model call, then the data transforms `SetMarkerFlagResults`, `SetKeywordMatchResults` and `SetHighValueFlag` and the reconciliation, then the Valid Claim decision table. Phase 2 is Pega Event Strategies over claim events. Phase 3 is a graph query over MCP. Investigations run in Pega AIM.

**Receipts hold health information. Where does the model run?** One of the two open choices, and it has to be settled before the replay touches real receipts: hosting region, data retention and whether receipts leave the tenancy, checked against privacy obligations and CPS 234. Don't guess in the room; take it as an action.

**Who pays for the model calls?** **Check first**: Pega prices per case, so cost scales with claims volume rather than AI usage, but which model calls sit inside that price is a commercial point to confirm with Pega. The design keeps AI calls down anyway: one in pre-flight, and forensics only on claimable receipts.

**What's captured at sign-in, and on what basis?** The device fingerprint, the IP and its geolocation, and the session time, stored as `GeoSession` and `DeviceSession` on the claim. No browsing history, contacts or background location. The consent and privacy basis needs a formal privacy review before production.

**Why MCP for the graph?** **Check first**: it gives the case a standard, auditable way to call the graph as a tool, so the graph store can change without rewriting the case. Which store, and how it's fed, is the second open choice.

**How do event strategies hold state at our volume?** They aggregate over windows (72 hours per device, 30 days per account) as events arrive, without re-reading history for each claim. Sizing and retention need load testing against the real claim rate; the replay is a good first test.

## 55:00–60:00 · Close: what you need from this room

**Say**: Here's what I need from you, specifically.

- **Fraud team**: own the disqualifying term list and any allow-lists, agree the review capacity for the replay, and review the flagged claims and the random sample.
- **Data science**: hold us to the measures we just went through, and help set the targets before we run anything.
- **Architecture**: settle where the vision model runs and which graph store we use, before any real receipt goes through.

Beyond this room, we're asking for an executive owner, AI Council approval of the method and a Phase 1 budget; that's in train separately.

Then ask: **what would stop you supporting this?**

**Why this order**: nobody in this room approves the budget, but everyone in it can slow the POC down or make it credible. Asking for their part first gives them a stake, and ending on a question gets their objections now, while you can still answer them.

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
2. Slides: the bridge line on slide 4 comes out naturally, and you say "illustrative" about slides 3 and 5 unprompted.
3. CLM-0841: Space pauses the sign-in; you can talk to all eight pre-flight checks in their 5 seconds each; clicking a check at rest brings its card back; Phase 1 to 3 and the outcome read as above.
4. CLM-0847 and CLM-0848: the PAID answer, word for word, and the question to the room.
5. CLM-0842: the two-stage story lands: arithmetic in pre-flight, then how it was done in Phase 1, with the score at 0.28.
6. CLM-0844 and CLM-0845: the sign-in for 0844 plays in a laptop frame; the Phase 2 and Phase 3 findings read as above.
7. The investigation screen opens from CLM-0845 and closes with its ✕; the report opens.
8. Time each section against the table, and decide in advance what you'll cut if you're behind.
9. Tuesday: the full hour on the presenting laptop and projector, at its real resolution.
