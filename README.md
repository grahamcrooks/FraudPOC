# Health Insurance Fraud Detection POC

A proof of concept showing real-time fraud detection for health insurance claims on Pega Infinity 26.1. A member submits a claim, and it passes through three phases of analysis: Phase 1 document forensics (is the receipt genuine?), Phase 2 provider and pattern (do the provider and claim pattern make sense?) and Phase 3 organised ring (is it connected to known fraud?). Six scripted scenarios show clean claims going to adjudication and suspicious ones going to the Specialist Investigation Unit with a complete evidence package. The demo app is a single self-contained [`index.html`](index.html), served by GitHub Pages.

## Demo guides

- [Complete guide](demo-guides/complete-guide.md): overview of the phases, scenarios, controls, dashboard and investigation manager.
- [Presenter guide](demo-guides/presenter-guide.md): slide-by-slide and scenario-by-scenario script with what to say and timings.
- [Quick reference](demo-guides/quick-reference.md): one-page card with shortcuts, scenario table, running order and troubleshooting.
- [Technical guide](demo-guides/technical-guide.md): how the app is built, scenario data, phase logic and animation timings.

The original Word files are in [`demo-guides/_source/`](demo-guides/_source/).

## Prompts

- [Configure provider data object](prompts/configure-provider-data-object.md): creates the Provider data object, test providers and the Provider dropdown.
- [Configure claim form sections](prompts/configure-claim-form-sections.md): sets out the claim form fields, line-items table and summary.
- Create fraud session data objects, run in order:
  1. [GeoSession](prompts/create-fraud-session-data-objects/01-geo-session.md): creates the object that captures where a claim was submitted from.
  2. [DeviceSession](prompts/create-fraud-session-data-objects/02-device-session.md): creates the object that captures the submitting device and browser.
  3. [Claim](prompts/create-fraud-session-data-objects/03-claim.md): embeds both session objects in the Claim.

## Docs

- [Claim data model](docs/claim-data-model.md): target ClaimHeader structure and where each field comes from.
- [Reference data](docs/reference-data.md): test practices and practitioners for the claim form dropdowns.
- [Pega Blueprint export](docs/blueprint/README.md): the application's Blueprint file and how to use it.

## Tests

- [Stage 1 document validity](tests/stage1-document-validity/): test material for Phase 1 document forensics (contents to be added).
