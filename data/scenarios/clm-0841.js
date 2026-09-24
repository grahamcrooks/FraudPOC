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
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $312.00 · items 011, 022, 114",
      "cost": "ai",
      "lookedAt": "Full document, 1,204 characters",
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
      "id": "SIG-INVALID-KEYWORDS",
      "name": "Disqualifying content",
      "summary": "10 terms checked · none found",
      "cost": "rule",
      "lookedAt": "Extracted receipt text",
      "rule": "10 disqualifying terms, for example non-medical, quotation, paid, proforma",
      "found": "None",
      "verdict": "pass",
      "conclusion": "No disqualifying content"
    },
    {
      "id": "SIG-DOC-COMPLETENESS",
      "name": "Receipt completeness",
      "summary": "$312.00 paid of $312.00 · ABN ✓ · 3 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Paid in full, valid tax invoice, itemised, signed",
      "found": "$312.00 received against $312.00 charged · ABN present · 3 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete and paid"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$312.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$312.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-2291 · Carlton VIC · captured at sign-in",
      "cost": "capture",
      "captured": "session",
      "usedBy": "ES-001 distance anomaly, ES-002 device ring",
      "conclusion": "Recorded, no evaluation at this stage"
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
      "tag": "Session capture · Location",
      "text": "Where James signed in, from his IP. ES-001 checks the distance from home"
    },
    "particle:session": {
      "tag": "Session capture · Session",
      "text": "When he signed in. The claim stays tied to this session"
    },
    "handoff": {
      "tag": "Session capture",
      "text": "That session travels with him into the claim portal"
    },
    "upload": {
      "tag": "Lodgement",
      "text": "James uploads his dental receipt"
    },
    "cost:ai": {
      "tag": "Pre-flight · AI",
      "text": "AI reads the receipt: document type, fields and confidence"
    },
    "cost:rule": {
      "tag": "Pre-flight · Rules",
      "text": "Business rules run next, at no AI cost"
    },
    "cost:capture": {
      "tag": "Pre-flight",
      "text": "The sign-in device and location are attached to the claim for later checks"
    },
    "preflightPassed": {
      "tag": "Pre-flight passed",
      "text": "Genuine, complete and claimable, so on to fraud detection"
    },
    "phase1": {
      "tag": "Phase 1 · Document forensics",
      "text": "Forensic checks look for tampering, forgery and AI-made receipts"
    },
    "phase1:SIG-P1-MATCH": {
      "tag": "Phase 1 · Document forensics",
      "text": "The keyed claim is checked against the receipt itself"
    },
    "phase1:SIG-P1-FONT": {
      "tag": "Phase 1 · Document forensics",
      "text": "One typeface throughout, so no text has been spliced in"
    },
    "phase1:SIG-P1-COLOUR": {
      "tag": "Phase 1 · Document forensics",
      "text": "No digital overlays or pasted stamps on the scan"
    },
    "phase1:SIG-P1-AIGEN": {
      "tag": "Phase 1 · Document forensics",
      "text": "The image is scored against AI image-generator signatures"
    },
    "phase1:SIG-P1-META": {
      "tag": "Phase 1 · Document forensics",
      "text": "Made by clinic software on the day of the service"
    },
    "phase1:SIG-P1-DUP": {
      "tag": "Phase 1 · Document forensics",
      "text": "This receipt has never been claimed before"
    },
    "phase2": {
      "tag": "Phase 2 · Provider and pattern",
      "text": "Event strategies compare this claim with patterns across all claims"
    },
    "phase3": {
      "tag": "Phase 3 · Organised ring",
      "text": "AI searches known fraud cases and the provider's network"
    },
    "outcome": {
      "tag": "Outcome",
      "text": "No suspicious activity: James's claim goes to normal adjudication"
    }
  },
  "phase1": [
    {
      "id": "SIG-P1-MATCH",
      "name": "Claim-to-receipt match",
      "summary": "4 of 4 fields match · $312.00 = $312.00",
      "cost": "rule",
      "delay": 2200,
      "lookedAt": "Member-keyed claim fields against the extracted receipt",
      "rule": "Amount, provider, service date and item codes must all match",
      "found": "$312.00 = $312.00 · Bright Smile Dental = Bright Smile Dental · 12 Jul 2026 = 12 Jul 2026 · 011, 022, 114 all present",
      "verdict": "pass",
      "conclusion": "Keyed claim matches the receipt"
    },
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "1 typeface · Arial 9pt throughout",
      "cost": "ai",
      "delay": 5000,
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
      "delay": 7800,
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
      "delay": 10600,
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
      "delay": 13200,
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
      "delay": 15600,
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
      "SIG-P1-MATCH": {
        "flag": 0.07
      },
      "SIG-P1-FONT": {
        "fail": 0.4
      },
      "SIG-P1-META": {
        "fail": 0.25
      }
    },
    "adjustments": [
      {
        "label": "Extraction confidence",
        "value": "0.92",
        "deduct": 0.09
      }
    ],
    "action": "Receipt clean. A clean receipt is not a clean claim — continuing to Phase 2 event strategies."
  }
};
