// Scenario data for CLM-2024-0847 (Priya Raman, dental quotation, rejected at pre-flight).
// Loaded by index.html with a plain <script> tag, so the demo still runs from
// file:// with no server. Keep the object literal valid JSON.
// No phase1, phase2 or phase3 arrays: the claim never reaches the pipeline.
(window.SCENARIO_DATA = window.SCENARIO_DATA || {})['CLM-2024-0847'] = {
  "session": {
    "deviceId": "DEV-5540",
    "deviceProfile": "H+ App v4.2 (iOS)",
    "ipAddress": "203.0.113.33",
    "location": "Northcote VIC",
    "sessionTime": "2026-07-17T19:32:00+10:00",
    "deviceStatus": "recognised",
    "showLogin": false
  },
  "captions": {
    "upload": {
      "tag": "Lodgement",
      "text": "Priya uploads what looks like a dental invoice"
    },
    "cost:ai": {
      "tag": "Pre-flight · AI",
      "text": "AI reads the document: it has the layout and fields of a receipt"
    },
    "cost:rule": {
      "tag": "Pre-flight · Rules",
      "text": "Business rules read what the document actually says, at no AI cost"
    },
    "cost:capture": {
      "tag": "Pre-flight",
      "text": "The sign-in device and location are still recorded against the claim"
    },
    "preflightRejected": {
      "tag": "Pre-flight rejected",
      "text": "A quotation, and nothing paid. Rejected before any forensic AI runs"
    }
  },
  "signals": [
    {
      "id": "SIG-DOC-TYPE",
      "name": "Receipt type",
      "summary": "dental receipt layout · ABN and AHPRA present",
      "cost": "ai",
      "lookedAt": "Header, footer and declaration text",
      "rule": "Must be a tax invoice from a registered health provider",
      "found": "TAX INVOICE layout · ABN 36 757 192 913 · AHPRA present · ADA item code schedule",
      "verdict": "pass",
      "conclusion": "Dental receipt layout"
    },
    {
      "id": "SIG-FIELD-EXTRACTION",
      "name": "Field extraction",
      "summary": "11 of 11 fields · $448.00 · items 012, 114, 532",
      "cost": "ai",
      "lookedAt": "Full document",
      "rule": "Extract provider, ABN, service date, line items and total",
      "found": "11 of 11 fields · Merri Creek Dental Studio · $448.00 · items 012, 114, 532 · 16 Jul 2026",
      "verdict": "pass",
      "conclusion": "All required fields present"
    },
    {
      "id": "SIG-EXTRACTION-CONFIDENCE",
      "name": "Extraction confidence",
      "summary": "lowest 0.94 (InvoiceTotal) · threshold 0.70",
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest InvoiceTotal 0.94 · ProviderABN 0.96 · ServiceDate 0.95",
      "verdict": "pass",
      "conclusion": "All fields above threshold"
    },
    {
      "id": "SIG-INVALID-KEYWORDS",
      "name": "Disqualifying content",
      "summary": "2 of 10 terms matched",
      "cost": "rule",
      "lookedAt": "Extracted receipt text",
      "rule": "10 disqualifying terms, maintained by the fraud team",
      "found": "\"treatment plan and quotation\" in the header, \"this is not a tax invoice\" in the footer",
      "verdict": "fail",
      "conclusion": "Classified as a quotation"
    },
    {
      "id": "SIG-DOC-COMPLETENESS",
      "name": "Receipt completeness",
      "summary": "$0.00 paid of $448.00",
      "cost": "rule",
      "lookedAt": "Payment fields, ABN, provider number, line items, practitioner declaration",
      "rule": "Paid in full, valid tax invoice, itemised, signed",
      "found": "$0.00 received against $448.00 charged · ABN present · 3 itemised lines · not signed",
      "verdict": "fail",
      "conclusion": "Nothing has been paid"
    },
    {
      "id": "SIG-CLAIM-VALUE",
      "name": "Claim value",
      "summary": "$448.00 claimable · threshold $5,000",
      "cost": "rule",
      "lookedAt": "Claimable line items",
      "rule": "Flag at $5,000 or above",
      "found": "$448.00 claimable",
      "verdict": "pass",
      "conclusion": "Below threshold, not flagged"
    },
    {
      "id": "SIG-DEVICE-LOCATION",
      "name": "Device and location",
      "summary": "DEV-5540 · Northcote VIC · captured at sign-in",
      "cost": "capture",
      "captured": "session",
      "usedBy": "ES-001 distance anomaly, ES-002 device ring",
      "conclusion": "Recorded, no evaluation at this stage"
    }
  ],
  "outcome": {
    "headline": "Claim rejected — not a claimable receipt",
    "reason": "Quotation, not a tax invoice · nothing paid",
    "note": "No forensic AI calls were spent on this claim. Phases 1, 2 and 3 did not run. Nothing was referred to the fraud team."
  }
}
