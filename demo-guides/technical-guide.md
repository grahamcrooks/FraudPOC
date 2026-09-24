# H+ Health Insurance Demo: Technical Components & Architecture

A guide to understanding how each component works

## Overall Architecture

This demo is a single self-contained HTML file with no external
dependencies. All HTML, CSS, and JavaScript are embedded.

### File Structure

- index.html
  - Single file deployment
  - ~2,100 lines of code
  - Runs in any modern browser
  - Deployed via GitHub Pages

## Three Main Screens

### 1. Slides Screen

Four presentation slides that set context

  - Slide 1: The Problem
  - Slide 2: The Solution (3-phase pipeline)
  - Slide 3: Why It Matters (key benefits)
  - Slide 4: Live Demo
- Keyboard: S = Slides mode, Space = next slide

### 2. Demo Screen (Portal)

Interactive claim portal with 6 real scenarios

  - Document upload section (fake, instant completion)
  - Form fields for claim details
  - Three-phase pipeline display (real-time simulation)
- Keyboard: D = Demo mode, 1-6 = select scenario

### 3. Fraud Dashboard (Report)

Accumulated fraud case database

  - 24 cases total (6 real + 18 illustrative)
  - Filters: Member, Provider, Date, Outcome
  - Sortable columns
  - Summary statistics
- Keyboard: Tab = Portal, Tab = Report

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
- Result: FAILS at Claim-to-Receipt Match
- Purpose: Show document forensics catching discrepancies

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
- Flow:
  - 0.8s: Document type → PASS
  - 3.0s: Field extraction → PASS
  - 5.2s: Confidence scoring → PASS
  - 8.2s: Pre-flight gate → PASS/FAIL

### Phase 2: Event Strategies

- Pattern checks (sequential):
  - Phantom ABN Detection (vs ABR)
  - Repeat-Account Clustering
  - Claim Velocity Analysis
  - Shared Origin Detection
  - Dark Web Credential Exposure (ES-009)
- Result codes (8 Event Strategies total):
  - ES-001 through ES-009 (each with pass/fail status)

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
  - Four green checks appear in sequence
  - Each check animates with emoji
  - Form fields populate and flash green
  - Timing: 0.8s → 3.0s → 5.2s → 8.2s
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
  - 8.2s: Pre-flight gate passed ✓
- Phase 1 (Document Forensics):
  - ~12s total (sequential checks with 200-400ms between items)
- Phase 2 (Event Strategies):
  - ~8s total (runs all 8 checks with staggered animation)
- Phase 3 (Agentic Intelligence):
  - ~10s total (RAG match calculation + network analysis)
