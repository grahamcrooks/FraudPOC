// Default captions for every check, shared by all scenarios.
// Loaded by index.html with a plain <script> tag before the scenario files.
// Keep the object literal valid JSON.
//
// Each caption adds what the panel cannot show: which component produced the
// verdict, why it runs where it does, and whether it's an AI call or a business rule. It never repeats the
// panel's own Looked at / Rule / Found lines.
//
// A scenario's own "captions" block wins over these, key by key, so a scenario
// can still tell its story at a particular beat (for example CLM-0848's PAID
// stamp). See data/scenarios/README.md, "Captions".
window.CHECK_CAPTIONS = {
  "channels": {
    "tag": "How claims arrive",
    "text": "Claims arrive through more than one channel, such as the member's app or the practice's claiming terminal. The app sends device, geolocation and session; the terminal sends terminal ID, merchant ID, provider number, connection and geolocation"
  },
  "terminal:tid": {
    "tag": "Terminal ID",
    "text": "A unique six-character ID for the physical terminal, registered to the practice"
  },
  "terminal:mid": {
    "tag": "Merchant ID",
    "text": "The practice's merchant number: the account that receives the funds"
  },
  "terminal:prov": {
    "tag": "Provider number",
    "text": "Identifies the practitioner at that registered practice location"
  },
  "terminal:conn": {
    "tag": "Connection",
    "text": "How the terminal connected (Ethernet, Wi-Fi or mobile network), with a timestamp"
  },
  "terminal:geo": {
    "tag": "Geolocation",
    "text": "Approximate, from the terminal's IP address, and compared with the practice's registered address"
  },
  "extract": {
    "tag": "Extracted from the receipt",
    "text": "One AI read of the receipt fills in every claim field and says what kind of document it is. The member types nothing. The checks start once it's done"
  },
  "cost:ai": {
    "tag": "Pre-flight · AI",
    "text": "One vision model call classifies the document and returns eleven fields, each with its own confidence score"
  },
  "cost:rule": {
    "tag": "Pre-flight · Rules",
    "text": "Data transforms apply the business rules, included in Pega Platform. The sign-in device and location are attached for Phase 2"
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
  "preflight:SIG-LINE-RECONCILIATION": {
    "tag": "Pre-flight · Line item reconciliation",
    "text": "Data transform, included in Pega Platform. Arithmetic on the extracted fields: the line items must add up to the total charged"
  },
  "preflight:SIG-CLAIM-VALUE": {
    "tag": "Pre-flight · Claim value",
    "text": "SetHighValueFlag. Recorded at $5,000 and above as context for later, not a fraud signal. It never routes a claim on its own"
  },
  "preflight:SIG-DEVICE-LOCATION": {
    "tag": "Pre-flight · Device and location",
    "text": "Captured at sign-in, not from the receipt. This is what ES-001 and ES-002 read in Phase 2"
  },
  "preflightPassed": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. Nothing matched, so the claim proceeds"
  },
  "preflightForensics": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. A total that doesn't reconcile goes to forensics, not rejection: the question is how it was altered"
  },
  "preflightRejected": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. A reject row matched, so the claim stops here"
  },
  "preflightReview": {
    "tag": "Pre-flight · Decision",
    "text": "Decision table Valid Claim. First matching row wins. A review row matched, so a person decides"
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
    "text": "Business rule on the file's own metadata, included in Pega Platform. The authoring trail travels inside the file"
  },
  "phase1:SIG-P1-DUP": {
    "tag": "Phase 1 · Duplicate detection",
    "text": "Business rule against every earlier submission, included in Pega Platform. It stops one receipt being claimed twice"
  },
  "phase2:ES-001": {
    "tag": "Phase 2 · ES-001 Distance anomaly",
    "text": "Real-time event strategy. It reads the location captured at sign-in, not anything on the receipt, and grades the distance from home"
  },
  "phase2:ES-002": {
    "tag": "Phase 2 · ES-002 Device ring",
    "text": "Real-time event strategy. It aggregates distinct members per device over a 72-hour window as claims arrive: a pattern no single claim shows"
  },
  "phase2:ES-003": {
    "tag": "Phase 2 · ES-003 Bank account ring",
    "text": "Real-time event strategy. It aggregates the practices paying into one account over a 30-day window, following where the benefit lands"
  },
  "phase2:ES-004": {
    "tag": "Phase 2 · ES-004 Phantom ABN",
    "text": "Real-time event strategy. It checks the billing practice's ABN against the Australian Business Register as the claim arrives: a cancelled ABN is caught at once"
  },
  "phase2:ES-005": {
    "tag": "Phase 2 · ES-005 Waiver abuse",
    "text": "Real-time event strategy. It counts waiting-period waivers and practice claim volume over a rolling 90 days, against the practice's own baseline"
  },
  "phase3": {
    "tag": "Phase 3 · Network intelligence",
    "text": "Three ways to ask the same question. Is this entity known? Is it connected to one? Does it look like something we've already confirmed? The first is instant and finds the least"
  },
  "phase3:P3-GRAPH": {
    "tag": "Phase 3 · Network graph",
    "text": "Connected: does any path within 3 hops reach a known entity? A graph query over MCP, finding links no single claim contains"
  },
  "phase3:P3-SIMILARITY": {
    "tag": "Phase 3 · Fraud case similarity",
    "text": "Resembles: does this claim look like a confirmed case, with no identifier in common? Knowledge Buddy searches closed investigations and cites what it finds"
  }
};
