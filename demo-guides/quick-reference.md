# DEMO QUICK REFERENCE CARD

## Keyboard Shortcuts

- 1-8 → Jump to CLM-0841 through CLM-0848
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
- C → Captions on or off (on by default)

### Captions

- A one-line caption at the bottom of the screen says what is happening at each beat: tag, then the story ("Session capture · James signs in to the H+ app with Face ID").
- On by default everywhere, including while you present. Press C to switch them off or on.
- For a clean recording with no captions, add `?captions=off` to the address.
- Only CLM-0841 has captions so far; other scenarios show none.

### Sign-in scene

- Plays automatically when CLM-0841 opens, including each loop of the Rolling Demo (about 20 seconds, paced for talking through each beat).
- The three signals rise one at a time — Device, Location, Session — each with a caption and a line saying what it is used for (ES-002, ES-001, the session link).
- Change the pace by adding `?pace=` to the address: `?pace=1` is brisk (about 10 seconds, good for a recording), `?pace=2.5` slower still.
- Any key or click → Skip to the end: the session chip is filled and the privacy line shows.
- Space, Enter and Esc only skip the scene; they don't also pause the Rolling Demo or advance.
- Number keys and S still work mid-scene: the scene skips to the end, then the key does its usual job.
- L → Replay it at any time on a scenario with a sign-in.

## The Three Phases

### Phase 1: Receipt Forensics 🔍

**Question:** Is the document real and valid?

- Checks: Document type, field extraction, confidence scoring, disqualifying content
- Result: PASS or FAIL

### Phase 2: Cross-Claim Signals ⚡

**Question:** Does this claim make sense?

- Checks: ES-001 distance anomaly, ES-002 device ring, ES-003 bank account ring (Pega Event Strategies). Phantom ABN, waiver abuse and item code validation are planned.
- Result: PASS or FAIL

### Phase 3: Network Intelligence 🧠

**Question:** Who else is involved?

- Checks: network graph traversal, up to 3 hops from every entity the claim touches. Fraud case similarity matching is planned.
- Result: PASS or FLAGGED

## The Eight Scenarios at a Glance

| ID       | Member  | Ph1  | Ph2  | Ph3  | Outcome                  |

|----------|---------|------|------|------|--------------------------|

| CLM-0841 | James   | PASS | PASS | PASS | Clean - adjudication     |

| CLM-0842 | Sarah   | FAIL | —    | —    | Phase 1: Amount mismatch |

| CLM-0843 | David   | PASS | FAIL | —    | Phase 2: Bank account ring |

| CLM-0844 | Linda   | PASS | FAIL | —    | Phase 2: Device ring     |

| CLM-0845 | Michael | PASS | PASS | FLAG | Phase 3: Shared practitioner - AIM |

| CLM-0846 | Angela  | PASS | PASS | FLAG | Phase 3: Network connect |

| CLM-0847 | Priya   | —    | —    | —    | Pre-flight: Quotation rejected |

| CLM-0848 | Oliver  | —    | —    | —    | Pre-flight: Stamped PAID, rejected |

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
