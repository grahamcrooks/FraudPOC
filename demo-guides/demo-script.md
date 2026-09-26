# Demo Script: Fraud Detection POC

The script for presenting the fraud detection proof of concept, step by step, and for system testing it. It matches the build on the live site at <https://grahamcrooks.github.io/FraudPOC/>.

Each step has three parts:

- **Say**: the high-level story for a business audience.
- **Under the hood**: what the step does technically, for a technical audience. Where it describes Pega, it describes the intended design; everything on screen is simulated with illustrative data.
- **Check**: what should happen on screen. Use these lines as the test cases for system testing.

## Before you start

1. Open <https://grahamcrooks.github.io/FraudPOC/> and do a hard refresh (Ctrl+Shift+R, or Cmd+Shift+R on a Mac) so you have the latest build.
2. Press F for fullscreen.
3. Captions are on by default. Press C to switch them off or on. For a clean recording, add `?captions=off` to the address.
4. The sign-in scene runs at a talking pace (about 20 seconds). Add `?pace=1` to the address for a 10-second version.

### Controls

| Key | Action |
| --- | --- |
| S / D | Slides / Demo |
| ← / → or Space | Previous / next slide |
| 1 to 8 | Open scenario CLM-0841 to CLM-0848 |
| L | Replay the sign-in scene (or click the session chip in the portal header) |
| C | Captions on or off |
| R | Rolling demo on or off. Space pauses and resumes it |
| P | Step-by-step mode |
| B | Backup slide (not in rolling mode) |
| 0 | Restart: back to slide 1, claim form cleared |
| F | Fullscreen |

### The eight scenarios

| Key | Claim | Member | Where it stops | Outcome |
| --- | --- | --- | --- | --- |
| 1 | CLM-0841 | James Kowalski | Runs all three phases | Clean, sent for adjudication |
| 2 | CLM-0842 | Sarah Nguyen | Phase 1 | Tampered receipt, score 0.28, investigator queue, HIGH |
| 3 | CLM-0843 | David Okafor | Phase 2, ES-003 | Bank account ring, SIU queue, HIGH |
| 4 | CLM-0844 | Linda Pham | Phase 2, ES-002 | Device ring, SIU queue, HIGH |
| 5 | CLM-0845 | Michael Torres | Phase 3, graph | Shared practitioner, SIU queue, HIGH, investigation screen |
| 6 | CLM-0846 | Angela Wu | Phase 3, graph | Fraud ring Community #47, SIU queue, HIGH |
| 7 | CLM-0847 | Priya Raman | Pre-flight | Quotation rejected, no pipeline |
| 8 | CLM-0848 | Oliver Hartmann | Pre-flight | Genuine receipt stamped PAID, rejected, no pipeline |

## Part 1: The slides

### Slide 1: Agenda

- **Say**: Four things today: why prevention rather than recovery, sizing the problem in Bupa's own claims, what success looks like for the first phase, and what we need to get started.
- **Under the hood**: A static slide.
- **Check**: The slide shows four agenda items. Next moves to slide 2.

### Slide 2: From Detection to Prevention

- **Say**: An estimated 1 to 3% of claims contain fraud, waste or abuse, a conservative figure against a global range of 3 to 10%. Healthcare is Australia's most targeted sector for data breaches, which feeds organised fraud. Recovery happens after a claim is paid; prevention happens before. AI is what makes that shift possible.
- **Under the hood**: A static slide. Sources are cited on the slide (PKF Littlejohn / CCFS; OAIC Notifiable Data Breaches Report, Jan to Jun 2023).
- **Check**: Both source lines are visible.

### Slide 3: The Business Case for Prevention

- **Say**: The POC replays about 10,000 historical receipts, starting with Phase 1. Each receipt goes through five steps: extract, analyse, classify, route, validate. Clean claims pass; flagged claims go to an investigator, and the fraud team validates what's suspicious.
- **Under the hood**: A static slide. The outcome figures are placeholders (`[X]`, `[Z]`) until the Phase 1 results are in.
- **Check**: The placeholders show as `[X]`, `[Y]` and `[Z]`, and the note says figures are to be confirmed.

