# 05 AI Step Details

Completes the three AI steps in the Claim case type, which Blueprint marks as incomplete (yellow) until they have instructions, inputs and outputs: Extract Receipt, Generate Forensic Narrative and Search Fraud Case Library. Paste each section into the matching fields of the step's configuration. Run it after [04](04-data-model.md).

No placeholders.

## Extract Receipt

Pre-flight stage, Document Analysis process. The full field list, and where each field lands, is in [`docs/blueprint/receipt-extraction-fields.md`](../../docs/blueprint/receipt-extraction-fields.md).

```text
Read the uploaded receipt or tax invoice (PDF or image) and extract its details. For every field, return the value and a confidence score from 0 to 1. Do not guess: if a field is missing or unreadable, leave it empty with confidence 0.

Header fields, once per document: document title as printed; document type (receipt, tax invoice, quotation, estimate or statement); document number; issue date; service time; due date; practice name, address, phone, email, ABN and provider number; practitioner name, qualifications and AHPRA number; referring provider; patient name, date of birth, address, postcode and phone; health fund name, membership number and fund number; total charged; adjustments; amount paid; amount due; payment method; card last four digits only; whether GST applies; whether a practitioner declaration and signature are present, and the signature date; any stamps or handwritten marks, such as PAID; and the full raw text.

Service lines: return one line for every service row, however many there are. For each: line number, service date, reference number, item code, description, body area or tooth, quantity, fee and whether GST applies. If a line has no service date of its own, use the document's date of service. If no quantity is printed, use 1. Mark any value you derived rather than read as derived.
```

- **Input:** Receipt (the uploaded file).
- **Outputs:** the header fields into Receipt, and one Claim Line per service row into Claim lines, each field with its confidence score.

### Blueprint prompts for the Extract Receipt outputs

Blueprint marks the step incomplete until "Save output to" has fields. Paste these into the Blueprint AI assistant one at a time: part A makes sure the fields exist, part B sets them as the step's outputs.

Part A: the fields.

```text
Add these fields to the Receipt and Claim Line data objects if they do not already exist. Do not change any case type, stage or step, and do not remove existing fields.

RECEIPT
Document Title (Text), Document Type (Receipt, Tax invoice, Quotation, Estimate, Statement), Document Number (Text), Issue Date (Date), Service Time (Text), Due Date (Date), Account Reference (Text), Printed Practice Name (Text), Printed Practice Address (Text), Printed Practice Phone (Text), Printed Practice Email (Text), Printed Practice ABN (Text), Printed Provider Number (Text), Printed Practitioner Name (Text), Printed Practitioner Qualifications (Text), Printed AHPRA Number (Text), Referring Provider (Text), Printed Patient Name (Text), Printed Patient Date of Birth (Date), Printed Patient Address (Text), Printed Patient Postcode (Text), Printed Patient Phone (Text), Health Fund Name (Text), Membership Number (Text), Fund Number (Text), Total Charged (Decimal), Adjustments (Decimal), Amount Paid (Decimal), Amount Due (Decimal), Payment Method (Text), Card Last Four (Text), GST Applies (Boolean), Declaration Present (Boolean), Signature Present (Boolean), Signature Date (Date), Stamps and Marks (list of Text), Raw Text (Text), Extracted Fields (list of Extracted Field).

EXTRACTED FIELD (new data object, embedded in Receipt; one row per extracted value)
Field Name (Text), Value (Text), Confidence (Decimal), Derived (Boolean), Critical (Boolean).

CLAIM LINE
Line Number (Integer), Service Date (Date), Reference Number (Text), Item Code (Text), Description (Text), Body Area or Tooth (Text), Quantity (Integer), Fee (Decimal), GST Applies (Boolean), Derived (Boolean).
```

Part B: the step's outputs.

```text
Update the Extract Receipt step (AI Agent) in the Pre-flight stage of the Claim case type. Do not change any other step or stage.

Save output to the Claim fields Receipt and Claim lines. If an embedded or list field cannot be selected as an output, add each Receipt field as an output instead: Document Title, Document Type, Document Number, Issue Date, Service Time, Due Date, Account Reference, Printed Practice Name, Printed Practice Address, Printed Practice Phone, Printed Practice Email, Printed Practice ABN, Printed Provider Number, Printed Practitioner Name, Printed Practitioner Qualifications, Printed AHPRA Number, Referring Provider, Printed Patient Name, Printed Patient Date of Birth, Printed Patient Address, Printed Patient Postcode, Printed Patient Phone, Health Fund Name, Membership Number, Fund Number, Total Charged, Adjustments, Amount Paid, Amount Due, Payment Method, Card Last Four, GST Applies, Declaration Present, Signature Present, Signature Date, Stamps and Marks, Raw Text, Extracted Fields; plus Claim lines.

Set the description to: Reads the uploaded receipt or tax invoice and extracts the header details and every service line, as printed, each with a confidence score. Writes only to Receipt and Claim lines; never to Member, Practice or Practitioner.
```

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
