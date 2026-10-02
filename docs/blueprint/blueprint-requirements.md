# Health Claim Fraud Detection: Requirements

## Application context

- Application name: Health Claim Fraud Detection
- Organisation: H+ Health Insurance Co
- Location: Australia
- Industry: Healthcare; subsegment: Healthcare Insurance (Payer)
- Department: Claims Operations
- Language: English

Real-time fraud detection for health insurance claims. The first release covers extras claims (dental, optical, physiotherapy). The design must extend to other claim types, such as ambulance, without changing the case structure: a new claim type adds reference data and checks, not new stages.

Every claim passes through three phases of analysis:

- Phase 1 receipt forensics: is the receipt genuine?
- Phase 2 cross-claim signals: does the claim fit a pattern across other claims?
- Phase 3 network intelligence: is the claim connected to known fraud or an organised ring?

Clean claims go to adjudication. Suspicious claims are referred to an investigator or the Specialist Investigation Unit (SIU) with a complete evidence package.

The application has exactly two case types: Claim and Fraud Investigation. Fraud Investigation is a child case of Claim. Use the stage and step names exactly as written in this document, and do not add stages or steps that are not listed.

## Personas

Exactly four personas:

| Persona | Role |
| --- | --- |
| Member | Submits claims through the web portal and mobile app |
| Claims Administrator | Reviews receipt extractions with low confidence |
| Investigator | Works fraud investigations in the Investigator queue |
| SIU Analyst | Works fraud investigations in the SIU queue |

Practice, Practitioner and Patient are data, not personas.

## Case type 1: Claim

Created for every claim submission. Six primary stages and two alternate stages. The claim stops at the first phase that refers it: a claim referred in Receipt Forensics does not run Cross-Claim Signals or Network Intelligence.

### Stage 1: Submission

| Step | Type | Description |
| --- | --- | --- |
| Submit Claim | User step, Member | Claim form: member number, claim type, service date, practice, practitioner, repeating line items (item code, quantity, item charge, date), total amount (calculated) and receipt upload |
| Capture Session | Automation | Records the GeoSession (IP address, resolved suburb and state) and DeviceSession (device fingerprint, app or browser profile) |

### Stage 2: Pre-flight

| Step | Type | Description |
| --- | --- | --- |
| Extract Receipt | AI step | Reads the receipt and populates the claim fields, each with a confidence score |
| Check Extraction Confidence | Automation | Every critical field at or above 0.70. If any is below, run Review Extracted Data |
| Review Extracted Data | User step, Claims Administrator | Conditional: only when a critical field is below 0.70 |
| Classify Document | Automation | Receipt, quotation, estimate or statement. Anything other than a receipt goes to the Rejected stage |
| Check Disqualifying Content | Automation | Matches the Invalid Document Keyword list, including a PAID stamp matched on word boundaries. A match goes to the Rejected stage with the reason recorded |
| Check Completeness | Automation | Provider, practitioner, service date, line items and amount paid are present. Incomplete goes to the Rejected stage |
| Reconcile Line Items | Automation | Line items add up to the total. A mismatch does not reject the claim; it is flagged and the claim continues to Receipt Forensics |
| Link Practice and Practitioner | Automation | Matches to Practice and Practitioner reference data |
| Record Claim Value | Automation | Sets High Value Flag at $5,000 or above. Context only; never routes the claim |

### Stage 3: Receipt Forensics

| Step | Type | Description |
| --- | --- | --- |
| Run Document Forensics | Automation | Metadata and provenance, font consistency, colour and stamp analysis, AI-generated detection and duplicate detection, each recorded in Document Forensics Result with a verdict |
| Generate Forensic Narrative | AI step | Conditional: only when the receipt integrity score is below threshold. Plain-English summary of the findings for the investigator |
| Score Receipt Integrity | Decision | A receipt integrity score below threshold, or any failed forensic check, refers the claim: referring phase Receipt Forensics, queue Investigator, priority HIGH; goes to the Referred stage |

### Stage 4: Cross-Claim Signals

| Step | Type | Description |
| --- | --- | --- |
| Collect Event Strategy Signals | Automation | Reads one Event Strategy Signal per strategy (table below). The strategies run in Pega event strategies on the claim and session stream, not as case steps |
| Score Cross-Claim Risk | Decision | Any signal refers the claim: referring phase Cross-Claim Signals, queue SIU, priority HIGH; goes to the Referred stage |

| ID | Event strategy | Rule |
| --- | --- | --- |
| ES-001 | Distance Anomaly | Submission location 500 km or more from the registered address |
| ES-002 | Device Ring | 5 or more distinct members submitting from one device in the last 72 hours |
| ES-003 | Bank Account Ring | 3 or more distinct practice ABNs paying into one bank account in the last 30 days |
| ES-004 | Phantom ABN | Billing practice ABN cancelled, deregistered, invalid or registered to another entity |
| ES-005 | Waiver Abuse | Repeated waiting-period waivers for one member, or practice claim volume at 3 times its 90-day baseline |

### Stage 5: Network Intelligence

