# Scenario data

Per-scenario data for the demo, one file per scenario, named for the claim (`clm-0841.js`). Each file registers its data on `window.SCENARIO_DATA` under the scenario's claim ID, and `index.html` loads it with a plain `<script>` tag. That keeps the demo working from `file://` as well as from GitHub Pages, with no build step and no `fetch`.

The object literal in each file is valid JSON. Keep it that way so the data can be moved to `.json` files later without changes.

Every scenario (CLM-0841 to CLM-0848) has a session block; CLM-0841 plays the sign-in scene on the phone and CLM-0844 on the laptop browser. Each file can hold a `session` block and a `signals` array; the rest of each scenario is still in the `S` array in `index.html`.

## Session block

The session block drives the sign-in scene and the session chip in the portal header.

| Field | Type | Meaning |
| --- | --- | --- |
| `member` | string | Optional. Member's full name for the phone greeting; defaults to the scenario's member. |
| `deviceId` | string | Device fingerprint ID shown in the chip and the Device particle. ES-002 aggregates on it. |
| `deviceProfile` | string | App and platform, shown after the device ID in the Device particle. Use the generic H+ brand ("H+ App v4.2 (iOS)") or a browser ("Web · Chrome (macOS)"), never a real insurer's app name. |
| `ipAddress` | string | Submission IP, shown in the Location particle. Use documentation ranges (`203.0.113.0/24`, `198.51.100.0/24`), never a real address. |
| `location` | string | Suburb and state resolved from the IP, shown in the chip and the Location particle. ES-001 compares it with the registered address. |
| `sessionTime` | string | ISO 8601 with offset, for example `2026-07-12T09:14:00+10:00`. Shown as wall-clock time; `+10:00` displays as AEST and `+11:00` as AEDT. |
| `explain` | object | Optional. Overrides the "used for" line on each particle: `{ "device": "…", "location": "…", "session": "…" }`. The defaults name ES-002, ES-001 and the session link. |
| `deviceStatus` | `"recognised"` or `"new"` | `recognised` if the member has claimed before on this device, `new` for a first-time device. Shown in the chip as "recognised device" or "new device"; a new device is a fraud signal in its own right. Set it honestly. (The older boolean `deviceSeenBefore` is still read if `deviceStatus` is absent.) |
| `frame` | `"phone"` or `"browser"` | Optional; defaults to `phone`. The device frame the scene plays in. Member scenarios are phones. `browser` is a laptop on the H+ member website, used by the device ring scenario (CLM-0844), where one person on a laptop lodging for several members is part of the tell. |
| `showLogin` | boolean | `true` plays the full sign-in scene when the scenario opens. `false` skips it and fills the chip directly. |

A scenario with no session block hides the chip. It never inherits another scenario's session, because carrying one member's device into another member's claim would show several members on one device, which is the ES-002 signal.

## Device rules

- Every scenario meant to pass ES-002 has its own device ID and its own IP.
- Several members on one device ID is reserved for the ring scenario, where it is the thing that fires. It is never the default.
- Use values from the test pack (`members.csv`, `manifest.json`) so members, suburbs, device IDs and IPs stay consistent, and IPs are documentation-range addresses that geolocate to the suburb in the manifest.

## Scene pace

The sign-in scene runs at pace 2 by default (about 20 seconds) so a presenter can talk through each beat; the three signals rise one at a time, each with its own caption. Add `?pace=1` to the address for a 10-second version, or up to `?pace=4` for slower. Rolling mode waits for the scene before starting the upload.

## Replaying part of the scene

`SessionScene.play(session, { beats: ['particles', 'land'], memberNo, frame })` replays only the particle and landing beats, with the device already signed in. Frames are registered in `SESSION_FRAMES` in `index.html`; particles and the handoff outline take their origin and shape from the active frame, so a new frame needs its markup and one registry entry, not a rebuild. Each entry also sets the device icon, the verification step (Face ID or one-time code) and the "Simulated" caption line. A scenario can use this to show several members submitting from one device: pass a session with a different `member` and the same `deviceId`, and the chip's device slot stays on that ID while the other slots update.

## Signals array (Phase 1 pre-flight)

