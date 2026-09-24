# Scenario data

Per-scenario data for the demo, one file per scenario, named for the claim (`clm-0841.js`). Each file registers its data on `window.SCENARIO_DATA` under the scenario's claim ID, and `index.html` loads it with a plain `<script>` tag. That keeps the demo working from `file://` as well as from GitHub Pages, with no build step and no `fetch`.

The object literal in each file is valid JSON. Keep it that way so the data can be moved to `.json` files later without changes.

Only the session block lives here so far; the rest of each scenario is still in the `S` array in `index.html`.

## Session block

The session block drives the sign-in scene and the session chip in the portal header.

| Field | Type | Meaning |
| --- | --- | --- |
| `member` | string | Member's full name. The phone greets them by first name. |
| `deviceId` | string | Device fingerprint ID shown in the chip and the Device particle. ES-002 aggregates on it. |
| `deviceProfile` | string | App and platform, shown after the device ID in the Device particle. |
| `ipAddress` | string | Submission IP, shown in the Location particle. Use documentation ranges (`203.0.113.0/24`, `198.51.100.0/24`), never a real address. |
| `location` | string | Suburb and state resolved from the IP, shown in the chip and the Location particle. ES-001 compares it with the registered address. |
| `sessionTime` | string | ISO 8601 with offset, for example `2026-07-12T09:14:00+10:00`. Shown as wall-clock time; `+10:00` displays as AEST and `+11:00` as AEDT. |
| `deviceSeenBefore` | boolean | `true` if the member has claimed before on this device, `false` for a first-time device. Shown in the chip as "recognised device" or "new device"; a new device is a fraud signal in its own right. Set it honestly. |
| `showLogin` | boolean | `true` plays the full sign-in scene when the scenario opens. `false` skips it and fills the chip directly. |

A scenario with no session block hides the chip. It never inherits another scenario's session, because carrying one member's device into another member's claim would show several members on one device, which is the ES-002 signal.

## Device rules

- Every scenario meant to pass ES-002 has its own device ID and its own IP.
- Several members on one device ID is reserved for the ring scenario, where it is the thing that fires. It is never the default.
- Use values from the test pack (`members.csv`, `manifest.json`) so members, suburbs, device IDs and IPs stay consistent, and IPs are documentation-range addresses that geolocate to the suburb in the manifest.

## Replaying part of the scene

`SessionScene.play(session, { beats: ['particles', 'land'], memberNo })` replays only the particle and landing beats, with the phone already signed in. A scenario can use this to show several members submitting from one device: pass a session with a different `member` and the same `deviceId`, and the chip's device slot stays on that ID while the other slots update.
