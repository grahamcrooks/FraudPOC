// Default captions for every check, shared by all scenarios.
// Loaded by index.html with a plain <script> tag before the scenario files.
// Keep the object literal valid JSON.
//
// Each caption adds what the panel cannot show: which component produced the
// verdict, why it runs where it does, and what it costs. It never repeats the
// panel's own Looked at / Rule / Found lines.
//
// A scenario's own "captions" block wins over these, key by key, so a scenario
// can still tell its story at a particular beat (for example CLM-0848's PAID
// stamp). See data/scenarios/README.md, "Captions".
window.CHECK_CAPTIONS = {
  "cost:ai": {
    "tag": "Pre-flight · AI",
    "text": "One vision model call classifies the document and returns eleven fields, each with its own confidence score"
  },
  "cost:rule": {
    "tag": "Pre-flight · Rules",
    "text": "Data transforms apply the business rules, at no AI cost. The sign-in device and location are attached for Phase 2"
  },
  "preflight:SIG-DOC-TYPE": {
    "tag": "Pre-flight · Receipt type",
    "text": "Vision model classifies the document. It must be a tax invoice from a registered health provider"
  },
  "preflight:SIG-FIELD-EXTRACTION": {
    "tag": "Pre-flight · Field extraction",
    "text": "The same model call returns eleven fields, each with its own confidence score"
  },
  "preflight:SIG-EXTRACTION-CONFIDENCE": {
    "tag": "Pre-flight · Extraction confidence",
    "text": "Any critical field below 0.70 sends the claim to a person rather than guessing at it"
  },
  "preflight:SIG-INVALID-KEYWORDS": {
    "tag": "Pre-flight · Disqualifying content",
    "text": "Data transform SetKeywordMatchResults. Eleven terms, maintained by the fraud team. No AI"
  },
  "preflight:SIG-DOC-COMPLETENESS": {
    "tag": "Pre-flight · Receipt completeness",
    "text": "Data transform SetMarkerFlagResults. Amount received, ABN, itemisation, signature"
  },
  "preflight:SIG-CLAIM-VALUE": {
    "tag": "Pre-flight · Claim value",
    "text": "SetHighValueFlag. Recorded at $5,000 and above — context for later, not a fraud signal"
  },
  "preflight:SIG-DEVICE-LOCATION": {
    "tag": "Pre-flight · Device and location",
    "text": "Captured at sign-in, not from the receipt. This is what ES-001 and ES-002 read in Phase 2"
  },
  "preflightPassed": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. Nothing matched, so the claim proceeds"
  },
  "preflightRejected": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. A reject row matched, so the claim stops here"
  },
  "preflightReview": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. A review row matched, so a person decides"
  },
  "phase1:SIG-P1-MATCH": {
    "tag": "Phase 1 · Claim-to-receipt match",
    "text": "Business rule, no AI cost. It runs first because an inflated keyed amount needs no image analysis to spot"
  },
  "phase1:SIG-P1-FONT": {
    "tag": "Phase 1 · Font consistency",
    "text": "AI call on the receipt image. Text edited into a genuine receipt rarely matches the original typeface"
  },
  "phase1:SIG-P1-COLOUR": {
    "tag": "Phase 1 · Colour and stamp analysis",
    "text": "AI call on the image's colour layers. It finds figures or stamps pasted onto a genuine scan"
  },
  "phase1:SIG-P1-AIGEN": {
    "tag": "Phase 1 · AI-generated detection",
    "text": "AI call scoring the image against image-generator signatures. It catches receipts that were never printed"
  },
  "phase1:SIG-P1-META": {
    "tag": "Phase 1 · Metadata and provenance",
    "text": "Business rule on the file's own metadata, no AI cost. The authoring trail travels inside the file"
  },
  "phase1:SIG-P1-DUP": {
    "tag": "Phase 1 · Duplicate detection",
    "text": "Business rule against every earlier submission, no AI cost. It stops one receipt being claimed twice"
  },
  "phase2:ES-001": {
    "tag": "Phase 2 · ES-001 Distance anomaly",
    "text": "Pega Event Strategy, no AI cost. It reads the location captured at sign-in, not anything on the receipt"
  },
  "phase2:ES-002": {
    "tag": "Phase 2 · ES-002 Device ring",
    "text": "Pega Event Strategy, no AI cost. It counts across claims as they arrive, which no single claim can show"
  },
  "phase2:ES-003": {
    "tag": "Phase 2 · ES-003 Bank account ring",
    "text": "Pega Event Strategy, no AI cost. It follows where the benefit lands, not who lodged the claim"
  },
  "phase3:P3-GRAPH": {
    "tag": "Phase 3 · Network graph",
    "text": "Graph query over MCP, an AI call. It runs last, once the cheaper checks have cleared, and finds links no single claim contains"
  }
};
