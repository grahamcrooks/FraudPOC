// Scenario data for CLM-2024-0846 (Angela Wu, physio claim, Phase 3 network).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0846'] = {
  "session": {
    "deviceId": "DEV-2740",
    "deviceProfile": "H+ App v4.2 (Android)",
    "ipAddress": "203.0.113.91",
    "location": "Preston VIC",
    "sessionTime": "2026-07-18T21:15:00+10:00",
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
      "found": "\"TAX INVOICE\" · ABN present · AHPRA registration present · allied health item schedule",
      "verdict": "pass",
      "conclusion": "Physiotherapy healthcare receipt"
    },
    {
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $230.00 · items SP001, SP015",
      "cost": "ai",
      "lookedAt": "Full receipt",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "Prime Physio & Sports · items SP001, SP015 · $230.00 · 15 Jul 2026",
      "verdict": "pass",
      "conclusion": "11 of 11 required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.93 (ServiceDate) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest was ServiceDate at 0.93 · ProviderABN 0.96 · InvoiceTotal 0.94",
      "verdict": "pass",
      "conclusion": "All fields above threshold"
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
      "summary": "$230.00 received of $230.00 · ABN ✓ · 2 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Amount received recorded against amount charged, valid tax invoice, itemised, signed",
      "found": "$230.00 received against $230.00 charged · ABN present · 2 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete — member paid in full"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$230.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$230.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-2740 · Preston VIC · captured at sign-in",
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
      "summary": "4 of 4 fields match · $230.00 = $230.00",
      "cost": "rule",
      "delay": 2200,
      "lookedAt": "Member-keyed claim fields against the extracted receipt",
      "rule": "Amount, provider, service date and item codes must all match",
      "found": "$230.00 = $230.00 · Prime Physio & Sports = Prime Physio & Sports · 15 Jul 2026 = 15 Jul 2026 · SP001, SP015 all present",
      "verdict": "pass",
      "conclusion": "Keyed claim matches the receipt"
    },
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "1 typeface · Arial 10pt throughout",
      "cost": "ai",
      "delay": 5000,
      "lookedAt": "Every text run in the receipt — typeface, size, weight",
      "rule": "A genuine receipt prints in one typeface; spliced text is the commonest alteration",
      "found": "Arial 10pt throughout · 1 typeface · no size or weight breaks",
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
      "summary": "clinic practice software · created 15 Jul 2026 · matches service date",
      "cost": "rule",
      "delay": 13200,
      "lookedAt": "File authoring trail, creation and modification timestamps",
      "rule": "Authoring software should be practice software, and timestamps must not post-date the service",
      "found": "Authored by clinic practice software · created 15 Jul 2026 · not modified since · matches the service date",
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
      "summary": "about 16 km from registered address · threshold 500 km",
      "cost": "rule",
      "delay": 4000,
      "lookedAt": "Submission IP geolocation against the member's registered address",
      "rule": "Graded — over 500 km moderate, over 1,500 km high, overseas critical",
      "found": "Submitted from Preston VIC, registered address Sunshine VIC 3020 — about 16 km",
      "verdict": "pass",
      "conclusion": "Within normal range. No distance signal"
    },
    {
      "id": "ES-002",
      "name": "ES-002 Device ring",
      "summary": "1 member on this device · threshold 3",
      "cost": "rule",
      "delay": 10000,
      "lookedAt": "Distinct members submitting from device DEV-2740 in the last 72 hours",
      "rule": "Three or more unrelated members on one device. Members sharing a membership and address are a household, not a ring",
      "found": "1 member on this device — Angela Wu only",
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
      "found": "1 practice — Prime Physio & Sports, ABN 55 678 901 234, its own registered account",
      "verdict": "pass",
      "conclusion": "No account convergence"
    }
  ],
  "phase2Result": {
    "action": "No signal raised. Continuing to Phase 3."
  },
  "phase3": [
    {
      "id": "P3-GRAPH",
      "name": "Network graph",
      "tag": "MCP · Graph",
      "summary": "3-hop path into Community #47 · 14 members, 3 providers",
      "cost": "ai",
      "delay": 7800,
      "lookedAt": "Every entity the claim touches, up to 3 hops: member, practice, practitioner, device, submission IP, payment account",
      "rule": "Any path within 3 hops to a confirmed fraud community or an entity under investigation",
      "found": "3-hop path: this claim's submission IP 203.0.113.91 → Provider ABC → confirmed fraud member MBR-99112, in Community #47 of 14 members and 3 providers",
      "verdict": "fail",
      "conclusion": "Connected to a confirmed fraud community"
    }
  ],
  "phase3Result": {
    "action": "3-hop path into Community #47 — 14 members, 3 providers. Claim referred to the SIU queue, HIGH priority."
  }
};
