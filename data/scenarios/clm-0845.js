// Scenario data for CLM-2024-0845 (Michael Torres, optical claim, Phase 3 RAG match).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0845'] = {
  "session": {
    "deviceId": "DEV-6305",
    "deviceProfile": "H+ App v4.2 (iOS)",
    "ipAddress": "203.0.113.58",
    "location": "Box Hill VIC",
    "sessionTime": "2026-07-17T09:33:00+10:00",
    "deviceStatus": "recognised",
    "showLogin": false
  },
  "signals": [
    {
      "id": "SIG-DOC-TYPE",
      "name": "Receipt type",
      "summary": "TAX INVOICE · ABN and AHPRA present",
      "cost": "ai",
      "lookedAt": "Header, footer and declaration text",
      "rule": "Must be a tax invoice from a registered health provider",
      "found": "\"TAX INVOICE\" · ABN present · AHPRA registration present · optical item schedule",
      "verdict": "pass",
      "conclusion": "Optical healthcare receipt"
    },
    {
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $390.00 · items 10801, 10712",
      "cost": "ai",
      "lookedAt": "Full document",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "ClearView Optometry · items 10801, 10712 · $390.00 · 10 Jul 2026",
      "verdict": "pass",
      "conclusion": "11 of 11 required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.91 (ServiceDate) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest was ServiceDate at 0.91 · ProviderABN 0.97 · InvoiceTotal 0.95",
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
      "summary": "$390.00 paid of $390.00 · ABN ✓ · 2 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Paid in full, valid tax invoice, itemised, signed",
      "found": "$390.00 received against $390.00 charged · ABN present · 2 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete and paid"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$390.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$390.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-6305 · Box Hill VIC · captured at sign-in",
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
      "summary": "4 of 4 fields match · $390.00 = $390.00",
      "cost": "rule",
      "delay": 2200,
      "lookedAt": "Member-keyed claim fields against the extracted receipt",
      "rule": "Amount, provider, service date and item codes must all match",
      "found": "$390.00 = $390.00 · ClearView Optometry = ClearView Optometry · 10 Jul 2026 = 10 Jul 2026 · 10801, 10712 all present",
      "verdict": "pass",
      "conclusion": "Keyed claim matches the receipt"
    },
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "1 typeface · Helvetica 9pt throughout",
      "cost": "ai",
      "delay": 5000,
      "lookedAt": "Every text run in the receipt — typeface, size, weight",
      "rule": "A genuine receipt prints in one typeface; spliced text is the commonest alteration",
      "found": "Helvetica 9pt throughout · 1 typeface · no size or weight breaks",
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
      "summary": "score 0.05 · threshold 0.15",
      "cost": "ai",
      "delay": 10600,
      "lookedAt": "Pixel-level artefacts characteristic of image generators",
      "rule": "Generative signature score at or below 0.15",
      "found": "0.05",
      "verdict": "pass",
      "conclusion": "Not a generated image"
    },
    {
      "id": "SIG-P1-META",
      "name": "Metadata and provenance",
      "summary": "practice software · created 10 Jul 2026 · matches service date",
      "cost": "rule",
      "delay": 13200,
      "lookedAt": "File authoring trail, creation and modification timestamps",
      "rule": "Authoring software should be practice software, and timestamps must not post-date the service",
      "found": "Authored by practice software · created 10 Jul 2026 · not modified since · matches the service date",
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
      "summary": "about 15 km from registered address · threshold 500 km",
      "cost": "rule",
      "delay": 4000,
      "lookedAt": "Submission IP geolocation against the member's registered address",
      "rule": "Graded — over 500 km moderate, over 1,500 km high, overseas critical",
      "found": "Submitted from Box Hill VIC, registered address Brunswick VIC 3056 — about 15 km",
      "verdict": "pass",
      "conclusion": "Within normal range. No distance signal"
    },
    {
      "id": "ES-002",
      "name": "ES-002 Device ring",
      "summary": "1 member on this device · threshold 3",
      "cost": "rule",
      "delay": 10000,
      "lookedAt": "Distinct members submitting from device DEV-6305 in the last 72 hours",
      "rule": "Three or more unrelated members on one device. Members sharing a membership and address are a household, not a ring",
      "found": "1 member on this device — Michael Torres only",
      "verdict": "pass",
      "conclusion": "No device ring"
    },
    {
      "id": "ES-003",
      "name": "ES-003 Bank account ring",
      "summary": "1 practice on this account · threshold 3",
      "cost": "rule",
      "delay": 16000,
      "lookedAt": "Distinct practice ABNs paying into this account in the last 30 days",
      "rule": "Three or more unrelated practices converging on one account",
      "found": "1 practice — ClearView Optometry, ABN 33 456 789 123, its own registered account",
      "verdict": "pass",
      "conclusion": "No account convergence"
    }
  ],
  "phase2Result": {
    "action": "No signal raised. Continuing to Phase 3."
  },
  "phase3": [
    {
      "id": "P3-RAG",
      "name": "Knowledge Buddy RAG",
      "summary": "highest match 0.91 · threshold 0.85",
      "cost": "ai",
      "delay": 3600,
      "lookedAt": "This claim's pattern against the confirmed fraud case library",
      "rule": "Similarity at or above 0.85 to a confirmed case",
      "found": "Highest match 0.91 — 4 confirmed phantom-billing cases: same item codes, similar provider profile",
      "verdict": "fail",
      "conclusion": "Closely matches confirmed phantom billing"
    },
    {
      "id": "P3-GRAPH",
      "name": "Network graph",
      "tag": "MCP · Graph",
      "summary": "0 connections within 3 hops",
      "cost": "ai",
      "delay": 7200,
      "lookedAt": "Graph traversal up to 3 hops from the member, using the device and payment links captured at submission",
      "rule": "Any path reaching a confirmed fraud community",
      "found": "0 connections within 3 hops",
      "verdict": "pass",
      "conclusion": "Graph clear"
    }
  ],
  "phase3Result": {
    "action": "Similarity 0.91 to 4 confirmed phantom-billing cases. Claim referred to the investigation queue with the matched cases attached."
  }
};
