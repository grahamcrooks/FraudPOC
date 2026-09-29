// Scenario data for CLM-2024-0841 (James Kowalski, clean dental claim).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0841'] = {
  "session": {
    "member": "James Kowalski",
    "deviceId": "DEV-2291",
    "deviceProfile": "H+ App v4.2 (iOS)",
    "ipAddress": "203.0.113.18",
    "location": "Carlton VIC",
    "sessionTime": "2026-07-12T09:14:00+10:00",
    "deviceStatus": "recognised",
    "showLogin": true
  },
  "signals": [
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-2291 · Carlton VIC · captured at sign-in",
      "cost": "capture",
      "captured": "session",
      "usedBy": "ES-001 distance anomaly, ES-002 device ring",
      "conclusion": "Recorded, no evaluation at this stage"
    },
    {
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $312.00 · items 011, 022, 114",
      "cost": "ai",
      "lookedAt": "Full receipt, 1,204 characters",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "Bright Smile Dental · items 011, 022, 114 · $312.00 · 12 Jul 2026",
      "verdict": "pass",
      "conclusion": "11 of 11 required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.92 (ServiceDate) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest was ServiceDate at 0.92 · ProviderABN 0.97 · InvoiceTotal 0.95",
      "verdict": "pass",
      "conclusion": "All fields above threshold"
    },
    {
      "id": "SIG-DOC-TYPE",
      "name": "Receipt type",
      "summary": "TAX INVOICE · ABN and AHPRA present",
      "cost": "ai",
      "lookedAt": "Header, footer and declaration text",
      "rule": "Must be a tax invoice from a registered health provider",
      "found": "\"TAX INVOICE\" · ABN present · AHPRA registration present · ADA item code schedule",
      "verdict": "pass",
      "conclusion": "Dental healthcare receipt"
    },
    {
      "id": "SIG-INVALID-KEYWORDS",
      "name": "Disqualifying content",
      "summary": "11 terms checked · none found",
      "cost": "rule",
      "lookedAt": "Extracted receipt text",
      "rule": "11 disqualifying terms, for example non-medical, quotation, proforma, PAID stamp",
      "found": "None",
      "verdict": "pass",
      "conclusion": "No disqualifying content"
    },
    {
      "id": "SIG-DOC-COMPLETENESS",
      "name": "Receipt completeness",
      "summary": "$312.00 received of $312.00 · ABN ✓ · 3 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Amount received recorded against amount charged, valid tax invoice, itemised, signed",
      "found": "$312.00 received against $312.00 charged · ABN present · 3 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete — member paid in full"
    },
    {
      "id": "SIG-LINE-RECONCILIATION",
      "name": "Line item reconciliation",
      "summary": "items reconcile to the total",
      "cost": "rule",
      "lookedAt": "Extracted line items against the stated total",
      "rule": "Line items must sum to the total charged",
      "found": "Items sum to $312.00 · stated total $312.00",
      "verdict": "pass",
      "conclusion": "Line items reconcile"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$312.00 claimable · marker at $5,000",
      "cost": "rule",
      "routes": false,
      "lookedAt": "Claimable line items",
      "rule": "Recorded at $5,000 or above as context for later checks. Never routes the claim on its own",
      "found": "$312.00 claimable",
      "verdict": "pass",
      "conclusion": "Under $5,000, no high-value marker"
    }
  ],
  "captions": {
    "signin": {
      "tag": "Session capture",
      "text": "James signs in to the H+ app with Face ID"
    },
    "particles": {
      "tag": "Session capture",
      "text": "Three signals are captured at sign-in, before any claim exists"
    },
    "particle:device": {
      "tag": "Session capture · Device",
      "text": "The phone's fingerprint. ES-002 checks whether other members lodge from it"
    },
    "particle:location": {
      "tag": "Session capture · Geolocation",
      "text": "Where the claimant signed in, from the IP. ES-001 checks the distance from home"
    },
    "particle:session": {
      "tag": "Session capture · Session",
      "text": "When the claimant signed in. The claim stays tied to this session"
    },
    "handoff": {
      "tag": "Session capture",
      "text": "The session data stays with the claim through every step of processing"
    },
    "upload": {
      "tag": "Lodgement",
      "text": "The claimant uploads a dental receipt"
    },
    "phase1": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "Forensic checks look for tampering, forgery and AI-made receipts"
    },
    "phase2": {
      "tag": "Phase 2 · Cross-claim signals",
      "text": "Event strategies compare this claim with patterns across all claims"
    },
    "outcome": {
      "tag": "Outcome",
      "text": "No suspicious activity: James's claim goes to normal adjudication"
    }
  },
  "phase1": [
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "1 typeface · Arial 9pt throughout",
      "cost": "ai",
      "delay": 2200,
      "lookedAt": "Every text run in the receipt — typeface, size, weight",
      "rule": "A genuine receipt prints in one typeface; spliced text is the commonest alteration",
      "found": "Arial 9pt throughout · 1 typeface · no size or weight breaks",
      "verdict": "pass",
      "conclusion": "No evidence of spliced text"
    },
    {
      "id": "SIG-P1-COLOUR",
      "name": "Colour and stamp analysis",
      "summary": "no overlay regions · uniform compression",
      "cost": "ai",
      "delay": 5000,
      "lookedAt": "Colour layers, stamp regions, compression artefacts",
      "rule": "Digital overlays leave colour discontinuities the original scan does not have",
      "found": "No overlay regions · StampDetectedFlag FALSE · uniform compression",
      "verdict": "pass",
      "conclusion": "No digital overlay"
    },
    {
      "id": "SIG-P1-AIGEN",
      "name": "AI-generated detection",
      "summary": "score 0.02 · threshold 0.15",
      "cost": "ai",
      "delay": 7800,
      "lookedAt": "Pixel-level artefacts characteristic of image generators",
      "rule": "Generative signature score at or below 0.15",
      "found": "0.02",
      "verdict": "pass",
      "conclusion": "Not a generated image"
    },
    {
      "id": "SIG-P1-META",
      "name": "Metadata and provenance",
      "summary": "clinic practice software · created 12 Jul 2026 · matches service date",
      "cost": "rule",
      "delay": 10400,
      "lookedAt": "File authoring trail, creation and modification timestamps",
      "rule": "Authoring software should be practice software, and timestamps must not post-date the service",
      "found": "Authored by clinic practice software · created 12 Jul 2026 · not modified since · matches the service date",
      "verdict": "pass",
      "conclusion": "Provenance consistent with the service"
    },
    {
      "id": "SIG-P1-DUP",
      "name": "Duplicate detection",
      "summary": "0 prior submissions of this fingerprint",
      "cost": "rule",
      "delay": 12800,
      "lookedAt": "Receipt fingerprint against every claim already submitted",
      "rule": "Same practice and receipt number, or an identical fingerprint, is a duplicate",
      "found": "0 prior submissions of this fingerprint",
      "verdict": "pass",
      "conclusion": "First submission of this receipt"
    }
  ],
  "phase1Scoring": {
    "start": 1.0,
    "threshold": 0.7,
    "weights": {
      "SIG-P1-FONT": {
        "fail": 0.4
      },
      "SIG-P1-META": {
        "fail": 0.25
      }
    },
    "action": "No adverse findings on the receipt. That does not make it a clean claim — continuing to Phase 2 cross-claim signals."
  },
  "phase2": [
    {
      "id": "ES-001",
      "name": "ES-001 Distance anomaly",
      "summary": "0.4 km from registered address · threshold 500 km",
      "cost": "stream",
      "delay": 4000,
      "lookedAt": "Submission IP geolocation against the member's registered address",
      "rule": "Graded — over 500 km moderate, over 1,500 km high, overseas critical",
      "found": "Submitted from Carlton VIC, registered address Carlton VIC — 0.4 km",
      "verdict": "pass",
      "conclusion": "Lodged from home. No distance signal"
    },
    {
      "id": "ES-002",
      "name": "ES-002 Device ring",
      "summary": "1 member on this device · threshold 3",
      "cost": "stream",
      "delay": 10000,
      "lookedAt": "Distinct members submitting from device DEV-2291 in the last 72 hours",
      "rule": "Three or more unrelated members on one device. Members sharing a membership and address are a household, not a ring",
      "found": "1 member on this device — James Kowalski only",
      "verdict": "pass",
      "conclusion": "No device ring"
    },
    {
      "id": "ES-003",
      "name": "ES-003 Bank account ring",
      "summary": "1 practice on this account · threshold 3",
      "cost": "stream",
      "delay": 16000,
      "lookedAt": "Distinct practice ABNs paying into this account in the last 30 days",
      "rule": "Three or more unrelated practices converging on one account",
      "found": "1 practice — Bright Smile Dental, ABN 42 198 776 334, its own registered account",
      "verdict": "pass",
      "conclusion": "No account convergence"
    },
    {
      "id": "ES-004",
      "name": "ES-004 Phantom ABN",
      "summary": "ABN active · registered to the billing practice",
      "cost": "stream",
      "delay": 22000,
      "lookedAt": "The billing practice's ABN against the Australian Business Register",
      "rule": "A cancelled, deregistered or invalid ABN, or one registered to a different entity",
      "found": "ABN 42 198 776 334 · active · registered to Bright Smile Dental",
      "verdict": "pass",
      "conclusion": "Real, registered practice. No phantom ABN signal"
    },
    {
      "id": "ES-005",
      "name": "ES-005 Waiver abuse",
      "summary": "0 waivers · practice volume 1.1× its 90-day baseline · threshold 3×",
      "cost": "stream",
      "delay": 28000,
      "lookedAt": "Waiting-period waivers and claim volume for this member and practice over a rolling 90 days",
      "rule": "Repeated waiting-period waivers for one member, or practice claim volume at three times its 90-day baseline",
      "found": "No waivers on this membership · Bright Smile Dental at 1.1× its baseline",
      "verdict": "pass",
      "conclusion": "No waiver abuse signal"
    }
  ],
  "phase2Result": {
    "action": "No suspicious cross-claim pattern detected. Continuing to Phase 3."
  },
  "phase3": [
    {
      "id": "P3-WATCHLIST",
      "name": "Watchlist match",
      "summary": "7 entities checked · 0 matches",
      "cost": "rule",
      "delay": 1400,
      "lookedAt": "Every entity on this claim against the confirmed and monitored entity lists: member, practice, ABN, practitioner, device, submission IP, payee account",
      "rule": "A direct match to a confirmed fraud entity refers the claim. A match to a monitored entity (one under investigation) raises a flag",
      "found": "7 entities checked · no match on either list",
      "verdict": "pass",
      "conclusion": "No entity on this claim is known to us",
      "metric": "0 confirmed · 0 monitored"
    },
    {
      "id": "P3-GRAPH",
      "name": "Network graph",
      "tag": "MCP · Graph",
      "summary": "0 connections within 3 hops",
      "cost": "ai",
      "delay": 3600,
      "lookedAt": "Every entity the claim touches, up to 3 hops: member, practice, practitioner, device, submission IP, payment account",
      "rule": "Any path within 3 hops to a confirmed fraud community or a monitored entity (one under investigation)",
      "found": "18 entities within 3 hops · none confirmed or monitored",
      "verdict": "pass",
      "conclusion": "Graph clear",
      "metric": "18 entities within 3 hops · 0 confirmed"
    },
    {
      "id": "P3-SIMILARITY",
      "name": "Fraud case similarity",
      "tag": "GenAI · Knowledge Buddy",
      "summary": "412 cases searched · no comparable case",
      "cost": "ai",
      "delay": 5800,
      "lookedAt": "This claim's shape, described in words (services, billing pattern, practitioner and practice relationships), against the closed investigation write-ups in the confirmed case library",
      "rule": "Retrieval over the case library, grounded in confirmed outcomes, with the matching cases cited. A similarity result alone never routes a claim; it adds weight to other signals",
      "found": "412 closed cases searched · nothing comparable returned",
      "verdict": "pass",
      "conclusion": "No similar confirmed case",
      "detail": {
        "What it is": "Pega GenAI Knowledge Buddy: retrieval over the fund's own closed investigations, ingested automatically when an investigator publishes the case write-up. The library can be seeded from existing closed investigations on day one and grows as the system runs"
      },
      "metric": "412 cases searched · 0 comparable"
    }
  ],
  "phase3Result": {
    "verdict": "CLEAR",
    "action": "No entity known, no connection to known fraud, and no comparable confirmed case. Claim approved and sent for adjudication."
  }
};
