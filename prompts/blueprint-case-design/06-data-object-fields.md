# 06 Data Object Fields

Adds the fields the data objects need to ingest a receipt: Member, Practice, Practitioner, Receipt, Claim Line and Item Code Reference, plus two small embedded objects and a Patient field on the Claim. Run it after [05](05-ai-step-details.md), in Blueprint or Infinity Studio. The reasoning, and what each field is used by, is in [`docs/blueprint/data-object-fields.md`](../../docs/blueprint/data-object-fields.md).

No placeholders.

```text
Add the fields below to the existing data objects. Do not change any case type, stage or step. Do not remove existing fields unless they duplicate one listed here.

Extract Receipt writes only to Receipt and Claim Line, as printed. It never writes into Member, Practice or Practitioner; Link Practice and Practitioner matches the printed values to those records and records the result.

MEMBER (system of record: the fund's member system; read-only; one record per person on a policy)
Member Number (Text, key), Policy Number (Text), Relationship (Principal, Partner, Dependant), First Name (Text), Last Name (Text), Date of Birth (Date), Address (Text), Suburb (Text), State (Text), Postcode (Text), Registered Address Latitude (Decimal), Registered Address Longitude (Decimal), Phone (Text), Email (Text), Cover (Text), Cover Start Date (Date).

PRACTICE (one record per practice location)
Practice ID (Text, key), Practice Name (Text), Practice Type (Dental, Optical, Physiotherapy, Pathology, Other), Address (Text), Suburb (Text), State (Text), Postcode (Text), Phone (Text), Email (Text), ABN (Text), ABN Status (Active, Cancelled, Deregistered, Invalid), ABN Registered Entity (Text), Bank BSB (Text), Bank Account Number (Text), Monitored (Boolean).

PRACTITIONER
Practitioner ID (Text, key), Full Name (Text), Qualifications (Text), Profession (Text), AHPRA Number (Text), AHPRA Registration Status (Registered, Suspended, Cancelled, Not found), Practice Affiliations (list of Practitioner Practice), Monitored (Boolean).

PRACTITIONER PRACTICE (new, embedded in Practitioner)
Practice (reference to Practice), Provider Number (Text), From Date (Date), To Date (Date).

RECEIPT (embedded in Claim)
File (Attachment), Document Title (Text), Document Type (Receipt, Tax invoice, Quotation, Estimate, Statement), Document Number (Text), Issue Date (Date), Service Time (Text), Due Date (Date), Account Reference (Text), Printed Practice Name (Text), Printed Practice Address (Text), Printed Practice Phone (Text), Printed Practice Email (Text), Printed Practice ABN (Text), Printed Provider Number (Text), Printed Practitioner Name (Text), Printed Practitioner Qualifications (Text), Printed AHPRA Number (Text), Referring Provider (Text), Printed Patient Name (Text), Printed Patient Date of Birth (Date), Printed Patient Address (Text), Printed Patient Postcode (Text), Printed Patient Phone (Text), Health Fund Name (Text), Membership Number (Text), Fund Number (Text), Total Charged (Decimal), Adjustments (Decimal), Amount Paid (Decimal), Amount Due (Decimal), Payment Method (Text), Card Last Four (Text), GST Applies (Boolean), Declaration Present (Boolean), Signature Present (Boolean), Signature Date (Date), Stamps and Marks (list of Text), Raw Text (Text), Extracted Fields (list of Extracted Field), Practice Match (Matched, Mismatch, Not found), Practitioner Match (Matched, Mismatch, Not found), Patient Match (Matched, Mismatch, Not found), Match Details (Text).

EXTRACTED FIELD (new, embedded in Receipt; one row per extracted value)
Field Name (Text), Value (Text), Confidence (Decimal), Derived (Boolean), Critical (Boolean).

CLAIM LINE (embedded in Claim as a list; one per service row)
Line Number (Integer), Service Date (Date), Reference Number (Text), Item Code (Text), Description (Text), Body Area or Tooth (Text), Quantity (Integer), Fee (Decimal), GST Applies (Boolean), Derived (Boolean), Item Code Record (reference to Item Code Reference), Item Code Valid (Boolean).

ITEM CODE REFERENCE
Item Code (Text, key), Description (Text), Service Category (Dental, Optical, Physiotherapy, Pathology, Other), Allowed Practice Types (list of Text), Typical Fee (Decimal).

CLAIM CASE TYPE
Add Patient (reference to Member): the person treated, matched from the receipt by Link Practice and Practitioner. It may differ from Member, who is the person who signed in and claimed.
```

## Check when done

- Member, Practice and Practitioner have no field that Extract Receipt writes to.
- Receipt has the printed values, prefixed "Printed" where a reference record holds the same kind of value, so the two can't be confused.
- Practitioner Practice and Extracted Field exist as embedded objects.
- The Claim has both Member and Patient.