### Slide 4: One Intelligent Pipeline (the three phases)

- **Say**: Every claim passes through three layers, each answering a different question.
  - **Receipt forensics**: is this receipt real and valid? Cheap checks first: pre-flight reads the receipt once and applies business rules at no AI cost. Only receipts that clear pre-flight get the forensic analysis.
  - **Cross-claim signals**: does this claim make sense? Three event strategies compare this claim with other claims: distance from home, a shared device, a shared bank account.
  - **Network intelligence**: who else is involved? The graph follows every entity the claim touches, up to three hops, into known fraud. The alert reaches claims already closed.
  - Every signal goes to a human investigator in Pega AIM. AI assists; people decide.
- **Under the hood**:
  - Phase 1 pre-flight: one AI extraction (document type, fields, per-field confidence), then business rules (disqualifying terms, completeness, claim value).
  - Phase 1 forensic analysis: six checks, three AI and three rule-based, scored into a receipt integrity score.
  - Phase 2: Pega Event Strategies, which aggregate events over time windows: ES-001 distance anomaly, ES-002 device ring, ES-003 bank account ring.
  - Phase 3: graph traversal through an MCP connection to the graph, up to three hops across member, practice, practitioner, device, submission IP and payment account.
  - Planned and not in this build: phantom ABN, waiver abuse, item code validation (Phase 2), and fraud case similarity matching (Phase 3).
- **Check**:
  - There are no signal counts on any column.
  - Phase 1 shows two sub-headings: pre-flight, and forensic analysis.
  - Phase 2 and Phase 3 each end with an italic "planned" line.
  - At 1366×768 all three columns fit without clipping.

### Slide 5: Powered by Pega

- **Say**: Why Pega. The AI runs inside governed case management rather than bolted on, at flat per-case cost with no AI token tax. Claims management is a named critical operation under APRA CPS 230, and the platform provides the audit trail and human oversight it requires.
- **Under the hood**: A static slide. Launch Demo opens the claim portal.
- **Check**: Launch Demo opens the portal on CLM-0841 and the sign-in scene starts.

### Backup slide (B): What "Three Hops" Actually Means

- **Say**: Use only if asked. This is the entity model Phase 3 is designed against. It is the target schema, not a claim that it's already running.
- **Under the hood**: Relationship types: CURRENT_DEVICE, CURRENT_ACCOUNT, SHARED_DEVICE_WITH, SHARED_ACCOUNT_WITH, IS_MEMBER_OF. The slide traces CLM-2024-0846 through a device and a bank account to a confirmed fraud claim and Community #47.
- **Check**: The B key opens it (not in rolling mode). "Back to Presentation" returns to slide 5.

## Part 2: The process, step by step (CLM-0841)

Walk through CLM-0841 in full the first time: it's the clean baseline and runs every step. For the other scenarios, spend time only on the step where each one stops (Part 3).

### Step 1: Sign-in and session capture

- **Say**: Before there's a claim, there's a session. James signs in to the H+ app with Face ID. Three signals are captured right there: the device, the location, and the time. None of them is judged yet; they travel with the claim and are used in Phase 2.
- **Under the hood**:
  - At sign-in the platform records the device fingerprint, the submission IP and its geolocation, and the session time.
  - In Pega these are stored on the Claim as two embedded data objects:
    - `GeoSession`: `SubmissionIPAddress`, `IPGeoLatitude` / `IPGeoLongitude`, VPN and hosting-range flags.
    - `DeviceSession`: `DeviceFingerprintID`, device type, app version, fingerprint method.
  - ES-001 uses the geolocation; ES-002 aggregates on `DeviceFingerprintID`.
  - The device is marked recognised (used by this member before) or new. A new device is a signal in its own right.