| Step | Type | Description |
| --- | --- | --- |
| Check Watchlist | Automation | Member, practice and practitioner against active Member Risk Flags |
| Traverse Network Graph | Automation | Any path within 3 hops to a confirmed fraud community or a monitored entity, via the graph database |
| Search Fraud Case Library | AI step | Comparable confirmed cases from the Fraud Case Library using Knowledge Buddy, cited by case reference. A similarity result never routes a claim on its own |
| Score Network Risk | Decision | A path to a confirmed fraud community refers the claim with queue SIU, priority HIGH; two or more weak signals refer it with queue Investigator, priority Standard. Either sets referring phase Network Intelligence and goes to the Referred stage. Results are stored in the Network Intelligence Dossier |

### Stage 6: Decision

| Step | Type | Description |
| --- | --- | --- |
| Confirm Clean | Automation | Records the routing reason, sends the claim for adjudication and resolves the case as Resolved-Clean |

### Alternate stage: Rejected

| Step | Type | Description |
| --- | --- | --- |
| Notify Member | Automation | Tells the member why the claim cannot be accepted |
| Resolve Rejected | Automation | Resolves the case as Resolved-Rejected |

### Alternate stage: Referred

| Step | Type | Description |
| --- | --- | --- |
| Create Fraud Investigation | Automation | Creates a Fraud Investigation child case, passing the referring phase, queue and priority |
| Wait for Investigation | Wait step | Until the Fraud Investigation resolves |
| Resolve Referred | Automation | Resolves the case with the investigation outcome |

## Case type 2: Fraud Investigation

A child case of Claim, created only when a claim is referred. It references its parent Claim and does not copy the claim's data. Three stages.

### Stage 1: Triage

| Step | Type | Description |
| --- | --- | --- |
| Route to Queue | Automation | Investigator queue or SIU queue, as set by the referring phase on the parent Claim |
| Set Priority and SLA | Automation | HIGH priority has a 4-hour SLA; Standard priority uses the standard SLA |

### Stage 2: Investigate

| Step | Type | Description |
| --- | --- | --- |
| Review Evidence | User step, Investigator or SIU Analyst | The claim, the receipt, every check with its verdict, the forensic narrative and the network dossier |
| Request Information | User step, optional | From the member or the practice |
| Escalate to SIU | User step, optional, Investigator | Moves the case to the SIU queue |

### Stage 3: Outcome

| Step | Type | Description |
| --- | --- | --- |
| Record Decision | User step, Investigator or SIU Analyst | Confirmed Fraud, False Positive or Pay, with notes |
| Feed Back Outcome | Automation | Adds confirmed cases to the Fraud Case Library and the network graph; records false positives for threshold tuning |

## Data objects

Exactly these 15. There is no separate Claim data object; the Claim case type holds the claim.

| Data object | Holds |
| --- | --- |
| Member | The insured member. System of record: the fund's member system |
| Practice | The provider practice, including ABN and bank account |
| Practitioner | The treating practitioner, including AHPRA number |
| Receipt | The uploaded file and the raw extracted text |
| Claim Line | One service line: item code, quantity, item charge, date |
| Item Code Reference | Valid item codes and descriptions |
| GeoSession | Submission IP address and resolved suburb and state |
| DeviceSession | Device fingerprint and app or browser profile |
| Invalid Document Keyword | Terms that disqualify a document, including PAID |
| Document Marker Flag | Soft markers detected in a document |
| Document Forensics Result | Each forensic check with its verdict, and the receipt integrity score |
| Event Strategy Signal | Strategy ID, verdict, figure and threshold |
| Member Risk Flag | Watchlist entries for members, practices and practitioners |
| Network Intelligence Dossier | Graph paths, fraud community and case similarity results |
| Fraud Case Library | Confirmed fraud cases for similarity search |

## Case fields

Use Decimal for scores, DateTime for dates and times, and Boolean for flags.

### Claim

| Field | Type |
| --- | --- |
| Member | Member |
| Practice | Practice |
| Practitioner | Practitioner |
| Receipt | Receipt |
| Claim Lines | List of Claim Line |
| GeoSession | GeoSession |
| DeviceSession | DeviceSession |
| Forensics Result | Document Forensics Result |
| Event Strategy Signals | List of Event Strategy Signal |
| Network Dossier | Network Intelligence Dossier |
| Claim Type | Text |
| Service Date | Date |
| Total Amount | Decimal |
| Receipt Integrity Score | Decimal |
| Cross-Claim Score | Decimal |
| Network Score | Decimal |
| High Value Flag | Boolean |
| Invalid Document Reason | Text |
| Routing Path | Clean, Rejected, Referred |
| Routing Reason | Text |
| Referring Phase | Receipt Forensics, Cross-Claim Signals, Network Intelligence |
| Referral Queue | Investigator, SIU |
| Priority | HIGH, Standard |
| Submitted | DateTime |

### Fraud Investigation

| Field | Type |
| --- | --- |
| Parent Claim | Reference to Claim |
| Queue | Investigator, SIU |
| Priority | HIGH, Standard |
| SLA Due | DateTime |
| Investigator | User reference |
| Decision | Confirmed Fraud, False Positive, Pay |
| Investigator Notes | Text |
| Outcome Recorded | DateTime |
