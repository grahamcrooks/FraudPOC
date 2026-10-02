# 05 AI Step Details

Completes the three AI steps in the Claim case type, which Blueprint marks as incomplete (yellow) until they have instructions, inputs and outputs: Extract Receipt, Generate Forensic Narrative and Search Fraud Case Library. Paste each section into the matching fields of the step's configuration. Run it after [04](04-data-model.md).

No placeholders.

## Extract Receipt

Pre-flight stage, Document Analysis process.

```text
Read the uploaded receipt (PDF or image) and extract the claim details. For each field, return the value and a confidence score from 0 to 1. Do not guess: if a field is missing or unreadable, leave it empty with confidence 0. Return the document type exactly as printed (receipt, tax invoice, quotation, estimate or statement) and any stamps or handwritten marks, such as PAID. Keep the full raw text of the document.
```

- **Input:** Receipt (the uploaded file).
- **Outputs:** practice name, practice ABN, practitioner name, practitioner AHPRA number, patient name, service date, line items (item code, description, quantity, item charge, date) into Claim lines, total charged, amount paid, payment method, document type as printed, stamps detected, a confidence score per field, and the raw text into Receipt.

## Generate Forensic Narrative

Receipt Forensics stage. Runs only when the receipt integrity score is below threshold.

```text
Write a plain-English summary of the document forensics findings for a fraud investigator. Use only the check results provided. Lead with the most serious finding. For each failed or flagged check, say what was examined, what was found and why it matters. Three to six sentences. State facts; do not speculate about intent. Use Australian English.
```

- **Inputs:** Forensics result (each check with its verdict and details), Receipt integrity score, Claim lines, Total amount.
- **Output:** Forensic narrative (Text) on Document Forensics Result. Add the field to the data object if Blueprint hasn't.

## Search Fraud Case Library

Network Intelligence stage.

```text
Describe this claim's shape: claim type, services and item codes, billing pattern, the practice and practitioner and how they are connected, and any network findings. Search the Fraud Case Library for comparable confirmed fraud cases. Return up to three matches, each with its case reference, fraud type and one sentence on why it is comparable. Cite only cases in the library. If nothing comparable is found, say so. Never return a score and never recommend a route: a similarity result never routes a claim on its own.
```

- **Inputs:** Claim type, Claim lines, Practice, Practitioner, Network dossier (graph paths from Traverse Network Graph), watchlist results from Check Watchlist.
- **Knowledge source:** Fraud Case Library.
- **Outputs:** into Network dossier: similar cases (a list of case reference, fraud type and reason) and a similarity summary (Text).
