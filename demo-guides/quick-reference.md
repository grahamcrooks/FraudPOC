# DEMO QUICK REFERENCE CARD

## Keyboard Shortcuts

- 1-6 → Jump to CLM-0841 through CLM-0846
- 0 → Restart demo (returns to Slide 1, clears the claim form)
- D → Go to Demo mode
- S → Go to Slides mode
- R → Toggle Rolling Demo
- Space → Next slide (Slides screen) / Pause-Resume (Rolling Demo)
- ← → → Previous / Next slide (Slides screen only)
- F → Toggle Fullscreen
- P → Toggle Step-by-Step mode
- B → Jump to the Backup slide (manual mode only)
- Esc → Exit fullscreen (standard browser behaviour)
- L → Replay the sign-in scene (or click the session chip in the portal header)

### Sign-in scene

- Plays automatically when CLM-0841 opens, including each loop of the Rolling Demo (about 6 seconds).
- Any key or click → Skip to the end: the session chip is filled and the privacy line shows.
- Space, Enter and Esc only skip the scene; they don't also pause the Rolling Demo or advance.
- Number keys and S still work mid-scene: the scene skips to the end, then the key does its usual job.
- L → Replay it at any time on a scenario with a sign-in.

## The Three Phases

### Phase 1: Document Forensics 🔍

**Question:** Is the document real and valid?

- Checks: Document type, field extraction, confidence scoring, disqualifying content
- Result: PASS or FAIL

### Phase 2: Event Strategies ⚡

**Question:** Does this claim make sense?

- Checks: Phantom ABN, account clustering, distance/velocity/IP, waiver analysis, item code validation (8 Event Strategies, ES-001 to ES-008)
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

1. **Slides 1-5 (6-8 min):** Agenda, the problem, the business case, the three-phase pipeline, why Pega
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
- Phases run and resolve on their own - click Continue (or View Fraud Detection Summary on a fail) to move to the next one; there's no keyboard shortcut for this
- If stuck, press 0 (Restart) and try the scenario again

## If Something Goes Wrong

- Scenario wont load → Press ↩ Restart (or the 0 key), then try again
- Stuck on a phase → Click Continue / View Fraud Detection Summary - phases don't auto-advance on a keypress
- Want to go back → Press S for Slides, then use Space
- AIM button not showing → Make sure youre on CLM-0845
- Dashboard not responding → Try clicking Portal tab first, then Report
- Sign-in scene in the way → Press any key or click to skip it; press L to replay