- **Check**:
  - The scene is labelled "Simulated".
  - The phone shows the sign-in, then Face ID, then "Verified", then "Welcome back, James."
  - Three boxes rise one at a time, aligned: Device (DEV-2291 · H+ App v4.2 (iOS)), Location (Carlton VIC · 203.0.113.18), Session (12 Jul 2026, 09:14 AEST). Each has a caption and a line saying what it's used for.
  - The phone shrinks to the header, and the boxes land in the session chip: 📱 DEV-2291 ✓ recognised device · 📍 Carlton VIC · 🕒 09:14 AEST.
  - Pressing L replays the scene.

### Step 2: The claim portal

- **Say**: The claimant, James, is now in the H+ member portal. The policy, claims history and member details are on the left, and the session the claimant signed in with is in the header.
- **Under the hood**:
  - The portal is the member's view of the Claim case.
  - Member data (membership number, suburb, policy) comes from the Member record.
  - In Pega, ES-001 needs the member's registered address as coordinates (`RegisteredAddressLatitude` / `RegisteredAddressLongitude`).
- **Check**:
  - The portal shows MBR-33291, Carlton VIC 3053, POL-2021-44210, Gold Hospital + Extras.
  - The session chip matches Step 1.
  - The claim card has two numbered panels: 1 · Receipt (upload and pre-flight) and 2 · Member-Entered Receipt (the form).

### Step 3: Upload and pre-flight

- **Say**: The claimant uploads a dental receipt. Before any expensive analysis, pre-flight asks one question: is this a claimable receipt at all? AI reads it once, and then business rules do the rest at no AI cost. A quotation, a proforma or an unpaid invoice stops here.
- **Under the hood**: Seven checks in order, over about 10 seconds. Each shows what it looked at, the rule, what it found and its conclusion, plus a cost badge.

  | Check | Cost | Rule |
  | --- | --- | --- |
  | Receipt type | AI call | Must be a tax invoice from a registered health provider |
  | Field extraction | AI call | Extract provider, ABN, service date, line items and total |
  | Extraction confidence | AI call | Every critical field at or above 0.70, or the claim goes to human review |
  | Disqualifying content | Business rule | 11 disqualifying terms, for example non-medical, quotation, proforma, the PAID stamp |
  | Receipt completeness | Business rule | Paid in full, valid tax invoice, itemised, signed |
  | Claim value | Business rule | Flag at $5,000 or above |
  | Device and location | Capture | Recorded for later evaluation; no verdict |

  Routing: any fail sends the claim to **Reject Document** (Resolved-Rejected). Any flag sends it to **Needs Review** (Pending-Review). All passes open the pipeline. The claim form fields fill from the extraction.
- **Check**:
  - Each check opens while it runs and closes to a one-line summary when the next starts. At rest they show in two columns.
  - All seven pass for CLM-0841. The capture reads "DEV-2291 · Carlton VIC · captured at sign-in".
  - The summary line reads "6 of 6 checks passed · 3 AI calls · 3 business rules · 1 capture recorded".
  - The file card reads "Validated · Pre-flight complete", and "Run Fraud Detection →" appears.

### Step 4: Phase 1, receipt forensics

- **Say**: The receipt is claimable. Now: is it genuine, and does it match what James keyed in? Six forensic checks look for spliced text, overlays, AI-generated images, a suspicious authoring trail and duplicates. The score starts at 1.00 and only adverse findings take points off. James's receipt has none.
- **Under the hood**:

  | Check | Cost | Rule |
  | --- | --- | --- |
  | Claim-to-receipt match | Business rule | Amount, provider, service date and item codes must all match |
  | Font consistency | AI call | A genuine receipt prints in one typeface |
  | Colour and stamp analysis | AI call | Digital overlays leave colour discontinuities |
  | AI-generated detection | AI call | Generative signature score at or below 0.15 |
  | Metadata and provenance | Business rule | Practice software, and timestamps not after the service |
  | Duplicate detection | Business rule | Same practice and receipt number, or identical fingerprint |

  Receipt integrity score:
  - It starts at 1.00, with deductions for adverse findings only: match flag −0.07, font fail −0.40, metadata fail −0.25.
  - At or above 0.70 continues; below 0.70 goes to the investigator queue at HIGH priority with a 4-hour SLA.
  - Extraction confidence is not scored here. A low-confidence field is already routed to Needs Review in pre-flight.
  - The total is computed from the lines above it, never typed in.
