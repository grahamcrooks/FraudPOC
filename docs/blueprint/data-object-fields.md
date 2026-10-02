# Data Object Fields

The fields each data object needs so a claim can be ingested from a receipt or tax invoice, checked against reference data and passed to the later phases. It follows [receipt-extraction-fields.md](receipt-extraction-fields.md), which lists what Extract Receipt reads.

## The rule: what's printed is evidence, not master data

Extract Receipt writes only to the **Receipt** and its **Claim Lines**, exactly as printed. It never writes into Member, Practice or Practitioner. Those are reference records: the member comes from the fund's member system and the member's sign-in, and practices and practitioners from provider reference data.

**Link Practice and Practitioner** then matches the printed values to the reference records, sets the Claim's Practice, Practitioner and Patient, and records how well each matched. A mismatch is a signal, not something to fix: a receipt whose printed ABN doesn't match the practice record is exactly what forensics and ES-004 look for. If extraction overwrote the record with the printed value, the check would be lost.

| Printed on the receipt | Stored on | Matched to | Result on the Claim |
| --- | --- | --- | --- |
| Practice name, address, phone, email, ABN | Receipt | Practice record | Claim.Practice |
| Practitioner name, AHPRA number, provider number | Receipt | Practitioner record | Claim.Practitioner |
| Patient name, date of birth, address | Receipt | Members on the signed-in member's policy | Claim.Patient |
| Health fund name, membership number | Receipt | The signed-in member | Recorded only; another fund's name is a signal |
| Service lines | Claim Lines | Item Code Reference | Each line's item code record |

The signed-in member and the patient can differ: a member claims for a partner or child on the same policy. So the Claim has both: Member (who claimed, from sign-in) and Patient (who was treated, matched from the receipt).

## Member

System of record: the fund's member system. Read-only in this application. One record per person on a policy, so a dependant is a Member too.

| Field | Type | Used by |
| --- | --- | --- |
| Member number | Text, key | |
| Policy number | Text | Patient match: the patient must be on the same policy |
| Relationship | Principal, Partner, Dependant | |
| First name | Text | Patient match |
| Last name | Text | Patient match |
| Date of birth | Date | Patient match |
| Address | Text | |
| Suburb | Text | |
| State | Text | |
| Postcode | Text | |
| Registered address latitude | Decimal | ES-001 distance anomaly |
| Registered address longitude | Decimal | ES-001 distance anomaly |
| Phone | Text | Network graph (shared phone) |
| Email | Text | Network graph (shared email) |
| Cover | Text | Product name, for example Gold Hospital + Extras |
| Cover start date | Date | ES-005 waiver abuse (waiting periods) |

## Practice

Provider reference data. One record per practice location.

| Field | Type | Used by |
| --- | --- | --- |
| Practice ID | Text, key | |
| Practice name | Text | Practice match |
| Practice type | Dental, Optical, Physiotherapy, Pathology, … | Item code checks |
| Address | Text | Practice match; ES-001 |
| Suburb | Text | |
| State | Text | |
| Postcode | Text | |
| Phone | Text | Practice match; network graph |
| Email | Text | Practice match |
| ABN | Text | Practice match; ES-004 |
| ABN status | Active, Cancelled, Deregistered, Invalid | ES-004 phantom ABN |
| ABN registered entity | Text | ES-004: registered to another entity |
| Bank BSB | Text | ES-003 bank account ring |
| Bank account number | Text | ES-003 bank account ring |
| Monitored | Boolean | Network intelligence: monitored entity |

## Practitioner

Provider reference data. A practitioner can work at several practices, with a different provider number at each, so the practice link is a list.

| Field | Type | Used by |
| --- | --- | --- |
| Practitioner ID | Text, key | |
| Full name | Text | Practitioner match |
| Qualifications | Text | |
| Profession | Text | For example Physiotherapist, Pathologist |
| AHPRA number | Text | Practitioner match |
| AHPRA registration status | Registered, Suspended, Cancelled, Not found | Pre-flight; network intelligence |
| Practice affiliations | List of Practitioner Practice | Practitioner match; CLM-0845 (one practitioner, three practices) |
| Monitored | Boolean | Network intelligence: monitored entity |

**Practitioner Practice** (embedded in Practitioner)

| Field | Type |
| --- | --- |
| Practice | Reference to Practice |
| Provider number | Text, unique per practitioner per practice |
| From date | Date |
| To date | Date |

## Receipt

The document and everything printed on it. Embedded in the Claim. The header fields are listed in [receipt-extraction-fields.md](receipt-extraction-fields.md#receipt-one-per-document); these are the fields to add on top.

| Field | Type | Notes |
| --- | --- | --- |
| File | Attachment | The uploaded receipt or invoice |
| Header fields | As listed in receipt-extraction-fields.md | Document, provider, patient, health fund, totals and payment, declaration and marks, raw text |
| Extracted fields | List of Extracted Field | Confidence for every field, header and line |
| Practice match | Matched, Mismatch, Not found | Set by Link Practice and Practitioner |
| Practitioner match | Matched, Mismatch, Not found | |
| Patient match | Matched, Mismatch, Not found | |
| Match details | Text | Which printed values didn't match the record, for example "ABN differs" |

**Extracted Field** (embedded in Receipt)

One row per extracted value, so confidence doesn't need a second field beside every field.

| Field | Type |
| --- | --- |
| Field name | Text, for example "PracticeABN" or "Line 2 Fee" |
| Value | Text, as read |
| Confidence | Decimal, 0 to 1 |
| Derived | Boolean, true when filled in rather than read |
| Critical | Boolean, true for the fields held to 0.70 |

## Claim Line

One per service row, embedded in the Claim as a list. Fields as listed in [receipt-extraction-fields.md](receipt-extraction-fields.md#claim-line-one-per-service-line), plus:

| Field | Type | Notes |
| --- | --- | --- |
| Item code record | Reference to Item Code Reference | Set when the item code matches |
| Item code valid | Boolean | False when the code isn't in Item Code Reference |

## Item Code Reference

| Field | Type | Used by |
| --- | --- | --- |
| Item code | Text, key | |
| Description | Text | |
| Service category | Dental, Optical, Physiotherapy, Pathology, … | Claim type |
| Allowed practice types | List of Text | ES-006 item code validation (planned) |
| Typical fee | Decimal | Forensics context |

## Claim fields to add

| Field | Type | Notes |
| --- | --- | --- |
| Patient | Reference to Member | The person treated, matched from the receipt; may differ from Member |

## Gaps this closes

- **The Claim had no Patient.** Nothing recorded who was treated when a member claims for a dependant.
- **Member** had no policy, relationship or date of birth to match a patient against, and no coordinates for ES-001.
- **Practice** had no bank account (ES-003 depends on it), no ABN status (ES-004) and no email.
- **Practitioner** had one practice and no provider number per practice, so CLM-0845's practitioner at three practices couldn't be represented.
- **Confidence** had nowhere to live except a second field beside every extracted field.
- **Match results** weren't recorded, so a printed ABN that didn't match the practice was lost after linking.
- The older [Provider data object prompt](../../prompts/configure-provider-data-object.md) combines practice and practitioner in one object. It's superseded by Practice and Practitioner here.