The `signals` array drives the Phase 1 panel on the claim lodgement screen. Each check renders in the same fixed shape, so a reader learns it once:

```
[icon] Check name                      [cost badge] [verdict]
       Looked at:  what was examined
       Rule:       the rule applied, including any threshold
       Found:      what was actually found
       → Conclusion
```

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable ID, for example `SIG-DOC-TYPE`. `SIG-FIELD-EXTRACTION` also fills the claim form when it completes. |
| `name` | string | Check name. |
| `summary` | string | One line kept beside the name once the check completes, so a collapsed check still shows how it was decided: the deciding figure and, wherever the rule has one, its threshold ("lowest 0.92 (ServiceDate) · threshold 0.70"). If absent, it is derived from the first figure in `found` plus the rule's threshold. |
| `cost` | `"ai"`, `"rule"`, `"stream"` or `"capture"` | Badge: "AI call — no token cost", "Business rule — included in Pega Platform", "Real-time event strategy — included in Pega Platform" or "Captured for later evaluation". This shows why instant, deterministic checks run before model calls. |
| `lookedAt` | string | What was examined. |
| `rule` | string | The rule applied. State the threshold wherever one exists ("at or above 0.70", "$5,000 or above"); never "above threshold" on its own. |
| `found` | string | What was actually found. Hidden until the check completes. |
| `verdict` | `"pass"`, `"flag"`, `"fail"` or `"skipped"` | Shown as a word (Pass, Flag, Fail, Not run) as well as colour. Flags and fails stay expanded when the panel finishes. Use `skipped` for checks that didn't run because an earlier one stopped the claim. |
| `conclusion` | string | Shown after an arrow; always visible once the check completes. |
| `detail` | object | Optional. Extra label and value pairs, shown under Found when the check is expanded. |
| `routes` | boolean | Optional; defaults to `true`. `false` marks a context check whose verdict is recorded but never decides the route. Claim value (`SIG-CLAIM-VALUE`) uses it: a high-value claim is context for later phases, not a reason to hold it. |
| `onFail` | `"forensics"` | Optional. On a fail, sends the claim on to Phase 1 instead of rejecting it. Line item reconciliation uses it on CLM-0842: a total that doesn't reconcile to its line items is a forensics question, how it was altered. |
| `escalation` | string | Optional, with `onFail`. The line shown in the pre-flight result when the check sends the claim to forensics, for example "The total doesn't reconcile. Running forensics to see how it was altered." |

A `capture` records data rather than deciding anything. It has no verdict and uses two fields instead of `lookedAt`, `rule` and `found`:

| Field | Meaning |
| --- | --- |
| `captured` | The captured values, or `"session"` to build them from this file's session block (device ID · profile · IP · location), so the panel can't disagree with the session chip. |
| `usedBy` | Which later strategies use the data. |

Pre-flight takes a fixed 40 seconds (`PF_TOTAL`) in every mode. The capture runs first (`PF_CAPTURE`), then the claim fields fill in one by one from the AI read (`PF_FILL`), then the other checks play in array order, sharing the rest of the time equally; none starts until every field has filled. The order is device and location, field extraction, extraction confidence, receipt type, disqualifying content, receipt completeness, line item reconciliation, claim value, with the What's happening card explaining each (text in `data/check-explainers.js`, keyed by check id). The running check expands to show its working and collapses to its summary when the next one starts. When pre-flight completes, every check opens and stays open, laid out in two columns, so the resting state (a booth loop, a pause, a screenshot) shows how every verdict was reached. Clicking a check still toggles it.

## Routing after pre-flight

Pre-flight decides whether the claim reaches the pipeline at all, as in the build:

| Verdicts | What happens |
| --- | --- |
| Any routing check fails (other than one marked `"onFail": "forensics"`) | Stop. No pipeline. Terminal panel: Stage Reject Document, Status Resolved-Rejected, reason shown. "No forensic analysis was run. No referral to the fraud team." |
| Any routing check flags (and none fail) | Stop. No pipeline. Terminal panel: Stage Needs Review, Status Pending-Review, with the flagged checks' rule and finding for the reviewer. |
| A check marked `"onFail": "forensics"` fails, and nothing else fails or flags | Continue to the pipeline. The result turns amber, names the failed check and shows its `escalation` line. |
| All pass | Continue to the pipeline. |