- **Check**:
  - The six checks run about 2.8 seconds apart.
  - The score block lists every check at −0.00, with a total of **1.00** and "Threshold 0.70 — No adverse findings".
  - The result badge reads "Phase 1 Passed — No Adverse Findings".
  - If the panel is taller than the screen, the passing checks close at rest (measured, so this happens at 1080p and below). Their summary lines still carry the figures.
  - "Continue to Phase 2 — Cross-Claim Signals →" appears.

### Step 5: Phase 2, cross-claim signals

- **Say**: A clean receipt isn't a clean claim. Every Phase 1 check looked at this claim on its own. Phase 2 compares it with every other claim: is it lodged far from home, is the device shared by unrelated members, is the bank account shared by unrelated practices? Each strategy either raises a signal or it doesn't.
- **Under the hood**:
  - Pega Event Strategies run in real time over time windows. All three are business rules with no AI cost.
    - **ES-001 distance anomaly**: the distance between the submission IP geolocation and the registered address. Graded: over 500 km moderate, over 1,500 km high, overseas critical.
    - **ES-002 device ring**: distinct members on one `DeviceFingerprintID` in 72 hours. Three or more unrelated members fires. Members sharing a membership and address are a household, not a ring.
    - **ES-003 bank account ring**: distinct practice ABNs paying into one account in 30 days. Three or more fires.
  - Planned and not built: phantom ABN, waiver abuse, item code validation.
- **Check**:
  - Three checks run 6 seconds apart, in a single column, all "Business rule — no AI cost".
  - CLM-0841 results: 0.4 km from home, 1 member on the device, 1 practice on the account.
  - The block reads "Signals raised 0 of 3" and "No signal raised. Continuing to Phase 3."
  - The italic planned line shows under the checks.

### Step 6: Phase 3, network intelligence

- **Say**: The last question: who else is involved? The graph follows everything this claim touches (member, practice, practitioner, device, IP, payment account) up to three hops out, looking for known fraud or anything under investigation. No single claim contains this kind of connection, which is why the earlier phases can't see it. For James, the graph is clear.
- **Under the hood**:
  - One check, P3-GRAPH, an AI call, run as a graph query through MCP (tagged "MCP · Graph").
  - Rule: any path within 3 hops to a confirmed fraud community or an entity under investigation.
  - An alert attaches to the entity, so it reaches every claim linked to it, including ones already closed.
  - Fraud case similarity matching is planned. It needs a corpus of confirmed cases, which this system produces as it runs.
- **Check**:
  - One check: "0 connections within 3 hops", pass.
  - The planned similarity line shows.
  - The block reads "Signals raised 0 of 1" and "No connections to known fraud or to anything under investigation. Claim approved and sent for adjudication."

### Step 7: Outcome and routing

- **Say**: James's claim goes to normal adjudication. Nothing was flagged, and every check is recorded for audit.
- **Under the hood**: The fraud detection summary lists each phase's result. A suspicious claim opens an investigation in Pega AIM:
  - The case is routed to a work queue with a priority and SLA.
  - The evidence package is assembled into one screen.
  - The investigator briefing is drafted by a Pega agent for a person to review.
- **Check**:
  - The summary shows all three phases passed.
  - The heading reads "Fraud Detection — No Suspicious Activity", with "Sent for Claim Adjudication".

## Part 3: The other scenarios

For each one, run the steps as in Part 2 and slow down only at the step where it stops.

### CLM-0842, Sarah Nguyen: tampered receipt (stops in Phase 1)

- **Say**: Sarah's optical receipt looks fine at a glance and passes pre-flight. Forensics finds three typefaces spliced into the amount and date, and a file made in Photoshop two days after the service. The claimant also keyed $42.50 more than the receipt shows. No single finding is conclusive; together they take the score to 0.28.
- **Under the hood**:
  - Match flag −0.07: keyed $487.50 against a receipt of $445.00.
  - Font fail −0.40: Arial 9pt, Helvetica 10pt and Times New Roman 8pt.
  - Metadata fail −0.25: Adobe Photoshop, modified 16 Jul 2026.
  - 1.00 − 0.72 = 0.28, below 0.70. The Phase 2 checks show as not run.
