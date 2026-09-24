# The Three Phases

*One Problem. Three Layers of Defence.*

Fraud in a health insurance claim rarely announces itself in one place.
It hides in the document itself, in the pattern of behaviour around a
claim, or in the wider network a claim sits inside — and each of those
requires a different kind of scrutiny to see. This pipeline runs every
claim through three escalating layers of defence, each answering a
different question: is the document real, does the claim make sense, and
who else is involved. Any phase can stop a claim on its own, and every
signal that fires is named, explainable and fully auditable — nothing
here is a black-box score. Findings from Phases 2 and 3 are reviewed by
a human investigator through Pega Alerts & Investigations Management
before any action is taken: AI assists the decision, it never makes it
alone.

## 🔍 Document Forensics

*“Is this document real and valid?”*

**8 FRAUD SIGNALS**

### Claim-to-receipt match

> Cross-checks every claimed detail — the amount, the provider, the
> service date, the item codes — directly against what the uploaded
> receipt actually shows. Any discrepancy, however small, is surfaced
> immediately rather than silently accepted.

### AI extracts the text

> Pega Agentic AI reads and interprets the full document rather than
> running a simple OCR pass — understanding structure and context, not
> just characters — so every downstream check has accurate, structured
> data to work from.

### Duplicate detection

> Every receipt is fingerprinted and compared against the entire
> submission history. A receipt that has already been used — even
> reformatted or resubmitted under different details — is caught before
> it can be paid twice.

### Document type classification & confidence scoring

> The system classifies what kind of document it is looking at (tax
> invoice, receipt, and so on) and scores its confidence in every
> extracted field. Anything below the required confidence threshold is
> flagged rather than assumed correct.

### Font consistency analysis

> Genuine receipts are produced by a single system in a single typeface.
> Documents assembled or edited by splicing in text from another source
> often mix typefaces in ways invisible to the eye but easy for the
> model to detect.

### Stamp & colour forgery detection

> Checks provider stamps, seals and colour profiles for signs of digital
> manipulation or copy-paste forgery — the kind of tampering that
> photocopies and scans routinely hide from a human reviewer.

### AI-generated receipt detection

> As generative AI makes it trivial to fabricate a convincing-looking
> receipt from scratch, this check looks for the subtle artefacts those
> image generators leave behind — patterns a human eye would miss but a
> model is trained to catch.

### File history & authoring trail

> Every file carries a metadata trail. This check confirms the document
> was actually produced by the provider's own practice software, and
> flags any file edited after the claimed service date — a strong signal
> it has been altered.

## ⚡ Provider & Pattern Fraud

*“Does this claim make sense?”*

**7 FRAUD SIGNALS**

### Every strategy named, explainable and entirely auditable

> Phase 2 runs as a set of named Pega Event Strategies rather than an
> opaque model. Every flag traces back to a specific, human-readable
> rule, so an investigator — or an auditor — can always see exactly why
> a claim was raised.

### Phantom ABN detection

> Every provider's ABN is verified live against the Australian Business
> Register. A cancelled, deregistered or invalid ABN — such as a
> provider still billing under a number that was cancelled — is caught
> immediately.

### Repeat-account clustering

> Flags when the same payment account keeps appearing as the destination
> across claims that are supposed to be unrelated — a common signature
> of coordinated billing fraud hiding behind different member or
> provider names.

### Claim velocity

> Tracks how frequently claims are being submitted, for a member or a
> provider, across rolling time windows. A sudden spike in submission
> frequency is exactly the kind of pattern a reviewer looking at one
> claim at a time would never see.

### Shared submission origin

> Detects when claims from members who have no connection to one another
> are all being submitted from the same source — a strong indicator of a
> single actor running multiple identities.

### Waiver abuse & 90-day volume

> Watches for excessive use of waiting-period waivers and unusual claim
> volume within a rolling 90-day window. The exact detection thresholds
> for this strategy are still being finalised with the business.

### New strategies added in days

> Because every check is a configured Event Strategy rather than bespoke
> code, new fraud patterns identified by investigators can be turned
> into a live detection rule within days, not a development cycle.

## 🧠 Organised Ring Fraud

*“Who else is involved?”*

**5 FRAUD SIGNALS**

### Invisible to conventional systems

> By definition, the fraud Phase 3 is built to catch is the kind that
> passes every check aimed at a single claim in isolation — it only
> becomes visible once you look at the connections between claims,
> providers and accounts.

### Network graph intelligence

> Builds a graph of every entity connected to a claim — devices,
> accounts, providers — and traverses it three hops out, well beyond the
> direct, one-to-one links that conventional fraud checks are limited
> to.

### Fraud community mapping

> Rather than judging a provider or account purely on its own history,
> this maps it against communities of entities already linked to
> confirmed fraud — catching a new claim the moment it touches a known
> bad actor, even indirectly.

### Knowledge Buddy RAG

> Uses retrieval-augmented generation to compare a claim's pattern —
> item codes, provider profile, billing shape — against the library of
> confirmed fraud cases, catching matches even when no single identifier
> lines up exactly.

### Early warning before fraud accumulates

> Because network and pattern signals compound as more claims are
> submitted, Phase 3 is designed to raise the alert while a fraud ring
> is still small — before losses accumulate to the point recovery
> becomes difficult.

|  |
|:--:|
| *🛡️ Pega Alerts & Investigations Management (AIM) — Every AI signal reviewed by a human investigator · AI assists, humans decide · Full audit trail on every case* |
