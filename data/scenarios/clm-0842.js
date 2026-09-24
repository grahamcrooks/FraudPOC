// Scenario data for CLM-2024-0842 (Sarah Nguyen, optical claim, Phase 1 receipt failure).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0842'] = {
  "session": {
    "deviceId": "DEV-4417",
    "deviceProfile": "H+ App v4.2 (Android)",
    "ipAddress": "203.0.113.42",
    "location": "Brunswick VIC",
    "sessionTime": "2026-07-14T18:22:00+10:00",
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
      "summary": "11 of 11 fields · $445.00 · items 10801, 10701, 10501",
      "cost": "ai",
      "lookedAt": "Full receipt",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "Vision Direct Pty Ltd · items 10801, 10701, 10501 · $445.00 · 14 Jul 2026",
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
      "summary": "$445.00 paid of $445.00 · ABN ✓ · 3 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Paid in full, valid tax invoice, itemised, signed",
      "found": "$445.00 received against $445.00 charged · ABN present · 3 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete and paid"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$445.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$445.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-4417 · Brunswick VIC · captured at sign-in",
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
      "summary": "keyed $487.50 vs receipt $445.00 · $42.50 over",
      "cost": "rule",
      "delay": 2200,
      "lookedAt": "Member-keyed claim fields against the extracted receipt",
      "rule": "Amount, provider, service date and item codes must all match",
      "found": "Member keyed $487.50, receipt shows $445.00 — $42.50 (10.8%) discrepancy · provider, date and codes match",
      "verdict": "flag",
      "conclusion": "Keyed amount exceeds the receipt"
    },
    {
      "id": "SIG-P1-FONT",
      "name": "Font consistency",
      "summary": "3 typefaces · breaks in the amount and date",
      "cost": "ai",
      "delay": 5000,
      "lookedAt": "Every text run in the receipt — typeface, size, weight",
      "rule": "A genuine receipt prints in one typeface; spliced text is the commonest alteration",
      "found": "3 typefaces — Arial 9pt, Helvetica 10pt, Times New Roman 8pt · breaks fall in the amount and date fields",
      "verdict": "fail",
      "conclusion": "Text has been spliced"
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
      "summary": "Photoshop · modified 2 days after service",
      "cost": "rule",
      "delay": 13200,
      "lookedAt": "File authoring trail, creation and modification timestamps",
      "rule": "Authoring software should be practice software, and timestamps must not post-date the service",
      "found": "Authored in Adobe Photoshop · modified 16 Jul 2026, two days after the service · no practice software trail",
      "verdict": "fail",
      "conclusion": "Provenance inconsistent with the service"
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
    "action": "Below threshold. Claim referred to the investigator queue, HIGH priority, 4-hour SLA. Phases 2 and 3 do not run."
  },
  "phase2": [
    {
      "id": "ES-001",
      "name": "ES-001 Distance anomaly",
      "summary": "not run",
      "cost": "rule",
      "delay": 4000,
      "lookedAt": "Submission IP geolocation against the member's registered address",
      "rule": "Graded — over 500 km moderate, over 1,500 km high, overseas critical",
      "found": "Not run — Phase 1 stopped the claim",
      "verdict": "skipped",
      "conclusion": "Not run — Phase 1 stopped the claim"
    },
    {
      "id": "ES-002",
      "name": "ES-002 Device ring",
      "summary": "not run",
      "cost": "rule",
      "delay": 10000,
      "lookedAt": "Distinct members submitting from device DEV-4417 in the last 72 hours",
      "rule": "Three or more unrelated members on one device. Members sharing a membership and address are a household, not a ring",
      "found": "Not run — Phase 1 stopped the claim",
      "verdict": "skipped",
      "conclusion": "Not run — Phase 1 stopped the claim"
    },
    {
      "id": "ES-003",
      "name": "ES-003 Bank account ring",
      "summary": "not run",
      "cost": "rule",
      "delay": 16000,
      "lookedAt": "Distinct practice ABNs paying into this account in the last 30 days",
      "rule": "Three or more unrelated practices converging on one account",
      "found": "Not run — Phase 1 stopped the claim",
      "verdict": "skipped",
      "conclusion": "Not run — Phase 1 stopped the claim"
    }
  ],
  "phase2Result": {
    "action": "Not run — Phase 1 stopped the claim."
  }
};
