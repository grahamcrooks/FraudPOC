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
  ]
};