- **Check**:
  - Deductions are listed largest first. The total is 0.28, "below · SUSPICIOUS".
  - The flag and both fails stay open; passes may close.
  - A discrepancy panel shows Member Entered $487.50, Receipt Shows $445.00, a $42.50 difference.
  - The claim is routed to the investigator queue, HIGH, 4-hour SLA. Phases 2 and 3 do not run.

### CLM-0843, David Okafor: bank account ring (stops in Phase 2, ES-003)

- **Say**: David's physio receipt is genuine and the claim is ordinary. But four unrelated practices have been paid into the same bank account in 22 days, and the account name matches none of them.
- **Under the hood**:
  - ES-003 aggregates payment accounts over 30 days.
  - It found Active Rehab Centre, Southbank Physio Rooms, Westgate Allied Health and Keilor Road Physio, all paying into BSB 083-147 / 441820937. Four is above the threshold of three.
  - ES-001: about 26 km from home (Richmond to Dandenong). ES-002: clear.
- **Check**:
  - The block reads "Signals raised 1 of 3".
  - The action line: the claim is marked suspicious and referred to AIM, and a network assessment is raised against the account.
  - The claim goes to the SIU queue, HIGH. Phase 3 does not run.

### CLM-0844, Linda Pham: device ring (stops in Phase 2, ES-002)

- **Say**: Linda's claim is lodged through the H+ website on a Windows laptop the claimant has never used before. Five unrelated members have lodged from that laptop in 26 hours. This claim is the one that tips it over the threshold. The four earlier claims were cleared, because until now there was no pattern to see.
- **Under the hood**:
  - The session is `Web · Chrome (Windows)` on a new device, DEV-1196, in Footscray. Linda's registered address is in Springvale.
  - ES-002 found 5 distinct members on DEV-1196 in 26 hours: different surnames, addresses and policies.
  - Two things happen with different scopes. This claim is referred. Separately, a network assessment is raised against the device, covering the four earlier claims.
- **Check**:
  - The sign-in plays in a laptop browser frame, with a one-time code instead of Face ID and the H+ member website. The label reads "Simulated".
  - The chip shows 💻 DEV-1196 ⚠ new device.
  - The block reads "Signals raised 1 of 3". The action line states the claim outcome and the device assessment separately.
  - The claim goes to the SIU queue, HIGH. Phase 3 does not run.

### CLM-0845, Michael Torres: shared practitioner (stops in Phase 3)

- **Say**: Michael's optical claim clears forensics and all three strategies. But the optometrist on the claim at ClearView Optometry also bills through two practices already under investigation. The risk isn't in the claim; it's in who delivered the service.
- **Under the hood**:
  - P3-GRAPH found a 2-hop path: member MBR-29034 → ClearView Optometry → optometrist PR-5518.
  - PR-5518 also bills through Northgate Eyecare (INV-2024-0612) and Riverbend Optical (INV-2024-0688), both under investigation.
  - Routed to the SIU queue, HIGH, 4-hour SLA.
  - The investigation screen assembles the evidence package, with the path drawn out.
- **Check**:
  - The block reads "Signals raised 1 of 1".
  - The fraud summary shows "Open Alert & Investigation Manager".
  - The investigation screen shows:
    - Phase 3 as "Flagged — Shared Practitioner".
    - The path chain, with the two practices marked under investigation.
    - Four evidence lines.
    - The italic planned-similarity note.
    - An investigator briefing.

### CLM-0846, Angela Wu: fraud ring (stops in Phase 3)

- **Say**: Angela's claim is clean on its own and clears both earlier phases. But the graph traces it three hops through a shared submission IP into Community #47: a confirmed fraud ring of 14 members and 3 providers.
- **Under the hood**:
  - P3-GRAPH found a 3-hop path: submission IP 203.0.113.91 → Provider ABC → confirmed fraud member MBR-99112, in Community #47.
  - Phase 2 saw nothing, because no single claim contains this connection.
  - The backup slide shows the same pattern as a schema.
