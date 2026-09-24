// Scenario data for CLM-2024-0844 (Linda Pham, dental claim, Phase 2 cluster).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0844'] = {
  "session": {
    "deviceId": "DEV-1196",
    "deviceProfile": "Web · Chrome (Windows)",
    "ipAddress": "203.0.113.19",
    "location": "Footscray VIC",
    "sessionTime": "2026-07-16T20:47:00+10:00",
    "deviceStatus": "new",
    "frame": "browser",
    "showLogin": true
  },
  "captions": {
    "signin": {
      "tag": "Session capture",
      "text": "Linda's claim is lodged through the H+ website on a Windows laptop"
    },
    "particles": {
      "tag": "Session capture",
      "text": "The same three signals are captured at sign-in"
    },
    "particle:device": {
      "tag": "Session capture · Device",
      "text": "The laptop's fingerprint. ES-002 checks whether other members lodge from it"
    },
    "particle:location": {
      "tag": "Session capture · Location",
      "text": "Footscray, from the IP. Linda's registered address is in Springvale"
    },
    "particle:session": {
      "tag": "Session capture · Session",
      "text": "8:47 in the evening. The claim stays tied to this session"
    },
    "handoff": {
      "tag": "Session capture",
      "text": "A device Linda has never used before. The session travels with the claim"
    },
    "upload": {
      "tag": "Lodgement",
      "text": "Linda's dental receipt is uploaded"
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
      "tag": "Phase 1 · Receipt forensics",
      "text": "Forensic checks look for tampering, forgery and AI-made receipts"
    },
    "phase1:SIG-P1-MATCH": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "The keyed claim is checked against the receipt itself"
    },
    "phase1:SIG-P1-FONT": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "One typeface throughout, so no text has been spliced in"
    },
    "phase1:SIG-P1-COLOUR": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "No digital overlays or pasted stamps on the scan"
    },
    "phase1:SIG-P1-AIGEN": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "The image is scored against AI image-generator signatures"
    },
    "phase1:SIG-P1-META": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "Made by clinic software on the day of the service"
    },
    "phase1:SIG-P1-DUP": {
      "tag": "Phase 1 · Receipt forensics",
      "text": "This receipt has never been claimed before"
    },
    "phase2": {
      "tag": "Phase 2 · Cross-claim signals",
      "text": "The receipt is genuine. Now the claim is compared with other claims"
    },
    "phase2:ES-001": {
      "tag": "Phase 2 · Cross-claim signals",
      "text": "Footscray to Springvale is about 28 km, well inside the threshold"
    },
    "phase2:ES-002": {
      "tag": "Phase 2 · Cross-claim signals",
      "text": "Five unrelated members have lodged from this laptop in 26 hours"
    },
    "phase2:ES-003": {
      "tag": "Phase 2 · Cross-claim signals",
      "text": "The practice's bank account is its own, so no signal here"
    },
    "outcome": {
      "tag": "Outcome",
      "text": "This claim is referred, and the device gets its own network assessment"
    }
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
      "summary": "11 of 11 fields · $264.00 · items 011, 121",
      "cost": "ai",
      "lookedAt": "Full document",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "Metro Dental Group · items 011, 121 · $264.00 · 13 Jul 2026",
      "verdict": "pass",
      "conclusion": "11 of 11 required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.93 (InvoiceTotal) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest was InvoiceTotal at 0.93 · ProviderABN 0.94 · ServiceDate 0.95",
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
      "summary": "$264.00 paid of $264.00 · ABN ✓ · 2 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Paid in full, valid tax invoice, itemised, signed",
      "found": "$264.00 received against $264.00 charged · ABN present · 2 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete and paid"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$264.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$264.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-1196 · Footscray VIC · captured at sign-in",
      "cost": "capture",
      "captured": "session",
      "usedBy": "ES-001 distance anomaly, ES-002 device ring",
      "conclusion": "Recorded, no evaluation at this stage"
    }
  ],
  "phase1": [
    {
      "id": "SIG-P1-MATCH",
      "name": "Claim-to-receipt match",
      "summary": "4 of 4 fields match · $264.00 = $264.00",
      "cost": "rule",
      "delay": 2200,
      "lookedAt": "Member-keyed claim fields against the extracted receipt",
      "rule": "Amount, provider, service date and item codes must all match",
      "found": "$264.00 = $264.00 · Metro Dental Group = Metro Dental Group · 13 Jul 2026 = 13 Jul 2026 · 011, 121 all present",
      "verdict": "pass",
      "conclusion": "Keyed claim matches the receipt"
    },
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "1 typeface · Times New Roman 10pt throughout",
      "cost": "ai",
      "delay": 5000,
      "lookedAt": "Every text run in the receipt — typeface, size, weight",
      "rule": "A genuine receipt prints in one typeface; spliced text is the commonest alteration",
      "found": "Times New Roman 10pt throughout · 1 typeface · no size or weight breaks",
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
      "summary": "score 0.03 · threshold 0.15",
      "cost": "ai",
      "delay": 10600,
      "lookedAt": "Pixel-level artefacts characteristic of image generators",
      "rule": "Generative signature score at or below 0.15",
      "found": "0.03",
      "verdict": "pass",
      "conclusion": "Not a generated image"
    },
    {
      "id": "SIG-P1-META",
      "name": "Metadata and provenance",
      "summary": "clinic practice software · created 13 Jul 2026 · matches service date",
      "cost": "rule",
      "delay": 13200,
      "lookedAt": "File authoring trail, creation and modification timestamps",
      "rule": "Authoring software should be practice software, and timestamps must not post-date the service",
      "found": "Authored by clinic practice software · created 13 Jul 2026 · not modified since · matches the service date",
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
    "action": "No adverse findings on the receipt. That does not make it a clean claim — continuing to Phase 2 cross-claim signals."
  },
  "phase2": [
    {
      "id": "ES-001",
      "name": "ES-001 Distance anomaly",
      "summary": "about 28 km from registered address · threshold 500 km",
      "cost": "rule",
      "delay": 4000,
      "lookedAt": "Submission IP geolocation against the member's registered address",
      "rule": "Graded — over 500 km moderate, over 1,500 km high, overseas critical",
      "found": "Submitted from Footscray VIC, registered address Springvale VIC 3171 — about 28 km",
      "verdict": "pass",
      "conclusion": "Within normal range. No distance signal"
    },
    {
      "id": "ES-002",
      "name": "ES-002 Device ring",
      "summary": "5 members on one device in 26 hours · threshold 3",
      "cost": "rule",
      "delay": 10000,
      "lookedAt": "Distinct members submitting from device DEV-1196 in the last 72 hours",
      "rule": "Three or more unrelated members on one device. Members sharing a membership and address are a household, not a ring",
      "found": "5 distinct members on DEV-1196 in 26 hours — 5 different surnames, 5 different addresses, 5 different policies",
      "verdict": "fail",
      "conclusion": "Five unrelated members on one device"
    },
    {
      "id": "ES-003",
      "name": "ES-003 Bank account ring",
      "summary": "1 practice on this account · threshold 3",
      "cost": "rule",
      "delay": 16000,
      "lookedAt": "Distinct practice ABNs paying into this account in the last 30 days",
      "rule": "Three or more unrelated practices converging on one account",
      "found": "1 practice — Metro Dental Group, ABN 77 345 678 012, its own registered account",
      "verdict": "pass",
      "conclusion": "No account convergence"
    }
  ],
  "phase2Result": {
    "action": "This claim is marked suspicious and referred. Separately, a network assessment is raised against device DEV-1196, covering the four earlier claims that were cleared before the pattern existed."
  }
};
