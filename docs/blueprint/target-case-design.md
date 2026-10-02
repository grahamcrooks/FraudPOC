# Target Case Design

The case design the Pega Blueprint should match, agreed after reviewing the Blueprint overview of 21 September 2026 (Blueprint ID BP-2441061) against the demo in `index.html` and the scenario data. It replaces three case types and 12 primary validation stages with two case types: a Claim of six stages and a Fraud Investigation of three. The four prompts in [`prompts/blueprint-case-design/`](../../prompts/blueprint-case-design/) build it in a new Pega GenAI Blueprint, one step at a time.

## Decisions

1. **The Claim is the parent case.** Every submission creates a Claim. A Fraud Investigation is created only when a claim is referred, so a clean claim is never a "fraud investigation".
2. **The claim stops at the first phase that refers it.** A claim referred in receipt forensics doesn't run cross-claim signals or network intelligence. This matches the demo.
3. **Network intelligence is a stage, not a case type.** The checks are automated calls; the dossier they return stays as a data object.
4. **Phase 2 uses the demo's event strategies, ES-001 to ES-005.** They replace GEO-001 to GEO-006. Event strategies run in Pega decisioning; the case has one step that collects their signals.
5. **The Claim's six stages are the demo's status strip.** The Blueprint stages, the Constellation stage bar and the demo use the same six names.

## What changed from the current Blueprint

| Current Blueprint | Target | Why |
| --- | --- | --- |
| Fraud Investigation is created for every claim and spins off Claim Validation | Claim is the parent; Fraud Investigation is a child, created on referral | Clean claims aren't investigations; routing was defined in both case types |
| Claim Validation: 12 primary stages, 3 alternate | Claim: 6 primary stages, 2 alternate | One stage per business milestone; the automation sits inside as steps |
| Field Validation after Score Computation | Field validation in Pre-flight | Validate before any forensics |
| Data Enrichment (link practice and practitioner, duplicate check) after the Audit Gate | Linking in Pre-flight; duplicate check in Receipt forensics | Later checks need the links; the demo runs duplicate detection in Phase 1 |
| Audit Gate marks a claim clean on composite score below 0.5, before Phase 2 and 3 | No clean decision until stage 6 | A claim can't be clean before the cross-claim and network checks have run |
| Score Computation mid-pipeline, then a final composite score | One score per phase, routing at the end of each phase | Each phase decides whether to refer |
| No line item reconciliation or completeness check | Both in Pre-flight | CLM-0842 depends on reconciliation |
| GEO-001 to GEO-006 as six case steps | One step collecting ES-001 to ES-005 | CLM-0843 depends on ES-003 bank account ring; event strategies aren't case steps |
| No watchlist check in Network Intelligence | Watchlist check in stage 5 | The demo runs watchlist, graph and similarity |
| Network Intelligence Assessment case type | Stage 5 of the Claim | A case type for one automated call is overhead |
| Review Extracted Structured Data on every claim | Only when extraction confidence is below 0.70 | Human review is the exception |
| Capture Geospatial & Device as a user step | Automated | The member doesn't do anything |
| Investigator and SIU stages only assign and notify | Investigate and Outcome stages with a decision and feedback | Investigators need to decide, and outcomes feed the case library and graph |
| Claim data repeated across case types under different names | Held once on the Claim; the Fraud Investigation references its parent | One record of the claim |
| Scores and dates typed as Text | Decimal, DateTime and Boolean | Scores are compared with thresholds; dates drive SLAs |

## Case type 1: Claim

Created for every submission. Six primary stages and two alternate stages.

### 1 · Submission

| Step | Type | What it does |
| --- | --- | --- |
| Submit claim | Member (user) | The claim form: member number, claim type, service date, practice, practitioner, line items, receipt upload |
| Capture session | Automation | Records the GeoSession (IP, resolved location) and DeviceSession (device fingerprint, profile) for ES-001 and ES-002 |

### 2 · Pre-flight

Is this a claimable receipt at all? Instant, deterministic checks run before any forensic AI.

