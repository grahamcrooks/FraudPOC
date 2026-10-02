# 04 Data Model

Sets the data objects and key fields for both case types, and removes duplicates Blueprint created in the earlier steps. Run it after [03](03-fraud-investigation-case-type.md).

No placeholders.

```text
Set the data model for the two case types. Create exactly the data objects below. Remove any other data objects Blueprint created in earlier steps, and merge duplicates into these. Do not create a separate Claim data object; the Claim case type holds the claim. Use Decimal for scores, DateTime for dates and times, and Boolean for flags; do not type any of them as Text.

DATA OBJECTS
- Member: the insured member. System of record: the fund's member system.
- Practice: the provider practice, including ABN and bank account.
- Practitioner: the treating practitioner, including AHPRA number.
- Receipt: the uploaded file and the raw extracted text.
- Claim Line: one service line: item code, quantity, item charge, date.
- Item Code Reference: valid item codes and descriptions.
- GeoSession: submission IP address and resolved suburb and state.
- DeviceSession: device fingerprint and app or browser profile.
- Invalid Document Keyword: terms that disqualify a document, including PAID.
- Document Marker Flag: soft markers detected in a document.
- Document Forensics Result: each forensic check with its verdict, and the receipt integrity score.
- Event Strategy Signal: strategy ID, verdict, figure and threshold.
- Member Risk Flag: watchlist entries for members, practices and practitioners.
- Network Intelligence Dossier: graph paths, fraud community and case similarity results.
- Fraud Case Library: confirmed fraud cases for similarity search.

CLAIM CASE TYPE FIELDS
Member (Member), Practice (Practice), Practitioner (Practitioner), Receipt (Receipt), Claim Lines (list of Claim Line), GeoSession (GeoSession), DeviceSession (DeviceSession), Forensics Result (Document Forensics Result), Event Strategy Signals (list of Event Strategy Signal), Network Dossier (Network Intelligence Dossier), Claim Type (Text), Service Date (Date), Total Amount (Decimal), Receipt Integrity Score (Decimal), Cross-Claim Score (Decimal), Network Score (Decimal), High Value Flag (Boolean), Invalid Document Reason (Text), Routing Path (Clean, Rejected, Referred), Routing Reason (Text), Referring Phase (Receipt Forensics, Cross-Claim Signals, Network Intelligence), Referral Queue (Investigator, SIU), Priority (HIGH, Standard), Submitted (DateTime).

FRAUD INVESTIGATION CASE TYPE FIELDS
Parent Claim (reference to Claim), Queue (Investigator, SIU), Priority (HIGH, Standard), SLA Due (DateTime), Investigator (user reference), Decision (Confirmed Fraud, False Positive, Pay), Investigator Notes (Text), Outcome Recorded (DateTime).
```

## Check when done

- Exactly 15 data objects, and no Claim data object.
- The Fraud Investigation references its parent Claim rather than repeating the claim fields.
- Scores are Decimal, dates and times DateTime, flags Boolean.
- Run the scenario table in the [design document](../../docs/blueprint/target-case-design.md#how-the-scenarios-run-through-it) against the result: each claim should have a stage where it exits with the outcome listed.
