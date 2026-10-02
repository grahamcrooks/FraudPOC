# Health Insurance Fraud Detection POC

A proof of concept showing real-time fraud detection for health insurance claims on Pega Infinity 26.1. A member submits a claim, and it passes through three phases of analysis: Phase 1 receipt forensics (is the receipt genuine?), Phase 2 cross-claim signals (does it fit a pattern across other claims?) and Phase 3 network intelligence (is it connected to known fraud?). Seven scripted scenarios show clean claims going to adjudication, a non-claimable receipt rejected in pre-flight, and suspicious claims going to the Specialist Investigation Unit with a complete evidence package. The demo app is [`index.html`](index.html), served by GitHub Pages, with per-scenario data in [`data/scenarios/`](data/scenarios/).

## Demo guides

- [Run-through script](demo-guides/run-through-script.md): the presenter's script for the one-hour session with fraud analysts, data scientists and architects: timings, what to say at every step, the objectives for each group, the decisions to hold the line on and prepared answers.
- [Demo script](demo-guides/demo-script.md): the current script for running the demo and for system testing: each step with what to say, what happens under the hood, and what to check.
- [Complete guide](demo-guides/complete-guide.md): overview of the phases, scenarios, controls, dashboard and investigation manager. Out of date; to be rewritten.
- [Presenter guide](demo-guides/presenter-guide.md): slide-by-slide and scenario-by-scenario script with what to say and timings. Out of date; to be rewritten.
- [Quick reference](demo-guides/quick-reference.md): one-page card with shortcuts, scenario table, running order and troubleshooting.
- [Technical guide](demo-guides/technical-guide.md): how the app is built, scenario data, phase logic and animation timings. Out of date; to be rewritten.

The original Word files are in [`demo-guides/_source/`](demo-guides/_source/).

## Prompts

- [Configure provider data object](prompts/configure-provider-data-object.md): creates the Provider data object, test providers and the Provider dropdown.
- [Configure claim form sections](prompts/configure-claim-form-sections.md): sets out the claim form fields, line-items table and summary.
- Blueprint case design, run in order in a new Pega GenAI Blueprint, checking the result after each step:
  1. [Application context](prompts/blueprint-case-design/01-application-context.md): the application context and the four personas, with no case types yet.
  2. [Claim case type](prompts/blueprint-case-design/02-claim-case-type.md): six primary stages and two alternate stages.
  3. [Fraud Investigation case type](prompts/blueprint-case-design/03-fraud-investigation-case-type.md): the child case created on referral, connected to the Claim's Referred stage.
  4. [Data model](prompts/blueprint-case-design/04-data-model.md): the data objects and key fields, removing duplicates from the earlier steps.
  5. [AI step details](prompts/blueprint-case-design/05-ai-step-details.md): instructions, inputs and outputs for the three AI steps, which Blueprint marks incomplete until they're filled in.
- [Add the PAID stamp as a disqualifying term](prompts/add-already-paid-disqualifying-term.md): extends SetKeywordMatchResults so a receipt stamped PAID is rejected in pre-flight (disposition AlreadyPaid), matching the stamp on word boundaries, not the substring.
- Create fraud session data objects, run in order:
  1. [GeoSession](prompts/create-fraud-session-data-objects/01-geo-session.md): creates the object that captures where a claim was submitted from.
  2. [DeviceSession](prompts/create-fraud-session-data-objects/02-device-session.md): creates the object that captures the submitting device and browser.
  3. [Claim](prompts/create-fraud-session-data-objects/03-claim.md): embeds both session objects in the Claim and adds the geocode and fingerprint fields that ES-001 and ES-002 need.

## Docs

- [The three phases](docs/three-phases-fraud-signals.md): each phase's fraud signals, explained one by one (original Word file in `docs/_source/`).
- [Reference data](docs/reference-data.md): test practices and practitioners for the claim form dropdowns.
- [Pega Blueprint export](docs/blueprint/README.md): the application's Blueprint file and how to use it.
- [Blueprint requirements](docs/blueprint/blueprint-requirements.md): the whole target design as one requirements document, to upload under "Requirements documents" when starting a new Blueprint. It holds the same content as the four Blueprint prompts; keep them in step.
- [Target case design](docs/blueprint/target-case-design.md): the case design the Blueprint should match: two case types, the stages and steps, how each scenario runs through them, the data model and personas.

## Data

- [Scenario data](data/scenarios/README.md): per-scenario data files (CLM-0841 to CLM-0848): the session block for the sign-in scene, the pre-flight signals and the checks for each pipeline phase.
- [Check explainers](data/check-explainers.js): the plain-English text for the What's happening card beside pre-flight: what each check does and why it matters.
- [Check captions](data/check-captions.js): the default caption for every pre-flight and pipeline check, shared by all scenarios: which component produced the verdict, why it runs where it does and what it costs.

## Assets

- [Slide images](assets/slides/): the five presentation slides (agenda, problem, business case, three phases, why Pega) as full-slide images, shown by `index.html` on the slides screen, `slide-b-network-graph.webp`, the "How the network graph works" explainer, shown as the backup slide and over the pipeline from Phase 3 or the B key, `event-strategy-explainer.webp`, the "How an event strategy works" explainer, shown over the pipeline from Phase 2 or the E key, and `case-workflow-blueprint.webp`, the Pega Blueprint case design (stages and steps) joined from two screenshots, shown over any screen from the pipeline's "Case workflow" button or the W key.

## Tests

- [Stage 1 document validity](tests/stage1-document-validity/): test material for Phase 1 receipt forensics (contents to be added).
