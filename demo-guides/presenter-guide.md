# Bupa Fraud Detection Demo: Step-by-Step Walkthrough for Presenters

## Before You Start

1. Open the demo in fullscreen (F key)
2. Make sure you are on Slide 1 (Agenda)
3. Have your talking points ready (see Key Messages below)
4. Test keyboard shortcuts: D (demo), S (slides), 1-7 (scenarios), 0 (restart)

## Part 1: Slides (1-5)

### Slide 1: Agenda

- Talk about:
  - Background — why prevention, not just recovery
  - Quantify Bupa Fraud POC — sizing the problem in Bupa’s own claims
  - Target Outcome — what success looks like for Phase 1
  - Requirements — what we’re asking for to get started

Time: 30 seconds – 1 minute (quick roadmap, don’t over-explain)

### Slide 2: The Problem

- Talk about:
  - 1–3% of Bupa’s claims are estimated to contain fraud, waste or abuse — a conservative estimate, well below the 3–10% global industry benchmark
  - Healthcare is Australia’s \#1 most targeted sector for data breaches
  - Recovery happens after a claim is paid. Prevention happens before. AI is what makes that shift possible.

Time: 1-2 minutes

### Slide 3: The Business Case for Prevention

- Talk about:
  - Background — Bupa has traditionally caught fraud after a claim is paid, through audits and recoveries. This POC tests whether detection can happen before payment.
  - What the POC will entail — extract and analyse ~10,000 historical claims receipts, replayed initially through Phase 1, with future phases to follow
  - How the POC will work — Extract, Analyse, Classify, Route, Validate
  - Expected outcome — fraud detection capability, cases for investigator review, recovery potential (exact figures to be confirmed against the Phase 1 POC results)
  - What’s needed — an executive project owner, AI Council approval, and resource/budget commitment for the Phase 1 build

Time: 2 minutes

### Slide 4: Three Phases (One Intelligent Pipeline)

- Talk about:
  - Phase 1 — Receipt Forensics: is this document real and valid?
  - Phase 2 — Cross-Claim Signals: does this claim make sense?
  - Phase 3 — Network Intelligence: who else is involved?
  - Pega Alerts & Investigations Management (AIM) — every AI signal is reviewed by a human investigator; AI assists, humans decide

Time: 2 minutes

### Slide 5: Powered by Pega (Why Pega)

- Talk about:
  - Proven platform, predictable per-case cost, self-improving, APRA CPS 230 alignment, fast to deploy, human oversight on every case
- Say: “Let me show you how this works in real-time…”
- Click “Launch Demo →” (or press D) to go to Demo mode

Time: 1-2 minutes

## Part 2: Live Demo

### Scenario 1: CLM-0841 (Clean Claim)

- Press: 1
- What to say:
  - This is a normal claim from James Kowalski - a \$312 dental service. Watch what happens...
- What happens:
  - Document upload → validation checks pass
  - Phase 1: Receipt Forensics → PASS
  - Phase 2: Event Strategies → PASS
  - Phase 3: Agentic Intelligence → PASS
  - Result: Sent for normal adjudication
- Key message: Most claims are clean and flow through all three phases successfully.

Time: 2-3 minutes

### Scenario 2: CLM-0842 (Phase 1 Failure)

- Press: 2
- What to say:
  - Now watch what happens when the member-entered data doesn’t match the actual receipt...
- What happens:
  - Member entered \$487.50 but the receipt shows \$445.00
  - Phase 1: Receipt Forensics → FAILS — Claim-to-Receipt Match (amber warning), plus Font Consistency and Metadata & Provenance both fail (spliced typefaces, Photoshop metadata trail)
  - A dedicated “Phase 1 Validation Failed” panel appears showing Member Entered (\$487.50) vs Receipt Shows (\$445.00) vs Discrepancy (\$42.50, 10.8%) and “Result: MISMATCH DETECTED”
  - Phases 2 and 3 never run for this claim — it’s scoped to Phase 1 only
  - Escalated to the investigator queue, HIGH priority, 4-hour SLA
- Key message: Phase 1 catches document and data-entry issues immediately — no bad claims get through, and investigators see exactly what didn’t match.

Time: 2 minutes

### Scenario 3: CLM-0843 (Phase 2 Phantom ABN)

- Press: 3
- What to say:
  - This claim looks good on paper, but Phase 2 checks the provider against the Australian Business Register...
- What happens:
  - Phase 1 passes (document is real)
  - Phase 2: Event Strategies → FAILS at Phantom ABN Detection (ES-005)
  - Provider’s ABN was cancelled in July 2024 — still being claimed under
  - Escalated to SIU
- Key message: Phase 2 performs pattern matching. It catches fake or deregistered providers and suspicious behaviour.

Time: 2 minutes

### Scenario 4: CLM-0844 (Phase 2 Coordinated Cluster)

- Press: 4
- What to say:
  - Linda’s claim looks ordinary on its own — but Phase 2 cross-references it against every other recent claim...
- What happens:
  - Phase 1 passes (document is real)
  - Phase 2: Event Strategies → FAILS at ES-006 Cluster Flag
  - Same payment account recurs across 6 other claims in 8 days — same provider, same suburb
  - Routed to Standard Review Queue, MEDIUM priority, 24-hour SLA
- Key message: No single claim looks suspicious in isolation. Phase 2 sees the pattern across claims that a human reviewing one claim at a time never would.

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
  - Here is what a real fraud monitoring dashboard looks like. These 24 cases are accumulated intelligence from the pipeline. Investigators can filter by provider or member to see patterns, and the Discrepancy column flags claimed-vs-receipt mismatches like CLM-0842 at a glance.
- Interact with:
  - Sort by Fraud Score or Discrepancy (click header)
  - Filter by Provider or Member
  - Show summary stats (high-priority count)

Time: 1-2 minutes (optional)

## Key Messages to Reinforce

1. Every claim is processed in under 3 minutes. No waiting. No manual triage.
2. Three phases of increasing sophistication: Document validation \> Pattern detection \> AI matching.
3. No black-box scoring. Every flagged claim comes with a complete evidence package.
4. Investigators get zero re-keying. Pega assembles the case automatically.
5. Catches everything from simple document tampering to sophisticated organised fraud — and Phase 1 alone already catches data-entry mismatches, not just forged documents.

## Recommended Total Timing

- Slides 1-5: 7-9 minutes
- CLM-0841 (baseline): 2-3 minutes
- CLM-0842 (Phase 1): 2 minutes
- CLM-0843 (Phase 2 — ABN): 2 minutes
- CLM-0844 (Phase 2 — clustering, optional): 2 minutes
- CLM-0845 + AIM: 3 minutes
- Dashboard: 1-2 minutes (optional)
- Total: 17-23 minutes (15-19 minutes if CLM-0844 is skipped)