Submit, Receipt Forensics and the rolling demo all respect the stop; in rolling mode the demo holds on the outcome for nine seconds, then moves to the next scenario.

The terminal panel's headline and reason come from the deciding checks' conclusions. A scenario can override them with an optional top-level `outcome` object: `{ "headline": "…", "reason": "…", "note": "…" }`.

Scenarios without a `signals` array fall back to the original four verdict-only rows and always continue to the pipeline. All eight scenarios have signals. CLM-0841 and CLM-0843 to CLM-0846 pass pre-flight, since their stories fail or flag later in the pipeline. CLM-0842 fails line item reconciliation (a doctored total: $487.50 stated, line items summing to $445.00) and goes on to Phase 1, whose forensics show how the total was altered. CLM-0847 and CLM-0848 fail it, before any forensic AI runs. CLM-0847 is a dental quotation with nothing paid. CLM-0848 is a genuine physio receipt stamped PAID by the practice: authentic in every respect, but the account is already settled, so there is nothing to claim. Neither has `phase1`, `phase2` or `phase3` arrays, because the pipeline never opens.

The disqualifying content check (`SIG-INVALID-KEYWORDS`) matches 11 terms, including the PAID stamp (disposition `AlreadyPaid`). Matching is on the phrase or word boundary, not the substring: the stamp matches, but "amount paid", "paid in full", "unpaid" and "prepaid" on an ordinary receipt do not.

## Captions

Captions give one line per beat, for the rolling demo and for muted video. Each entry is `{ "tag": "…", "text": "…" }`: a short function tag, then plain, present-tense English.

Every check has a default caption in `data/check-captions.js`, shared by all scenarios. A check caption adds what the panel cannot show: which component produced the verdict (a vision model call, a named data transform or decision table, a Pega Event Strategy, a graph query over MCP), why it runs where it does, and whether it's an AI call or a business rule. It never repeats the panel's own Looked at, Rule and Found lines.

