# Bupa Fraud Detection Demo: Technical Components & Architecture

A guide to understanding how each component works

## Overall Architecture

This demo is a single self-contained HTML file with no external
dependencies. All HTML, CSS, and JavaScript are embedded.

### File Structure

- index.html
  - Single file deployment
  - ~2,300 lines of code
  - Runs in any modern browser
  - Deployed via GitHub Pages

## Three Main Screens

### 1. Slides Screen

Five presentation slides that set context, plus one manual-access backup
slide

  - Slide 1: Agenda (Background, Quantify Bupa Fraud POC, Target Outcome, Requirements)
  - Slide 2: The Problem (the fraud estimate and why prevention beats recovery)
  - Slide 3: The Business Case for Prevention (POC scope, methodology, outcome, requirements)
  - Slide 4: Three Phases (One Intelligent Pipeline)
  - Slide 5: Powered by Pega (Why Pega) - ends with the Launch Demo button
  - Backup slide: "Three Hops" identity-graph diagram - reachable only via the B key or the dashed Backup button, not part of the main sequence or Rolling Demo
- Keyboard: S = Slides mode, Space / ← → = previous-next slide, B = jump to Backup slide

### 2. Demo Screen (Portal)

"Phase 1 Dataset Analysis" tool with 6 real scenarios - framed as
validating member-entered data against historical receipts, not a live
claim portal

  - "Load Document" upload section (fake, instant completion)
  - Form fields for claim details
  - Three-phase pipeline display (real-time simulation)
- Keyboard: D = Demo mode, 1-6 = select scenario

### 3. Fraud Dashboard (Report)

Accumulated fraud case database

  - 24 cases total (6 real + 18 illustrative)
  - Filters: Member, Provider, Date, Outcome
  - Discrepancy column - claimed-vs-receipt mismatch amount with an ↑ arrow, sortable, blank for clean claims (e.g. CLM-0842: \$42.50 ↑)
  - Sortable columns
  - Summary statistics
- Keyboard: no shortcut - click the Portal / Report tabs to switch

## The Six Claim Scenarios

### Scenario Data Structure

- Each scenario contains:
  - Member info (name, ID)
  - Provider info (name, ABN)
  - Claim details (type, date, amount, item codes)
  - Document filename
  - Document size

### CLM-0841: Clean Baseline

- Member: James Kowalski
- Provider: Bright Smile Dental
- Type: Dental
- Amount: \$312.00
- Result: All phases PASS
- Purpose: Show normal flow

### CLM-0842: Phase 1 Failure

- Member: Sarah Nguyen
- Provider: Vision Direct Pty Ltd
- Type: Optical
- Amount: \$487.50 (claimed) vs \$445.00 (receipt)
- Result: FAILS - Claim-to-Receipt Match (amber warning) plus Font Consistency and Metadata & Provenance both fail (red); Phase 1 score 0.28. Phases 2 and 3 never run - this scenario is scoped to Phase 1 only.
- Purpose: Show document forensics catching discrepancies - a dedicated panel appears under the Phase 1 result showing Member Entered (\$487.50) vs Receipt Shows (\$445.00) vs Discrepancy (\$42.50, 10.8%) and "Result: MISMATCH DETECTED"

### CLM-0843: Phase 2 ABN Failure

- Member: David Okafor
- Provider: Active Rehab Centre (fake ABN)
- Type: Physiotherapy
- Amount: \$195.00
- Result: FAILS at Phantom ABN Detection
- Purpose: Show pattern detection catching fake providers

### CLM-0844: Phase 2 Clustering Failure

- Member: Linda Pham
- Provider: Metro Dental Group
- Type: Dental
- Amount: \$264.00
- Result: FAILS at Repeat-Account Clustering
- Purpose: Show pattern detection catching coordinated fraud

### CLM-0845: Phase 3 RAG Flag

- Member: Michael Torres
- Provider: ClearView Optometry
- Type: Optical
- Amount: \$390.00
- Result: FLAGGED at Phase 3 - 91% RAG match
- Matched to: 4 confirmed phantom billing cases
- Special feature: Opens AIM modal with investigation details
- Purpose: Show AI catching sophisticated fraud