| Step | Type | What it does | On failure |
| --- | --- | --- | --- |
| Extract receipt | AI | Reads the receipt and fills the claim fields, each with a confidence score | |
| Check extraction confidence | Automation | Every critical field at or above 0.70 | Review extracted data |
| Review extracted data | Claims Administrator (user), conditional | Only when a critical field is below 0.70 | |
| Classify document | Automation | Receipt, tax invoice, quotation, estimate or statement; a receipt or tax invoice continues | Rejected: quotation, estimate or statement |
| Check disqualifying content | Automation | Disqualifying terms, including a PAID stamp matched on word boundaries | Rejected |
| Check completeness | Automation | Provider, practitioner, service date, items and amount paid are present | Rejected |
| Reconcile line items | Automation | Line fees add up to the total charged, allowing for printed adjustments | Continues to Receipt forensics, flagged |
| Link practice and practitioner | Automation | Matches the practice and practitioner to reference data | |
| Record claim value | Automation | Flags $5,000 or above as context for later checks; never routes the claim | |

### 3 · Receipt forensics (Phase 1)

Is the receipt genuine?

| Step | Type | What it does |
| --- | --- | --- |
| Run document forensics | Automation | Metadata and provenance, font consistency, colour and stamp analysis, AI-generated detection, duplicate detection |
| Generate forensic narrative | AI, conditional | A plain-English summary of the findings, only when the receipt integrity score is below threshold |
| Score receipt integrity | Decision | Receipt integrity score; below threshold or a failed check refers the claim (Investigator queue, HIGH) |

### 4 · Cross-claim signals (Phase 2)

Does this claim fit a pattern across other claims?

| Step | Type | What it does |
| --- | --- | --- |
| Collect event strategy signals | Automation | Reads the signals from the five event strategies below |
| Score cross-claim risk | Decision | Any signal refers the claim (SIU queue, HIGH) |

| ID | Event strategy | Rule |
| --- | --- | --- |
| ES-001 | Distance anomaly | Submission location 500 km or more from the registered address |
| ES-002 | Device ring | 5 or more distinct members submitting from one device in the last 72 hours |
| ES-003 | Bank account ring | 3 or more distinct practice ABNs paying into one account in the last 30 days |
| ES-004 | Phantom ABN | The billing practice's ABN is cancelled, deregistered, invalid or registered to another entity |
| ES-005 | Waiver abuse | Repeated waiting-period waivers for one member, or practice volume at 3× its 90-day baseline |

ES-006 item code validation and ES-007 terminal mismatch are planned, not built.

### 5 · Network intelligence (Phase 3)

Is the claim connected to known fraud or an organised ring?

| Step | Type | What it does |
| --- | --- | --- |
| Check watchlist | Automation | Member, practice and practitioner against active risk flags |
| Traverse network graph | Automation | Any path within 3 hops to a confirmed fraud community or a monitored entity |
| Search fraud case library | AI | Comparable confirmed cases from the Knowledge Buddy library, cited by reference; never routes on its own |
| Score network risk | Decision | A path to a confirmed ring refers the claim (SIU queue, HIGH); two or more weak signals refer it (Investigator queue, standard priority) |

### 6 · Decision

| Step | Type | What it does |
| --- | --- | --- |
| Confirm clean | Automation | Records the routing reason and sends the claim for adjudication; the case resolves as Resolved-Clean |

### Alternate stages

| Stage | Steps | Entered from |
| --- | --- | --- |
| Rejected | Notify member · Resolve as Resolved-Rejected | Pre-flight |
| Referred | Create Fraud Investigation · Wait for its outcome · Resolve with the investigation's outcome | Receipt forensics, Cross-claim signals, Network intelligence |

## Case type 2: Fraud Investigation

A child of the Claim, created only on referral. The investigator's work queue and case view are this case type.

