// Plain-English explanations for the pre-flight checks, shown one at a time in
// the "What's happening" card beside the check list while pre-flight runs, and
// again when a check is clicked afterwards.
// Loaded by index.html with a plain <script> tag. Keep the object literal valid JSON.
//
// Each entry, keyed by check id:
//   icon  one emoji for the card header
//   what  what the check is doing, for an audience that has never seen Pega
//   why   why it matters, in one sentence
// The check's name and cost badge come from the check row itself, and the
// technical detail (component, rule, threshold) stays in the row and the caption.
window.CHECK_EXPLAINERS = {
  "SIG-DOC-TYPE": {
    "icon": "🧾",
    "what": "The AI looks at the receipt the member uploaded and decides what kind of document it is: a tax invoice from a health provider, or a quote, a statement or something non-medical.",
    "why": "Only a genuine tax invoice can be claimed, so anything else stops here, before any deeper checks run."
  },
  "SIG-FIELD-EXTRACTION": {
    "icon": "🔍",
    "what": "Confirms the AI read of the receipt returned all eleven details a claim needs: provider, ABN, service date, item numbers, amounts and more. They filled in the claim above; the member typed nothing.",
    "why": "Every later check works from these fields, so the receipt is read once and the results are reused."
  },
  "SIG-EXTRACTION-CONFIDENCE": {
    "icon": "📏",
    "what": "Each field comes back with a confidence score. Any critical field below 0.70 is treated as unreadable rather than guessed.",
    "why": "A blurred or altered receipt goes to a person instead of being paid on a guess."
  },
  "SIG-INVALID-KEYWORDS": {
    "icon": "🚫",
    "what": "A business rule scans the receipt text for eleven disqualifying terms kept by the fraud team, such as quotation, proforma, non-medical and a PAID stamp.",
    "why": "These documents can't be claimed at all. Catching them here is instant and never uses an investigator's time."
  },
  "SIG-DOC-COMPLETENESS": {
    "icon": "📋",
    "what": "Business rules confirm the receipt has what a valid claim needs: the amount received against the amount charged, a valid ABN, itemised services and a signature.",
    "why": "An incomplete receipt goes back to the member instead of on to the fraud checks."
  },
  "SIG-LINE-RECONCILIATION": {
    "icon": "🧮",
    "what": "Adds up the line items the AI read from the receipt and checks they come to the total printed on it.",
    "why": "Whoever edits a receipt usually changes the total and leaves the breakdown alone. Catching it is simple arithmetic, a business rule included in Pega Platform."
  },
  "SIG-CLAIM-VALUE": {
    "icon": "💲",
    "what": "Records whether the claim is $5,000 or more. It's context for later checks, not a fraud signal.",
    "why": "It never routes a claim on its own; later checks can weigh it alongside real signals."
  },
  "SIG-DEVICE-LOCATION": {
    "icon": "📱",
    "what": "Attaches the device, location and time captured when the member signed in. Nothing is judged here.",
    "why": "Phase 2 uses them to spot one device behind many members, or a claim lodged far from home."
  }
}