A scenario's own `captions` object wins over the defaults, key by key. Use it for the story beats only a scenario can tell: the sign-in scene, the upload, the phase openings, the outcome, and a check that carries the scenario's point (CLM-0848's PAID stamp). Don't copy a default into a scenario to reword it; change the default.

| Key | When it shows |
| --- | --- |
| `signin`, `particles`, `handoff` | The sign-in scene beats (`handoff` also shows if the scene is skipped) |
| `particle:device`, `particle:location`, `particle:session` | Each signal as it rises out of the phone |
| `upload` | The receipt upload starts |
| `preflight:<check id>` | That pre-flight check starts, for example `preflight:SIG-INVALID-KEYWORDS`. In the rolling demo every check shows its own; while presenting, only a scenario's own `preflight:` caption does |
| `cost:ai`, `cost:rule`, `cost:capture` | While presenting, a pre-flight check of that cost type starts. The capture joins the rules caption unless a scenario defines `cost:capture` |
| `preflightPassed`, `preflightRejected`, `preflightReview` | Pre-flight completes with that outcome: the Valid Claim decision table's verdict |
| `phase1`, `phase2`, `phase3` | That pipeline phase starts |
| `phase1:<check id>`, `phase2:<check id>`, `phase3:<check id>` | That pipeline check starts, in both modes |
| `outcome` | The fraud detection summary appears |

### Pacing

Every check gets its own step in every mode, so the What's happening card can be read; the captions differ by mode:

| Mode | Pre-flight | Captions |
| --- | --- | --- |
| Presenting and step-by-step (the default) | 40 seconds: capture, the fields fill, then seven checks of about 4 seconds | Grouped: the AI reads, the business rules, the decision |
| Rolling demo (booth, unattended) | The same 40 seconds | One per check, then the decision |

The pipeline phases keep their timing in both modes, and each pipeline check shows its own caption. Every timer that waits for pre-flight (the pipeline opening, the rolling demo's next step, the resting state) reads the same duration, `preflightMs()`, so nothing can drift apart.

A missing key keeps the previous caption. Each caption stays up at least 2.5 seconds; quick beats queue. Captions are on by default everywhere; C toggles, and `?captions=off` gives a clean take for a recording.

## Phase 1 array (pipeline receipt forensics)

`phase1` drives Phase 1 in the pipeline modal, on the same renderer as the pre-flight panel: each check shows Looked at, Rule, Found and its conclusion, collapses to its summary line while the next runs, and all five stay open at rest if they fit. When the band, checks and score block together are taller than the card's visible area (measured, not a breakpoint), the passing checks close at rest and flags and fails stay open; a closed check's summary line still carries its figure and threshold. This applies to every phase. Entries have the same shape as `signals`, plus `delay`: when the check starts, in milliseconds from the start of Phase 1 (it completes 1.2 seconds later). Scenarios without a `phase1` array fall back to the checks in the `PHASES` array in `index.html`.

Captions for each check use the key `phase1:<check id>`, for example `phase1:SIG-P1-FONT`.

## Phase 1 scoring

`phase1Scoring` turns the five verdicts into the receipt integrity score, shown as its arithmetic:

| Field | Meaning |
| --- | --- |
| `start` | Starting score, usually 1.00 |
| `threshold` | At or above is CLEAN; below is SUSPICIOUS |
| `weights` | Deduction per check and verdict: `{ "SIG-P1-FONT": { "fail": 0.40 } }`. A pass costs nothing. A weight can name a pre-flight check: its verdict then carries into the score as a row marked "(pre-flight)". CLM-0842 does this for line item reconciliation, so the outcome combines both stages. |
| `action` | One line saying what the verdict causes, shown under the score |

The score deducts for adverse findings only. Extraction confidence is not evidence of tampering, and a low-confidence field is already routed to Needs Review in pre-flight, so it has no row here. A receipt with no deductions shows "No adverse findings". The total is computed from these deductions, never typed in, so the displayed score always reconciles with the lines above it. If the result disagrees with the scenario's pass/fail flag in `PHASES`, the page logs a console warning.

## Phase 2 and Phase 3 arrays

`phase2` (cross-claim signals) and `phase3` (network intelligence) use the same shape as `phase1`, on the same renderer: single column, every check open at rest. Phase 2 holds the five Pega Event Strategies in this build (`ES-001` distance anomaly, `ES-002` device ring, `ES-003` bank account ring, `ES-004` phantom ABN, `ES-005` waiver abuse), all cost `rule`. Phase 3 holds three checks, in escalating order of "have we seen this before": `P3-WATCHLIST` (exact: any entity on the claim on the confirmed or monitored list), cost `rule`; `P3-GRAPH` (connected: any path within 3 hops to a known entity), cost `ai`; and `P3-SIMILARITY` (resembles: the claim's shape against closed investigation write-ups, via Pega GenAI Knowledge Buddy), cost `ai`. Similarity returns cited cases, never a score, and a similarity result alone never routes a claim. "Monitored" means under investigation. Each Phase 3 check also has a `metric`, one line shown in the phase's derivation block (for example `"0 confirmed · 1 monitored"`), and `phase3Result` has a `verdict` for the block's last line (for example `"RING DETECTED"`). An optional `tag` adds a pill after the check name, for example `"MCP · Graph"`. A check that didn't run has `"verdict": "skipped"`.

Captions for each check use the key `phase2:<check id>` or `phase3:<check id>`, for example `phase2:ES-003`.

## Phase 2 and Phase 3 results

These phases count signals rather than score. For Phase 2, under the checks the modal lists each one as no signal, SIGNAL or not run, then "Signals raised n of N", then the `action` line from `phase2Result`. Phase 3 lists each check's `metric`, then "Network verdict" from `phase3Result.verdict`, then its `action`. A Phase 3 with flags but no fail shows amber and routes for review:

```json
"phase2Result": { "action": "No signal raised. Continuing to Phase 3." }
```

If the signal count disagrees with the scenario's pass/fail flag in `PHASES`, the page logs a console warning. Scenarios without a `phase2` or `phase3` array fall back to the `PHASES` array in `index.html`.
