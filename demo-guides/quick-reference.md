# DEMO QUICK REFERENCE CARD

## Keyboard Shortcuts

- 1-6 → Jump to CLM-0841 through CLM-0846
- D → Go to Demo mode
- S → Go to Slides mode
- R → Toggle Rolling Demo
- Space → Next slide / Advance phase
- F → Toggle Fullscreen
- P → Toggle Step-by-Step mode
- Esc → Exit fullscreen

## The Three Phases

### Phase 1: Document Forensics 🔍

**Question:** Is the document real and valid?

- Checks: Document type, field extraction, confidence scoring, disqualifying content
- Result: PASS or FAIL

### Phase 2: Event Strategies ⚡

**Question:** Does this claim make sense?

- Checks: Phantom ABN, account clustering, velocity, shared origin, credential exposure
- Result: PASS or MEDIUM RISK or FAIL

### Phase 3: Agentic Intelligence 🧠

**Question:** Who else is involved? Is this fraud?

- Checks: RAG pattern matching, network graph analysis
- Result: PASS or FLAGGED

## The Six Scenarios at a Glance

| ID       | Member  | Ph1  | Ph2  | Ph3  | Outcome                  |

|----------|---------|------|------|------|--------------------------|

| CLM-0841 | James   | PASS | PASS | PASS | Clean - adjudication     |

| CLM-0842 | Sarah   | FAIL | —    | —    | Phase 1: Amount mismatch |

| CLM-0843 | David   | PASS | FAIL | —    | Phase 2: Phantom ABN     |

| CLM-0844 | Linda   | PASS | FAIL | —    | Phase 2: Clustering      |

| CLM-0845 | Michael | PASS | PASS | FLAG | Phase 3: RAG match - AIM |

| CLM-0846 | Angela  | PASS | PASS | FLAG | Phase 3: Network connect |

## Presentation Flow (15-20 minutes)

1. **Slides 1-4 (5-7 min):** The problem, solution, why it matters
2. **CLM-0841 (2-3 min):** Show clean baseline
3. **CLM-0842 (2 min):** Show Phase 1 catch (amount mismatch)
4. **CLM-0843 (2 min):** Show Phase 2 catch (fake provider)
5. **CLM-0845 + AIM (3 min):** Show Phase 3 AI + Investigation case
6. **Dashboard (opt) (1-2 min):** Show fraud monitoring dashboard

## Key Talking Points (Repeat These)

- Every claim is processed in under 3 minutes. No waiting. No manual triage.
- Three phases of increasing sophistication: Document validation \> Pattern detection \> AI matching.
- No black-box scoring. Every number traces to a named check.
- Investigators get zero re-keying. Pega assembles the evidence package automatically.
- Catches everything from simple tampering to sophisticated organized fraud.

## During the Demo

- Pause and explain each phase as it runs
- Point out the checks inside each phase (animated icons)
- For CLM-0845, definitely show the AIM modal - thats the wow moment
- Use Space key if a phase takes too long - manually advance
- If stuck, press R (Restart) and try the scenario again

## If Something Goes Wrong

- Scenario wont load → Press ↩ Restart, then try again
- Stuck on a phase → Press Space to manually advance
- Want to go back → Press S for Slides, then use Space
- AIM button not showing → Make sure youre on CLM-0845
- Dashboard not responding → Try clicking Portal tab first, then Report
