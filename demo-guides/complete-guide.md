# H+ Health Insurance Co: Pega Infinity 26.1 Fraud Detection Demo

Complete Guide with Step-by-Step Explanations

## Table of Contents

1. Demo Overview
2. The Three Phases
3. The Six Scenarios (CLM-0841 to CLM-0846)
4. Component Walkthrough
5. Fraud Dashboard
6. Alert & Investigation Manager (AIM)
7. Presentation Flow

## 1. Demo Overview

This demo showcases Pega Infinity 26.1's real-time fraud detection
pipeline. It demonstrates how claims flow through three intelligent
phases of analysis, with each phase getting progressively deeper into
fraud pattern detection.

### What the Demo Shows

A member submits an insurance claim for processing. The claim
immediately enters a three-phase fraud detection pipeline that:

1. Validates the document itself (is it real? is it tampered?)
2. Checks for suspicious claim patterns (velocity, duplicates, shared origins)
3. Uses AI to find connections to known fraud (network analysis, pattern matching)

Most claims (like CLM-0841) pass all three phases and are sent for
normal adjudication. Flagged claims (like CLM-0845) are immediately
routed to the Specialist Investigation Unit (SIU) with a complete
evidence package.

## 2. The Three Phases

### Phase 1: Document Forensics 🔍

- Purpose: Is the document real and valid?
- What it checks:
  - Document type (TAX INVOICE? RECEIPT? Valid format?)
  - Field extraction (Can we read the provider, amount, dates, item codes clearly?)
  - Confidence scoring (Are critical fields above our confidence thresholds?)
  - Disqualifying content (Does it contain warnings like "CANCELLED" or "VOID"?)
  - Font consistency (Do suspicious patterns suggest manipulation?)
  - Claim-to-Receipt Match (Does the claimed amount match the receipt amount?)

Result: PASS or FAIL

PASS → Continue to Phase 2 \| FAIL → Reject immediately, route to SIU

### Phase 2: Event Strategies ⚡

- Purpose: Does this claim make sense? Are there red flags in the pattern?
- What it checks:
  - Phantom ABN detection (Is the provider real per Australian Business Register?)
  - Repeat-account clustering (Is one payment account appearing across multiple claims?)
  - Claim velocity (Are claims being submitted too fast? Too many in a timeframe?)
  - Shared submission origin (Do unrelated members submit from the same source?)
  - Dark web credential exposure (Member/provider credentials in known breach databases?)

Result: PASS or MEDIUM RISK or FAIL

PASS → Continue to Phase 3 \| MEDIUM/FAIL → Escalate to SIU

### Phase 3: Agentic Intelligence 🧠

- Purpose: Who else is involved? Is this connected to known fraud?
- What it checks:
  - Knowledge Buddy RAG (Does this claim pattern match any confirmed fraud cases in our library?)
  - Network Graph Intelligence (Are the member/provider connected to known fraudsters?)

Result: PASS or FLAGGED

PASS → Send for normal adjudication \| FLAGGED → HIGH PRIORITY → SIU

## 3. The Six Scenarios

### CLM-0841 — James Kowalski

- Type: Dental - Clean
- Phase 1: PASS
- Phase 2: PASS
- Phase 3: PASS
- Outcome: Clean baseline - sends for adjudication
- Demo Point: Shows a normal claim flowing through all phases successfully

### CLM-0842 — Sarah Nguyen

- Type: Optical - Document Issue
- Phase 1: FAIL
- Phase 2: N/A
- Phase 3: N/A
- Outcome: Caught in Phase 1 (Claim-to-Receipt mismatch)
- Demo Point: Shows document forensics catching a discrepancy

### CLM-0843 — David Okafor

- Type: Physio - ABN Issue
- Phase 1: PASS
- Phase 2: FAIL
- Phase 3: N/A
- Outcome: Caught in Phase 2 (Phantom ABN)
- Demo Point: Shows pattern detection catching a fake provider

### CLM-0844 — Linda Pham

- Type: Dental - Account Clustering
- Phase 1: PASS
- Phase 2: FAIL
- Phase 3: N/A
- Outcome: Caught in Phase 2 (Repeat-account clustering)
- Demo Point: Shows how multiple claims from same account are caught

### CLM-0845 — Michael Torres

- Type: Optical - AI Pattern Match
- Phase 1: PASS
- Phase 2: PASS
- Phase 3: FLAGGED
- Outcome: Caught in Phase 3 (91% RAG match)
- Demo Point: Shows AI catching sophisticated fraud - includes AIM modal

### CLM-0846 — Angela Wu

- Type: Physio - Network Connections
- Phase 1: PASS
- Phase 2: PASS
- Phase 3: FLAGGED
- Outcome: Caught in Phase 3 (Network connections)
- Demo Point: Shows relationship detection catching organized fraud

## 4. Component Walkthrough

### Control Bar (Top)

- ▶ Rolling Demo - Automatically play all scenarios in sequence
- ↩ Restart - Stop everything and return to first slide
- CLM-0841 through CLM-0846 - Click to jump to a specific scenario
- ⌨ Presenting - Shows you're in presentation mode
- ◀ Slides \| Demo ▶ - Toggle between slides and demo mode
- 📋 Portal - Active claim portal (default)
- 📊 Report - Fraud dashboard with all 24 cases

### Document Validation Sequence

- ✅ Document type confirmed - Document is recognized and valid
- ✅ Field extraction complete - All fields read successfully
- ✅ Confidence scoring complete - Fields are above thresholds
- ✅ Pre-flight gate passed - No disqualifying content detected

## 5. Fraud Dashboard

Click the 📊 Report tab to access the accumulated fraud case database.

- Shows:
  - 24 fraud cases (6 demo + 18 realistic examples)
  - Filters for member, provider, date, outcome
  - Sortable columns
  - Summary statistics

## 6. Alert & Investigation Manager (AIM)

CLM-0845 only: Click "Open Alert & Investigation Manager" after Phase 3

- Shows:
  - Investigation case details
  - Which queue and SLA (4 hours)
  - Pipeline results
  - Evidence package with 91% RAG match to 4 known fraud cases
  - Investigator briefing and recommended actions

## 7. Presentation Flow

1. Recommended Demo Sequence:
   1. Show Slides 1-4
   2. Click "Demo ▶"
   3. Run CLM-0841 (clean baseline)
   4. Run CLM-0842 (Phase 1 failure)
   5. Run CLM-0843 (Phase 2 ABN)
   6. Run CLM-0845 (Phase 3 RAG) → Show AIM modal
   7. Click 📊 Report tab (show dashboard)

### Key Talking Points

- "Every claim processed in under 3 minutes. Suspicious claims route to investigators immediately with complete evidence package."
- "Three phases: Document validation (real?), pattern detection (sense?), AI matching (who else?)."
- "No black-box scoring. Every number traces to a named check."

### Keyboard Shortcuts

- 1-6 = Jump to scenarios
- D = Demo mode
- S = Slides mode
- F = Fullscreen
