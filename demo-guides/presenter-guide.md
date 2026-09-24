# H+ Health Insurance Demo: Step-by-Step Walkthrough for Presenters

## Before You Start

1. Open the demo in fullscreen (F key)
2. Make sure you are on Slide 1
3. Have your talking points ready (see Key Messages below)
4. Test keyboard shortcuts: D (demo), S (slides), 1-6 (scenarios)

## Part 1: Slides (1-4)

### Slide 1: The Problem

- Talk about:
  - Insurance fraud costs billions
  - Current processes are manual and slow
  - Investigators are overwhelmed

Time: 1-2 minutes

### Slide 2: The Solution

- Talk about:
  - Pega Infinity 26.1 three-phase pipeline
  - Automated document validation
  - Pattern detection at scale
  - AI-powered network analysis

Time: 2 minutes

### Slide 3: Why It Matters

- Talk about:
  - Real-time processing (under 3 minutes per claim)
  - No black-box scoring (every check is named)
  - Investigators get complete evidence packages
  - APRA CPS 230 compliance

Time: 2 minutes

### Slide 4: Lets See It In Action

- Say: Let me show you how this works in real-time...
- Press D to go to Demo mode

Time: 30 seconds

## Part 2: Live Demo

### Scenario 1: CLM-0841 (Clean Claim)

- Press: 1
- What to say:
  - This is a normal claim from James Kowalski - a \$312 dental service. Watch what happens...
- What happens:
  - Document upload → validation checks pass
  - Phase 1: Document Forensics → PASS
  - Phase 2: Event Strategies → PASS
  - Phase 3: Agentic Intelligence → PASS
  - Result: Sent for normal adjudication
- Key message: Most claims are clean and flow through all three phases successfully.

Time: 2-3 minutes

### Scenario 2: CLM-0842 (Phase 1 Failure)

- Press: 2
- What to say:
  - Now watch what happens when there is a discrepancy between the claim and the receipt...
- What happens:
  - Member claims \$487.50 but receipt shows \$445.00
  - Phase 1: Document Forensics → FAILS at Claim-to-Receipt Match
  - Amber warning shows \$42.50 discrepancy
  - Claim immediately rejected
- Key message: Phase 1 catches document issues immediately. No bad claims get through.

Time: 2 minutes

### Scenario 3: CLM-0843 (Phase 2 Phantom ABN)

- Press: 3
- What to say:
  - This claim looks good on paper, but Phase 2 checks the provider against the ABR registry...
- What happens:
  - Phase 1 passes (document is real)
  - Phase 2: Event Strategies → FAILS at Phantom ABN Detection
  - Provider not found in Australian Business Register
  - Escalated to SIU
- Key message: Phase 2 performs pattern matching. It catches fake providers and suspicious behavior.

Time: 2 minutes

### Scenario 5: CLM-0845 (Phase 3 - THE SOPHISTICATED ONE)

- Press: 5
- What to say:
  - This is the most interesting one. The claim passes documents AND patterns, but watch Phase 3 use AI to find connections to known fraud...
- What happens:
  - Phase 1: PASS
  - Phase 2: PASS
  - Phase 3: Agentic Intelligence → FLAGGED
  - RAG match shows 91% similarity to 4 known phantom-billing cases
  - High-priority escalation to SIU
- THEN - Click Open Alert & Investigation Manager button
- Show the AIM modal with:
  - Investigation case details
  - Evidence package (4 related fraud cases)
  - Investigator briefing
- Key message: Phase 3 uses AI to find sophisticated fraud. This claim would have slipped through with traditional checks. Pega flags it AND assembles the complete investigation case automatically.

Time: 3 minutes (including AIM modal)

### Bonus: Show the Dashboard

- Press: Report tab
- What to say:
  - Here is what a real fraud monitoring dashboard looks like. These 24 cases are accumulated intelligence from the pipeline. Investigators can filter by provider or member to see patterns.
- Interact with:
  - Sort by Fraud Score (click header)
  - Filter by Provider or Member
  - Show summary stats (high-priority count)

Time: 1-2 minutes (optional)

## Key Messages to Reinforce

1. Every claim is processed in under 3 minutes. No waiting. No manual triage.
2. Three phases of increasing sophistication: Document validation \> Pattern detection \> AI matching.
3. No black-box scoring. Every flagged claim comes with a complete evidence package.
4. Investigators get zero re-keying. Pega assembles the case automatically.
5. Catches everything from simple document tampering to sophisticated organized fraud.

## Recommended Total Timing

- Slides 1-4: 5-7 minutes
- CLM-0841 (baseline): 2-3 minutes
- CLM-0842 (Phase 1): 2 minutes
- CLM-0843 (Phase 2): 2 minutes
- CLM-0845 + AIM: 3 minutes
- Dashboard: 1-2 minutes (optional)
- Total: 15-20 minutes
