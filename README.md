# Health Insurance Fraud Detection POC

A proof of concept showing real-time fraud detection for health insurance claims on Pega Infinity 26.1. A member submits a claim, and it passes through three phases of analysis: Phase 1 receipt forensics (is the receipt genuine?), Phase 2 cross-claim signals (does it fit a pattern across other claims?) and Phase 3 network intelligence (is it connected to known fraud?). Seven scripted scenarios show clean claims going to adjudication, a non-claimable receipt rejected in pre-flight, and suspicious claims going to the Specialist Investigation Unit with a complete evidence package. The demo app is [`index.html`](index.html), served by GitHub Pages, with per-scenario data in [`data/scenarios/`](data/scenarios/).

## Demo guides

- [Demo script](demo-guides/demo-script.md): the current script for running the demo and for system testing: each step with what to say, what happens under the hood, and what to check.
- [Complete guide](demo-guides/complete-guide.md): overview of the phases, scenarios, controls, dashboard and investigation manager. Out of date; to be rewritten.
- [Presenter guide](demo-guides/presenter-guide.md): slide-by-slide and scenario-by-scenario script with what to say and timings. Out of date; to be rewritten.
- [Quick reference](demo-guides/quick-reference.md): one-page card with shortcuts, scenario table, running order and troubleshooting.
- [Technical guide](demo-guides/technical-guide.md): how the app is built, scenario data, phase logic and animation timings. Out of date; to be rewritten.

The original Word files are in [`demo-guides/_source/`](demo-guides/_source/).

## Prompts

- [Configure provider data object](prompts/configure-provider-data-object.md): creates the Provider data object, test providers and the Provider dropdown.
- [Configure claim form sections](prompts/configure-claim-form-sections.md): sets out the claim form fields, line-items table and summary.
- [Add the PAID stamp as a disqualifying term](prompts/add-already-paid-disqualifying-term.md): extends SetKeywordMatchResults so a receipt stamped PAID is rejected in pre-flight (disposition AlreadyPaid), matching the stamp on word boundaries, not the substring.
- Create fraud session data objects, run in order:
  1. [GeoSession](prompts/create-fraud-session-data-objects/01-geo-session.md): creates the object that captures where a claim was submitted from.
  2. [DeviceSession](prompts/create-fraud-session-data-objects/02-device-session.md): creates the object that captures the submitting device and browser.
  3. [Claim](prompts/create-fraud-session-data-objects/03-claim.md): embeds both session objects in the Claim and adds the geocode and fingerprint fields that ES-001 and ES-002 need.

## Docs

- [The three phases](docs/three-phases-fraud-signals.md): each phase's fraud signals, explained one by one (original Word file in `docs/_source/`).
- [Reference data](docs/reference-data.md): test practices and practitioners for the claim form dropdowns.
- [Pega Blueprint export](docs/blueprint/README.md): the application's Blueprint file and how to use it.

## Data

- [Scenario data](data/scenarios/README.md): per-scenario data files (CLM-0841 to CLM-0848): the session block for the sign-in scene, the pre-flight signals and the checks for each pipeline phase.
- [Check captions](data/check-captions.js): the default caption for every pre-flight and pipeline check, shared by all scenarios: which component produced the verdict, why it runs where it does and what it costs.

## Tests

- [Stage 1 document validity](tests/stage1-document-validity/): test material for Phase 1 receipt forensics (contents to be added).
