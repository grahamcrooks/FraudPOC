# Scenario data

Per-scenario data for the demo, one file per scenario, named for the claim (`clm-0841.js`). Each file registers its data on `window.SCENARIO_DATA` under the scenario's claim ID, and `index.html` loads it with a plain `<script>` tag. That keeps the demo working from `file://` as well as from GitHub Pages, with no build step and no `fetch`.

The object literal in each file is valid JSON. Keep it that way so the data can be moved to `.json` files later without changes.

Every scenario (CLM-0841 to CLM-0846) has a session block; only CLM-0841 plays the sign-in scene. Each file can hold a `session` block and a `signals` array; the rest of each scenario is still in the `S` array in `index.html`.

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
| `deviceStatus` | `"recognised"` or `"new"` | `recognised` if the member has claimed before on this device, `new` for a first-time device. Shown in the chip as "recognised device" or "new device"; a new device is a fraud signal in its own right. Set it honestly. (The older boolean `deviceSeenBefore` is still read if `deviceStatus` is absent.) |
| `frame` | `"phone"` | Optional; defaults to `phone`. The device frame the scene plays in. All member scenarios are phones. A `browser` frame is reserved for the ring scenario, where one person on a laptop lodging for several members is part of the tell; it isn't built yet. |
| `showLogin` | boolean | `true` plays the full sign-in scene when the scenario opens. `false` skips it and fills the chip directly. |

A scenario with no session block hides the chip. It never inherits another scenario's session, because carrying one member's device into another member's claim would show several members on one device, which is the ES-002 signal.

## Device rules

- Every scenario meant to pass ES-002 has its own device ID and its own IP.
- Several members on one device ID is reserved for the ring scenario, where it is the thing that fires. It is never the default.
- Use values from the test pack (`members.csv`, `manifest.json`) so members, suburbs, device IDs and IPs stay consistent, and IPs are documentation-range addresses that geolocate to the suburb in the manifest.

## Scene pace

The sign-in scene runs at pace 2 by default (about 12 seconds) so a presenter can talk through each beat. Add `?pace=1` to the address for the original 6-second version, or up to `?pace=4` for slower. Rolling mode waits for the scene before starting the upload.

## Replaying part of the scene

`SessionScene.play(session, { beats: ['particles', 'land'], memberNo, frame })` replays only the particle and landing beats, with the device already signed in. Frames are registered in `SESSION_FRAMES` in `index.html`; particles and the handoff outline take their origin and shape from the active frame, so the ring scenario's browser frame needs its markup and one registry entry, not a rebuild. A scenario can use this to show several members submitting from one device: pass a session with a different `member` and the same `deviceId`, and the chip's device slot stays on that ID while the other slots update.

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

The checks play in array order across the same 10 seconds as the upload. The running check expands to show its working and collapses when the next one starts. Any check can be clicked open again.

## Routing after pre-flight

Pre-flight decides whether the claim reaches the pipeline at all, as in the build:

| Verdicts | What happens |
| --- | --- |
| Any check fails | Stop. No pipeline. Terminal panel: Stage Reject Document, Status Resolved-Rejected, reason shown. "No forensic analysis was run. No referral to the fraud team." |
| Any check flags (and none fail) | Stop. No pipeline. Terminal panel: Stage Needs Review, Status Pending-Review, with the flagged checks' rule and finding for the reviewer. |
| All pass | Continue to the pipeline. |

Submit, Run Fraud Detection and the rolling demo all respect the stop; in rolling mode the demo holds on the outcome for nine seconds, then moves to the next scenario.

The terminal panel's headline and reason come from the deciding checks' conclusions. A scenario can override them with an optional top-level `outcome` object: `{ "headline": "…", "reason": "…", "note": "…" }`.

Scenarios without a `signals` array fall back to the original four verdict-only rows and always continue to the pipeline. At present only CLM-0841 has signals.

## Captions

A `captions` object gives one line per beat for the rolling demo and for muted video. Each entry is `{ "tag": "…", "text": "…" }`: a short function tag, then the story in plain, present-tense English (6–10 words, from the audience's side). Don't repeat text already on screen.

| Key | When it shows |
| --- | --- |
| `signin`, `particles`, `handoff` | The three sign-in scene beats (`handoff` also shows if the scene is skipped) |
| `upload` | The receipt upload starts |
| `cost:ai`, `cost:rule`, `cost:capture` | A pre-flight check of that cost type starts |
| `preflightPassed`, `preflightRejected`, `preflightReview` | Pre-flight completes with that outcome |
| `phase1`, `phase2`, `phase3` | That pipeline phase starts |
| `outcome` | The fraud detection summary appears |

A missing key keeps the previous caption. Each caption stays up at least 2.5 seconds; quick beats queue. Captions are on by default in rolling mode and off while presenting; C toggles, and `?captions=on` or `?captions=off` fixes the setting.
