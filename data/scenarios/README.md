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
| `cost` | `"ai"`, `"rule"` or `"capture"` | Badge: "AI call", "Business rule — no AI cost" or "Captured for later evaluation". This shows why cheap deterministic checks run before model calls. |
| `lookedAt` | string | What was examined. |
| `rule` | string | The rule applied. State the threshold wherever one exists ("at or above 0.70", "$5,000 or above"); never "above threshold" on its own. |
| `found` | string | What was actually found. Hidden until the check completes. |
| `verdict` | `"pass"`, `"flag"`, `"fail"` or `"skipped"` | Shown as a word (Pass, Flag, Fail, Not run) as well as colour. Flags and fails stay expanded when the panel finishes. Use `skipped` for checks that didn't run because an earlier one stopped the claim. |
| `conclusion` | string | Shown after an arrow; always visible once the check completes. |
| `detail` | object | Optional. Extra label and value pairs, shown under Found when the check is expanded. |

A `capture` records data rather than deciding anything. It has no verdict and uses two fields instead of `lookedAt`, `rule` and `found`:

| Field | Meaning |
| --- | --- |
| `captured` | The captured values, or `"session"` to build them from this file's session block (device ID · profile · IP · location), so the panel can't disagree with the session chip. |
| `usedBy` | Which later strategies use the data. |

The checks play in array order across the same 10 seconds as the upload. The running check expands to show its working and collapses to its summary when the next one starts. When pre-flight completes, every check opens and stays open, laid out in two columns, so the resting state (a booth loop, a pause, a screenshot) shows how every verdict was reached. Clicking a check still toggles it.

## Routing after pre-flight

Pre-flight decides whether the claim reaches the pipeline at all, as in the build:

| Verdicts | What happens |
| --- | --- |
| Any check fails | Stop. No pipeline. Terminal panel: Stage Reject Document, Status Resolved-Rejected, reason shown. "No forensic analysis was run. No referral to the fraud team." |
| Any check flags (and none fail) | Stop. No pipeline. Terminal panel: Stage Needs Review, Status Pending-Review, with the flagged checks' rule and finding for the reviewer. |
| All pass | Continue to the pipeline. |

Submit, Run Fraud Detection and the rolling demo all respect the stop; in rolling mode the demo holds on the outcome for nine seconds, then moves to the next scenario.

The terminal panel's headline and reason come from the deciding checks' conclusions. A scenario can override them with an optional top-level `outcome` object: `{ "headline": "…", "reason": "…", "note": "…" }`.

Scenarios without a `signals` array fall back to the original four verdict-only rows and always continue to the pipeline. All eight scenarios have signals. CLM-0841 to CLM-0846 pass pre-flight, since their stories fail or flag later in the pipeline. CLM-0847 and CLM-0848 fail it, before any forensic AI runs. CLM-0847 is a dental quotation with nothing paid. CLM-0848 is a genuine physio receipt stamped PAID by the practice: authentic in every respect, but the account is already settled, so there is nothing to claim. Neither has `phase1`, `phase2` or `phase3` arrays, because the pipeline never opens.

The disqualifying content check (`SIG-INVALID-KEYWORDS`) matches 11 terms, including the PAID stamp (disposition `AlreadyPaid`). Matching is on the phrase or word boundary, not the substring: the stamp matches, but "amount paid", "paid in full", "unpaid" and "prepaid" on an ordinary receipt do not.

## Captions

A `captions` object gives one line per beat for the rolling demo and for muted video. Each entry is `{ "tag": "…", "text": "…" }`: a short function tag, then the story in plain, present-tense English (6–10 words, from the audience's side). Don't repeat text already on screen.

| Key | When it shows |
| --- | --- |
| `signin`, `particles`, `handoff` | The sign-in scene beats (`handoff` also shows if the scene is skipped) |
| `particle:device`, `particle:location`, `particle:session` | Each signal as it rises out of the phone |
| `upload` | The receipt upload starts |
| `cost:ai`, `cost:rule`, `cost:capture` | A pre-flight check of that cost type starts |
| `preflight:<check id>` | That pre-flight check starts, for example `preflight:SIG-INVALID-KEYWORDS`. Wins over the cost-type caption for that check |
| `preflightPassed`, `preflightRejected`, `preflightReview` | Pre-flight completes with that outcome |
| `phase1`, `phase2`, `phase3` | That pipeline phase starts |
| `outcome` | The fraud detection summary appears |

A missing key keeps the previous caption. Each caption stays up at least 2.5 seconds; quick beats queue. Captions are on by default everywhere; C toggles, and `?captions=off` gives a clean take for a recording.

## Phase 1 array (pipeline receipt forensics)

`phase1` drives Phase 1 in the pipeline modal, on the same renderer as the pre-flight panel: each check shows Looked at, Rule, Found and its conclusion, collapses to its summary line while the next runs, and all six stay open at rest if they fit. When the band, checks and score block together are taller than the card's visible area (measured, not a breakpoint), the passing checks close at rest and flags and fails stay open; a closed check's summary line still carries its figure and threshold. This applies to every phase. Entries have the same shape as `signals`, plus `delay`: when the check starts, in milliseconds from the start of Phase 1 (it completes 1.2 seconds later). Scenarios without a `phase1` array fall back to the checks in the `PHASES` array in `index.html`.

Captions for each check use the key `phase1:<check id>`, for example `phase1:SIG-P1-FONT`.

## Phase 1 scoring

`phase1Scoring` turns the six verdicts into the receipt integrity score, shown as its arithmetic:

| Field | Meaning |
| --- | --- |
| `start` | Starting score, usually 1.00 |
| `threshold` | At or above is CLEAN; below is SUSPICIOUS |
| `weights` | Deduction per check and verdict: `{ "SIG-P1-FONT": { "fail": 0.40 } }`. A pass costs nothing. |
| `action` | One line saying what the verdict causes, shown under the score |

The score deducts for adverse findings only. Extraction confidence is not evidence of tampering, and a low-confidence field is already routed to Needs Review in pre-flight, so it has no row here. A receipt with no deductions shows "No adverse findings". The total is computed from these deductions, never typed in, so the displayed score always reconciles with the lines above it. If the result disagrees with the scenario's pass/fail flag in `PHASES`, the page logs a console warning.

## Phase 2 and Phase 3 arrays

`phase2` (cross-claim signals) and `phase3` (network intelligence) use the same shape as `phase1`, on the same renderer: single column, every check open at rest. Phase 2 holds the three Pega Event Strategies in this build (`ES-001` distance anomaly, `ES-002` device ring, `ES-003` bank account ring), all cost `rule`. Phase 3 holds `P3-GRAPH` (network graph traversal, up to 3 hops from every entity the claim touches), cost `ai`. Fraud case similarity matching is planned, not built, and shows as a planned line under the Phase 3 checks, as the planned strategies do under Phase 2. An optional `tag` adds a pill after the check name, for example `"MCP · Graph"`. A check that didn't run has `"verdict": "skipped"`.

Captions for each check use the key `phase2:<check id>` or `phase3:<check id>`, for example `phase2:ES-003`.

## Phase 2 and Phase 3 results

These phases count signals rather than score. Under the checks the modal lists each one as no signal, SIGNAL or not run, then "Signals raised n of N", then the `action` line from `phase2Result` or `phase3Result`:

```json
"phase2Result": { "action": "No signal raised. Continuing to Phase 3." }
```

If the signal count disagrees with the scenario's pass/fail flag in `PHASES`, the page logs a console warning. Scenarios without a `phase2` or `phase3` array fall back to the `PHASES` array in `index.html`.
