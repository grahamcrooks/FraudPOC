# 02 Claim Case Type

Adds the Claim case type: six primary stages and two alternate stages. Run it after [01](01-application-context.md).

No placeholders.

```text
Add a case type called Claim. It is created for every claim submission. Create exactly the stages and steps below, with the names exactly as written, in this order. Do not add stages or steps that are not listed. The claim stops at the first phase that refers it: a claim referred in Receipt Forensics does not run Cross-Claim Signals or Network Intelligence.

Stage 1: Submission
- Submit Claim (user step, Member): claim form with member number, claim type, service date, practice, practitioner, repeating line items (item code, quantity, item charge, date), total amount (calculated) and receipt upload.
- Capture Session (automation): record the submission IP address, resolved suburb and state, device fingerprint and app or browser profile.

Stage 2: Pre-flight
- Extract Receipt (AI step): read the receipt and populate the claim fields, each with a confidence score.
- Check Extraction Confidence (automation): every critical field at or above 0.70. If any is below, run Review Extracted Data.
- Review Extracted Data (user step, Claims Administrator): conditional, only when a critical field is below 0.70.
- Classify Document (automation): receipt, tax invoice, quotation, estimate or statement. A receipt or tax invoice continues; a quotation, estimate or statement goes to the Rejected stage.
- Check Disqualifying Content (automation): match the invalid document keyword list, including a PAID stamp matched on word boundaries. A match goes to the Rejected stage with the reason recorded.
- Check Completeness (automation): provider, practitioner, service date, line items and amount paid are present. Incomplete goes to the Rejected stage.
- Reconcile Line Items (automation): line fees add up to the total charged, allowing for printed adjustments. A mismatch does not reject the claim; it is flagged and the claim continues to Receipt Forensics.
- Link Practice and Practitioner (automation): match to practice and practitioner reference data.
- Record Claim Value (automation): flag claims of $5,000 or above as high value. Context only; never routes the claim.

Stage 3: Receipt Forensics
- Run Document Forensics (automation): metadata and provenance, font consistency, colour and stamp analysis, AI-generated detection and duplicate detection, each recorded with a verdict.
- Generate Forensic Narrative (AI step): conditional, only when the receipt integrity score is below threshold. Plain-English summary of the findings for the investigator.
- Score Receipt Integrity (decision): a receipt integrity score below threshold, or any failed forensic check, refers the claim with referring phase Receipt Forensics, queue Investigator, priority HIGH, and goes to the Referred stage.

Stage 4: Cross-Claim Signals
- Collect Event Strategy Signals (automation): read one signal per event strategy. The strategies run in Pega event strategies on the claim and session stream, not as case steps:
  ES-001 Distance Anomaly: submission location 500 km or more from the registered address.
  ES-002 Device Ring: 5 or more distinct members submitting from one device in the last 72 hours.
  ES-003 Bank Account Ring: 3 or more distinct practice ABNs paying into one bank account in the last 30 days.
  ES-004 Phantom ABN: billing practice ABN cancelled, deregistered, invalid or registered to another entity.
  ES-005 Waiver Abuse: repeated waiting-period waivers for one member, or practice claim volume at 3 times its 90-day baseline.
- Score Cross-Claim Risk (decision): any signal refers the claim with referring phase Cross-Claim Signals, queue SIU, priority HIGH, and goes to the Referred stage.

Stage 5: Network Intelligence
- Check Watchlist (automation): member, practice and practitioner against active risk flags.
- Traverse Network Graph (automation): any path within 3 hops to a confirmed fraud community or a monitored entity, via the graph database.
- Search Fraud Case Library (AI step): comparable confirmed cases using Knowledge Buddy, cited by case reference. A similarity result never routes a claim on its own.
- Score Network Risk (decision): a path to a confirmed fraud community refers the claim with queue SIU, priority HIGH; two or more weak signals refer it with queue Investigator, priority Standard. Either sets referring phase Network Intelligence and goes to the Referred stage.

Stage 6: Decision
- Confirm Clean (automation): record the routing reason, send the claim for adjudication and resolve the case as Resolved-Clean.

Alternate stage: Rejected
- Notify Member (automation): tell the member why the claim cannot be accepted.
- Resolve Rejected (automation): resolve the case as Resolved-Rejected.

Alternate stage: Referred
- Create Fraud Investigation (automation): placeholder for now; the Fraud Investigation case type is added in the next step.
- Wait for Investigation (wait step): until the Fraud Investigation resolves.
- Resolve Referred (automation): resolve the case with the investigation outcome.
```

## Check before step 03

- Six primary stages, named exactly: Submission, Pre-flight, Receipt Forensics, Cross-Claim Signals, Network Intelligence, Decision. These are the names on the demo's status strip.
- Two alternate stages: Rejected and Referred.
- No GEO-001 to GEO-006 steps, and the five event strategies are inside one step, not five.
- Review Extracted Data and Generate Forensic Narrative are conditional.
- Delete any stage or step Blueprint added that isn't listed.