### CLM-0846: Phase 3 Network Flag

- Member: Angela Wu
- Provider: Prime Physio & Sports
- Type: Physiotherapy
- Amount: \$230.00
- Result: FLAGGED at Phase 3 - Network connections
- Purpose: Show relationship detection in fraud networks

## Phase Implementations

### Phase 1: Document Forensics

- Simulated checks (with realistic timing):
  - Document type validation
  - Field extraction from document
  - Confidence scoring
  - Disqualifying content detection
  - Claim-to-Receipt Match (on CLM-0842)
- Flow (this is the upload-validation sequence, on the claim form before the pipeline modal opens):
  - 0.8s: Document type confirmed ✓
  - 3.0s: Field extraction complete ✓
  - 5.2s: Confidence scoring complete ✓
  - \[3-second pause - nothing happens\]
  - 8.2s-9.2s: the 6 form fields flash green one at a time, 200ms apart, 800ms each (Attachment 1 only - a second upload populates the fields silently, no highlight)
  - 10.0s: Pre-flight gate passed → PASS/FAIL (this is when the pipeline can open)

### Phase 2: Event Strategies

- Pattern checks (sequential):
  - Phantom ABN Detection (vs ABR)
  - Repeat-Account Clustering
  - Claim Velocity Analysis
  - Distance, IP block and waiver-abuse checks
  - Item Code Validation (against ADA/MBS registry)
- Result codes (8 Event Strategies total):
  - ES-001 Distance, ES-002 Velocity, ES-003 IP Block, ES-004 Waiver Abuse, ES-005 Phantom ABN, ES-006 Cluster Flag, ES-007 Waiver Frequency, ES-008 Item Code Validation (each with pass/fail status)

### Phase 3: Agentic Intelligence

- AI-powered checks:
  - Knowledge Buddy RAG (pattern similarity matching)
  - Network Graph Intelligence (relationship detection)
- On CLM-0845:
  - RAG match: 91% to 4 confirmed phantom-billing cases
  - Item codes match: 10801, 10712 appear in known fraud
  - Timeline anomaly detected

## Component Details

### Upload Validation Animation

- When you attach document (Attachment 1):
  - Four green validation checks appear in sequence (document type, field extraction, confidence scoring, pre-flight gate)
  - Each check animates with emoji
  - After a 3-second pause, the 6 form fields populate and flash green one at a time (200ms apart)
  - Timing: 0.8s → 3.0s → 5.2s → \[pause\] → 8.2s-9.2s field flashes → 10.0s pre-flight gate
- Second attachment:
  - No validation checks shown
  - Fields silently populate

### Alert & Investigation Manager (AIM)

- Only appears on CLM-0845 after Phase 3 completes
- Shows:
  - Investigation reference (INV-2024-0845)
  - Case details and SLA (4 hours)
  - Pipeline results summary
  - Evidence package:
    - Matched fraud case references (CLM-2024-0701, -0558, -0334, -0189)
    - RAG match score (91%)
    - Why it was flagged
  - Investigator briefing with recommended actions

### Control Bar

- Top navigation with:
  - Play controls (Rolling Demo, Restart)
  - Scenario buttons (1-6)
  - Mode toggles (Slides, Demo, Portal, Report)
  - Display options (Dark/Light, Fullscreen)

## Key Animations & Timings

- Validation checks (Attachment 1):
  - 0.8s: Document type confirmed ✓
  - 3.0s: Field extraction complete ✓
  - 5.2s: Confidence scoring complete ✓
  - 8.2s-9.2s: form fields flash green, one at a time ✓
  - 10.0s: Pre-flight gate passed ✓
- Phase 1 (Document Forensics, inside the pipeline modal):
  - ~17s total (6 sequential checks, last one lands at 15.6s + 1.6s buffer)
- Phase 2 (Event Strategies):
  - ~18s total (runs all 8 checks with staggered animation, last one lands at 16.0s + 1.6s buffer)
- Phase 3 (Agentic Intelligence):
  - ~7-9s total, varies by scenario (RAG match calculation + network analysis)