| # | Stage | Step | Type | What it does |
| --- | --- | --- | --- | --- |
| 1 | Triage | Route to queue | Automation | Investigator queue or SIU queue, from the referring phase |
| | | Set priority and SLA | Automation | HIGH: 4 hours; standard: from the SLA category |
| 2 | Investigate | Review evidence | Investigator or SIU Analyst (user) | The claim, the receipt, every check with its verdict, the forensic narrative and the network dossier |
| | | Request information | Investigator (user), optional | From the member or the practice |
| | | Escalate to SIU | Investigator (user), optional | Moves the case to the SIU queue |
| 3 | Outcome | Record decision | Investigator or SIU Analyst (user) | Confirmed fraud, false positive, or pay |
| | | Feed back outcome | Automation | Confirmed cases go to the fraud case library and the graph; false positives are recorded for tuning |

## How the scenarios run through it

| Claim | Member | Exits at | Outcome | Needs seeded data |
| --- | --- | --- | --- | --- |
| CLM-0841 | James Kowalski | 6 Decision | Clean, sent for adjudication | No |
| CLM-0847 | Priya Raman | 2 Pre-flight: classify document | Rejected, quotation | No |
| CLM-0848 | Oliver Hartmann | 2 Pre-flight: disqualifying content | Rejected, stamped PAID | No |
| CLM-0842 | Sarah Nguyen | 3 Receipt forensics (after reconciliation fails) | Referred, Investigator queue, HIGH | No |
| CLM-0843 | David Okafor | 4 Cross-claim signals: ES-003 | Referred, SIU queue, HIGH | Yes: claims from four practices paying into one account |
| CLM-0844 | Linda Pham | 4 Cross-claim signals: ES-002 | Referred, SIU queue, HIGH | Yes: four earlier claims from device DEV-1196 in 72 hours |
| CLM-0845 | Michael Torres | 5 Network intelligence: two weak signals | Referred, Investigator queue, standard | Yes: practitioner links and monitored practices in the graph |
| CLM-0846 | Angela Wu | 5 Network intelligence: Community #47 | Referred, SIU queue, HIGH | Yes: Community #47 in the graph |

Only the first four are decided by the receipt alone. The other four need history seeded in Pega before their receipt is submitted.

## Data model

Held once on the Claim, referenced by the Fraud Investigation.

| Data object | Holds |
| --- | --- |
| Member | The insured member (system of record: the fund's member system) |
| Practice, Practitioner | Provider reference data, including ABN, AHPRA number and bank account |
| Receipt | The uploaded file, its header fields and the raw extracted text; fields in [receipt-extraction-fields.md](receipt-extraction-fields.md) |
| Claim Line | One service line, many per document: service date, item code, description, body area or tooth, quantity, fee |
| Item Code Reference | Valid item codes and descriptions |
| GeoSession, DeviceSession | Submission location and device |
| Invalid Document Keyword, Document Marker Flag | Pre-flight reference lists |
| Document Forensics Result | Each forensic check with its verdict, and the receipt integrity score |
| Event Strategy Signal | One signal per strategy: ID, verdict, figure and threshold (new) |
| Member Risk Flag | Watchlist entries |
| Network Intelligence Dossier | Graph paths, community and similarity results |
| Fraud Case Library | Confirmed fraud cases for similarity search |

The current Claim data object is dropped: the Claim case type holds the claim. Scores are Decimal, timestamps DateTime and flags Boolean.

Key fields on the Claim: receipt integrity score, cross-claim score, network score (all Decimal), routing path (Clean, Rejected, Referred), routing reason, referring phase, referral queue, priority, invalid document reason, high value flag (Boolean).

Key fields on the Fraud Investigation: parent claim, queue, priority, SLA due (DateTime), investigator, decision (Confirmed fraud, False positive, Pay), notes, outcome recorded (DateTime).

## Personas

| Persona | Works |
| --- | --- |
| Member | Submits the claim |
| Claims Administrator | Reviews low-confidence extractions |
| Investigator | Fraud Investigation: investigator queue |
| SIU Analyst | Fraud Investigation: SIU queue |

Practice, Practitioner and Patient in the current Blueprint are data, not users, and are dropped as personas.
