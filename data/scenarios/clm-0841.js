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
      "name": "Document type",
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
      "cost": "ai",
      "lookedAt": "Per-field extraction confidence",
      "rule": "Every critical field at or above 0.70, or the claim goes to human review",
      "found": "Lowest was ServiceDate at 0.92 · ProviderABN 0.97 · InvoiceTotal 0.95",
      "verdict": "pass",
      "conclusion": "All fields above threshold"
    },
    {
      "id": "SIG-INVALID-KEYWORDS",
      "name": "Invalid document keywords",
      "cost": "rule",
      "lookedAt": "Extracted receipt text",
      "rule": "Disqualifying terms — quotation, proforma, void, non-medical, balance outstanding",
      "found": "None",
      "verdict": "pass",
      "conclusion": "No disqualifying content"
    },
    {
      "id": "SIG-DOC-COMPLETENESS",
      "name": "Document completeness",
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
      "text": "Device, location and time are captured at sign-in, before any claim exists"
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
  }
};
