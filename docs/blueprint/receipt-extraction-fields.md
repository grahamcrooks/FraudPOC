# Receipt Extraction Fields

The fields the Extract Receipt step reads from a receipt or tax invoice, and where each one lands in the data model. Header fields go on the Receipt data object; each service line is one Claim Line, and a document can carry any number of them. Every field also gets a confidence score from 0 to 1, which Check Extraction Confidence compares with 0.70 for the critical fields.

It is based on two layouts: a physiotherapy patient receipt and claim form (one service date, a fee per line, fully paid) and a pathology tax invoice (a service date per line, adjustments, an amount still due). Extraction has to handle both.

## Receipt (one per document)

### Document

| Field | Type | Notes |
| --- | --- | --- |
| Document title | Text | As printed, for example "Patient Receipt & Private Health Insurance Claim Form" or "Tax Invoice" |
| Document type | Receipt, Tax invoice, Quotation, Estimate, Statement | Classified from the title and content; Classify Document uses it |
| Document number | Text | Receipt or invoice number |
| Issue date | Date | Invoice date; on a receipt with none printed, the service date |
| Service time | Text | Optional |
| Due date | Date | Invoices only |
| Account reference | Text | Optional; the provider's own patient or account number |

### Provider

| Field | Type | Critical | Notes |
| --- | --- | --- | --- |
| Practice name | Text | Yes | |
| Practice address | Text | | |
| Practice phone | Text | | |
| Practice email | Text | | |
| Practice ABN | Text | Yes, or provider number | Compared with Practice reference data and checked by ES-004 |
| Provider number | Text | Yes, or ABN | |
| Practitioner name | Text | Yes | Labelled "Practitioner" on a receipt, "Pathology provider" on a pathology invoice |
| Practitioner qualifications | Text | | Optional, for example "B.Physio, APA" |
| Practitioner AHPRA number | Text | Where printed | May appear in the header and the practitioner section; both should match |
| Referring provider | Text | | Name and provider number, where printed (pathology, imaging) |

### Patient

| Field | Type | Critical |
| --- | --- | --- |
| Patient name | Text | Yes |
| Date of birth | Date | |
| Address | Text | |
| Postcode | Text | |
| Phone | Text | |

### Health fund

Printed on claim-form receipts; often absent on invoices.

| Field | Type |
| --- | --- |
| Health fund name | Text |
| Membership number | Text |
| Fund number | Text |

### Totals and payment

| Field | Type | Critical | Notes |
| --- | --- | --- | --- |
| Total charged | Decimal | Yes | "Total amount charged" or "Invoice amount" |
| Adjustments | Decimal | | Negative for a credit, for example -0.02 |
| Amount paid | Decimal | Yes | "Amount received"; 0 when nothing has been paid |
| Amount due | Decimal | | "Amount due"; 0 or absent on a paid receipt |
| Payment method | Text | | For example "EFTPOS – Mastercard" |
| Card last four | Text | | Last four digits only, never more |
| GST applies | Boolean | | From a GST note or marker on the document |

### Declaration and marks

| Field | Type | Notes |
| --- | --- | --- |
| Declaration present | Boolean | A practitioner declaration on the document |
| Signature present | Boolean | |
| Signature date | Date | Should match the service or issue date |
| Stamps and marks | List of Text | Stamps or handwriting, for example PAID; Check Disqualifying Content uses it |
| Raw text | Text | The full text as read, kept for forensics and audit |

## Claim Line (one per service line)

| Field | Type | Critical | Notes |
| --- | --- | --- | --- |
| Line number | Integer | | Order on the document |
| Service date | Date | Yes | From the line where printed; otherwise the document's date of service. One document can cover several dates |
| Reference number | Text | | Per-line reference, where printed |
| Item code | Text | Yes | Checked against Item Code Reference |
| Description | Text | | |
| Body area or tooth | Text | | Body area for physio, tooth number for dental |
| Quantity | Integer | | 1 when not printed; marked as derived |
| Fee | Decimal | Yes | |
| GST applies | Boolean | | From a per-line marker, where printed |

## Rules the layouts expose

- **Reconciliation allows for adjustments.** Line fees should equal the total charged, or the total charged plus printed adjustments. Reconcile Line Items records which one held; neither holding is the mismatch that sends the claim to Receipt Forensics.
- **Paid or not.** A document is paid when the amount paid equals the amount owing and the amount due is 0. A tax invoice with an amount still due hasn't been paid. Whether that rejects the claim, like a quotation, is a business decision still to make.
- **Several service dates.** Duplicate detection and the event strategies work per line, using each line's service date, not one date per document.
- **Derived values are marked.** A quantity of 1 that wasn't printed, or an issue date taken from the service date, is recorded as derived so an investigator can tell it from what was read.

## Worked example: CLM-0848 receipt

Valley Physio & Rehab Centre, fictional test data from [reference data](../reference-data.md).

| Field | Value |
| --- | --- |
| Document title | Patient Receipt & Private Health Insurance Claim Form |
| Document type | Receipt |
| Document number | REC-2025-1147 |
| Practice | Valley Physio & Rehab Centre · ABN 91 632 847 501 · Provider No. 7291048H |
| Practitioner | Amy Tran (B.Physio, APA) · AHPRA PHY0004827193, matching the header |
| Patient | Oliver Hartmann · DOB 03/07/1991 · 14 Wattle Ave, Ferntree Gully VIC 3156 |
| Health fund | NIB · membership N-6614-3388 · fund number 428 |
| Total charged | $270.00 |
| Amount paid | $270.00 · EFTPOS – Mastercard, card ending 7729 |
| Amount due | 0 |
| Declaration | Present, signed, dated 15/04/2025, matching the service date |

| Line | Service date | Item code | Description | Body area | Quantity | Fee |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 15/04/2025 | 500 | Standard Consultation (30 min) | — | 1 (derived) | $100.00 |
| 2 | 15/04/2025 | 515 | Clinical Pilates | Core / Hip | 1 (derived) | $85.00 |
| 3 | 15/04/2025 | 580 | Dry Needling | R. Hamstring | 1 (derived) | $55.00 |
| 4 | 15/04/2025 | 590 | Home Exercise Programme | — | 1 (derived) | $30.00 |

Lines total $270.00, equal to the total charged: reconciles.
