# Blueprint Case Design

Builds the target case design in Pega GenAI Blueprint: a Claim case of six stages and a Fraud Investigation child case of three, with the data objects and personas they need. Paste it into a new Blueprint, or into the existing one as an instruction to restructure it. The design, and why it differs from the current Blueprint, is in [`docs/blueprint/target-case-design.md`](../docs/blueprint/target-case-design.md).

Placeholders:

- `{{organisation_name}}`: the organisation name shown in the Blueprint's application context.

After Blueprint generates the design, check it against the scenario table in the design document. Blueprint tends to add stages and steps of its own. Remove any that aren't listed here, and keep the stage names exactly as written, because the demo's status strip uses the same names.

```text
Restructure this application to the case design below. Replace the existing case types (Fraud Investigation as parent, Claim Validation, Network Intelligence Assessment) with exactly two case types. Do not add stages or steps that are not listed. Use the stage and step names exactly as written.

APPLICATION CONTEXT
Organisation: {{organisation_name}}. Location: Australia. Industry: Healthcare Insurance (Payer). Department: Claims Operations.
Real-time fraud detection for extras claims (dental, optical, physiotherapy). Every claim passes through three phases of analysis: Phase 1 receipt forensics (is the receipt genuine?), Phase 2 cross-claim signals (does the claim fit a pattern across other claims?) and Phase 3 network intelligence (is the claim connected to known fraud or an organised ring?). Clean claims go to adjudication; suspicious claims are referred to an investigator or the Specialist Investigation Unit (SIU) with a complete evidence package.

PERSONAS
- Member: submits claims.
- Claims Administrator: reviews receipt extractions with low confidence.
- Investigator: works fraud investigations in the Investigator queue.
- SIU Analyst: works fraud investigations in the SIU queue.
Practice, Practitioner and Patient are data, not personas.

CASE TYPE 1: CLAIM
Created for every claim submission. The claim stops at the first phase that refers it: a claim referred in Receipt Forensics does not run Cross-Claim Signals or Network Intelligence.

Stage 1: Submission
- Submit Claim (user step, Member): claim form with member number, claim type, service date, practice, practitioner, repeating line items (item code, quantity, item charge, date), total amount (calculated) and receipt upload.
- Capture Session (automation): record the GeoSession (IP address, resolved suburb and state) and DeviceSession (device fingerprint, app or browser profile).

Stage 2: Pre-flight
- Extract Receipt (AI step): read the receipt and populate the claim fields, each with a confidence score.
- Check Extraction Confidence (automation): every critical field at or above 0.70. If any is below, run Review Extracted Data.
- Review Extracted Data (user step, Claims Administrator): conditional, only when a critical field is below 0.70.
- Classify Document (automation): receipt, quotation, estimate or statement. Anything other than a receipt goes to the Rejected stage.
- Check Disqualifying Content (automation): match the Invalid Document Keyword list, including a PAID stamp matched on word boundaries. A match goes to the Rejected stage with the reason recorded.
- Check Completeness (automation): provider, practitioner, service date, line items and amount paid are present. Incomplete goes to the Rejected stage.
- Reconcile Line Items (automation): line items add up to the total. A mismatch does not reject the claim; it is flagged and the claim continues to Receipt Forensics.
- Link Practice and Practitioner (automation): match to Practice and Practitioner reference data.
- Record Claim Value (automation): set High Value Flag at $5,000 or above. Context only; never routes the claim.

Stage 3: Receipt Forensics
- Run Document Forensics (automation): metadata and provenance, font consistency, colour and stamp analysis, AI-generated detection and duplicate detection, each recorded in Document Forensics Result with a verdict.
- Generate Forensic Narrative (AI step): conditional, only when the receipt integrity score is below threshold. Plain-English summary of the findings for the investigator.
- Score Receipt Integrity (decision): Receipt Integrity Score below threshold, or any failed forensic check, sets Referring Phase to Receipt Forensics, queue Investigator, priority HIGH, and goes to the Referred stage.

Stage 4: Cross-Claim Signals
- Collect Event Strategy Signals (automation): read one Event Strategy Signal per strategy. The strategies run in Pega event strategies on the claim and session stream, not as case steps:
  ES-001 Distance Anomaly: submission location 500 km or more from the registered address.
  ES-002 Device Ring: 5 or more distinct members submitting from one device in the last 72 hours.
  ES-003 Bank Account Ring: 3 or more distinct practice ABNs paying into one bank account in the last 30 days.
  ES-004 Phantom ABN: billing practice ABN cancelled, deregistered, invalid or registered to another entity.
  ES-005 Waiver Abuse: repeated waiting-period waivers for one member, or practice claim volume at 3 times its 90-day baseline.
- Score Cross-Claim Risk (decision): any signal sets Referring Phase to Cross-Claim Signals, queue SIU, priority HIGH, and goes to the Referred stage.

Stage 5: Network Intelligence
- Check Watchlist (automation): member, practice and practitioner against active Member Risk Flags.
- Traverse Network Graph (automation): any path within 3 hops to a confirmed fraud community or a monitored entity, via the graph database.
- Search Fraud Case Library (AI step): comparable confirmed cases from the Fraud Case Library using Knowledge Buddy, cited by case reference. A similarity result never routes a claim on its own.
- Score Network Risk (decision): a path to a confirmed fraud community sets queue SIU, priority HIGH; two or more weak signals set queue Investigator, priority standard. Either sets Referring Phase to Network Intelligence and goes to the Referred stage. Results are stored in the Network Intelligence Dossier.

Stage 6: Decision
- Confirm Clean (automation): record the routing reason, send the claim for adjudication and resolve the case as Resolved-Clean.

Alternate stage: Rejected
- Notify Member (automation): tell the member why the claim cannot be accepted.
- Resolve as Resolved-Rejected.

Alternate stage: Referred
- Create Fraud Investigation (automation): create a Fraud Investigation child case with the referring phase, queue and priority.
- Wait for Investigation (wait step): until the Fraud Investigation resolves.
- Resolve with the investigation outcome.

CASE TYPE 2: FRAUD INVESTIGATION
A child case of the Claim, created only when a claim is referred. It references the parent Claim and does not copy its data.

Stage 1: Triage
- Route to Queue (automation): Investigator queue or SIU queue, as set by the referring phase.
- Set Priority and SLA (automation): HIGH priority has a 4-hour SLA.

Stage 2: Investigate
- Review Evidence (user step, Investigator or SIU Analyst): the claim, the receipt, every check with its verdict, the forensic narrative and the network dossier.
- Request Information (user step, optional): from the member or the practice.
- Escalate to SIU (user step, optional, Investigator): move the case to the SIU queue.

Stage 3: Outcome
- Record Decision (user step, Investigator or SIU Analyst): Confirmed Fraud, False Positive or Pay, with notes.
- Feed Back Outcome (automation): add confirmed cases to the Fraud Case Library and the network graph; record false positives for threshold tuning.

DATA OBJECTS
Member (system of record: the fund's member system), Practice (including ABN and bank account), Practitioner (including AHPRA number), Receipt (file and raw extracted text), Claim Line, Item Code Reference, GeoSession, DeviceSession, Invalid Document Keyword, Document Marker Flag, Document Forensics Result, Event Strategy Signal (strategy ID, verdict, figure, threshold), Member Risk Flag, Network Intelligence Dossier, Fraud Case Library.
Do not create a separate Claim data object; the Claim case type holds the claim.

KEY FIELDS
Claim: Receipt Integrity Score (Decimal), Cross-Claim Score (Decimal), Network Score (Decimal), High Value Flag (Boolean), Invalid Document Reason (Text), Routing Path (Clean, Rejected, Referred), Routing Reason (Text), Referring Phase (Receipt Forensics, Cross-Claim Signals, Network Intelligence), Referral Queue (Investigator, SIU), Priority (HIGH, Standard), Submitted (DateTime).
Fraud Investigation: Parent Claim (reference), Queue, Priority, SLA Due (DateTime), Investigator (user reference), Decision (Confirmed Fraud, False Positive, Pay), Investigator Notes (Text), Outcome Recorded (DateTime).
Use Decimal for scores, DateTime for dates and times, and Boolean for flags.
```
