// Scenario data for CLM-2024-0848 (Oliver Hartmann, genuine physio receipt stamped PAID, rejected at pre-flight).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
// No phase1, phase2 or phase3 arrays: the claim never reaches the pipeline.
// The receipt is genuine in every respect: no forensic finding belongs here.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0848'] = {
  "session": {
    "deviceId": "DEV-3312",
    "deviceProfile": "H+ App v4.2 (iOS)",
    "ipAddress": "203.0.113.47",
    "location": "Ferntree Gully VIC",
    "sessionTime": "2026-07-18T19:48:00+10:00",
    "deviceStatus": "recognised",
    "showLogin": false
  },
  "captions": {
    "preflight:SIG-INVALID-KEYWORDS": {
      "tag": "Pre-flight · Rules",
      "text": "PAID means the account is settled. There is nothing left for the member to claim"
    },
    "preflightRejected": {
      "tag": "Pre-flight rejected",
      "text": "A genuine receipt, correctly issued, that still isn't claimable. Caught by a business rule at no AI cost"
    }
  },
  "signals": [
    {
      "id": "SIG-DOC-TYPE",
      "name": "Receipt type",
      "summary": "physio receipt layout · ABN and AHPRA present",
      "cost": "ai",
      "lookedAt": "Header, footer and declaration text",
      "rule": "Must be a tax invoice from a registered health provider",
      "found": "TAX INVOICE layout · ABN 91 632 847 502 · AHPRA present",
      "verdict": "pass",
      "conclusion": "Physiotherapy receipt layout"
    },
    {
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $270.00 · 4 service lines",
      "cost": "ai",
      "lookedAt": "Full receipt",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "11 of 11 fields · Valley Physio & Rehab Centre · $270.00 · items 500, 515, 580, 590 · 15 Jul 2026",
      "verdict": "pass",
      "conclusion": "All required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.93 (ServiceDate) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest ServiceDate 0.93 · ProviderABN 0.96 · InvoiceTotal 0.95",
      "verdict": "pass",
      "conclusion": "All fields above threshold"
    },
    {
      "id": "SIG-INVALID-KEYWORDS",
      "name": "Disqualifying content",
      "summary": "1 of 11 terms matched · PAID stamp",
      "cost": "rule",
      "lookedAt": "Extracted receipt text and stamps",
      "rule": "11 disqualifying terms, for example non-medical, quotation, proforma, PAID stamp",
      "found": "PAID stamp across the services table",
      "verdict": "fail",
      "conclusion": "Account already settled, nothing to claim"
    },
    {
      "id": "SIG-DOC-COMPLETENESS",
      "name": "Receipt completeness",
      "summary": "$270.00 received of $270.00 · ABN ✓ · 4 lines · signed",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Amount received recorded against amount charged, valid tax invoice, itemised, signed",
      "found": "$270.00 received against $270.00 charged · ABN present · 4 itemised lines · signed",
      "verdict": "pass",
      "conclusion": "Complete — member paid in full"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$270.00 claimable · marker at $5,000",
      "cost": "rule",
      "routes": false,
      "lookedAt": "Claimable line items",
      "rule": "Recorded at $5,000 or above as context for later checks. Never routes the claim on its own",
      "found": "$270.00 claimable",
      "verdict": "pass",
      "conclusion": "Under $5,000, no high-value marker"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-3312 · Ferntree Gully VIC · captured at sign-in",
      "cost": "capture",
      "captured": "session",
      "usedBy": "ES-001 distance anomaly, ES-002 device ring",
      "conclusion": "Recorded, no evaluation at this stage"
    }
  ],
  "outcome": {
    "headline": "Claim rejected — nothing to claim",
    "reason": "Receipt is stamped PAID · the account is already settled",
    "note": "The receipt is genuine and complete. It simply isn't claimable. No forensic AI calls were spent, and nothing was referred to the fraud team."
  }
};