- **Check**:
  - The block reads "Signals raised 1 of 1" and "3-hop path into Community #47 — 14 members, 3 providers".
  - The claim goes to the SIU queue, HIGH.

### CLM-0847, Priya Raman: quotation (stops in pre-flight)

- **Say**: Priya uploads what looks like a dental invoice. It's a treatment plan and quotation for work the claimant hasn't had done, and nothing has been paid. Pre-flight catches it with business rules, so no forensic AI is spent and nothing reaches the fraud team. This is the case for cheap checks first.
- **Under the hood**:
  - The first four checks pass: the layout reads as a receipt, 11 of 11 fields, confidence 0.94.
  - Disqualifying content fails: "treatment plan and quotation" in the header and "this is not a tax invoice" in the footer, 2 of 11 terms.
  - Receipt completeness fails: $0.00 paid of $448.00, not signed.
  - Any fail routes to Reject Document.
- **Check**:
  - There are two FAIL badges. The panel reads "Claim rejected — not a claimable receipt".
  - The stage is Reject Document and the status Resolved-Rejected.
  - The note reads "No forensic AI calls were spent on this claim".
  - Run Fraud Detection does not appear, and the pipeline never opens.

### CLM-0848, Oliver Hartmann: already paid (stops in pre-flight)

- **Say**: Oliver uploads a genuine physio receipt. It's authentic in every respect: the practitioner signed it, the ABN is valid and nothing has been altered. But the practice has stamped it PAID, so the account is already settled and there is nothing left to claim. That's a property of the document, readable from the page, so a business rule catches it in pre-flight at no AI cost.
- **Under the hood**:
  - Five checks pass: the physio receipt layout, 11 of 11 fields, confidence 0.93, complete and paid, $270.00 claimable.
  - Disqualifying content fails: the PAID stamp across the services table, 1 of 11 terms. The rule matches the stamp, not the word "paid" wherever it occurs, so "amount paid", "paid in full", "unpaid" and "prepaid" don't trigger it.
  - The receipt has no forensic finding, and that matters: the document is genuine, it just isn't claimable.
  - Any fail routes to Reject Document.
- **Check**:
  - There is one FAIL badge, on Disqualifying content. The panel reads "Claim rejected — nothing to claim" with the reason "Receipt is stamped PAID · the account is already settled".
  - The stage is Reject Document and the status Resolved-Rejected.
  - The note reads "The receipt is genuine and complete. It simply isn't claimable."
  - Run Fraud Detection does not appear, and the pipeline never opens.

## Part 4: Rolling demo

- **Say**: Nothing; it runs unattended, for a stand or a video.
- **Under the hood**:
  - R starts it: the slides advance once, then the eight scenarios loop.
  - Each scenario shows a preview banner, then runs end to end with captions.
  - Phases pause 5.5 seconds between each other, and the demo holds on each outcome before moving on.
  - Scenarios with a sign-in scene (CLM-0841, CLM-0844) take about 14 seconds longer.
- **Check**:
  - For CLM-0841: Phase 2 starts at about 57 seconds, Phase 3 at about 80 seconds, and the outcome at about 93 seconds.
  - CLM-0847 and CLM-0848 each hold on the reject panel for about 9 seconds. After CLM-0847 comes CLM-0848, then CLM-0841.
  - Space pauses and resumes. There are no console errors.

## Known limitations

- **Captions** exist for CLM-0841, CLM-0844, CLM-0847 and CLM-0848 only. The other scenarios show none. CLM-0848 has two: one on the failing check and one on the outcome.
- **Simulated data**: every scenario is simulated with illustrative data. Names, numbers and addresses are fictional.
- **CLM-0846's path** passes through "Provider ABC", a placeholder name.
- **The claim-to-receipt mismatch weight** (−0.07) is small. A mismatch on an otherwise genuine receipt would still score 0.93 and pass. How a mismatch should be routed on its own is still to be decided.
- **Older guides**: the complete, presenter and technical guides are out of date. This script replaces them for running the demo.
