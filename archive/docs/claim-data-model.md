# Claim data model

Target structure of the ClaimHeader, showing which fields the member selects or enters, which are read-only lookups from a reference, and which are captured or calculated automatically. The GeoSession and DeviceSession objects are created by the [create fraud session data objects](../../prompts/create-fraud-session-data-objects/) prompts.

```text
ClaimHeader (Data Object)
├─ MEMBER (Reference + Auto-Lookup)
│  ├─ Claiming Member* (reference dropdown) ← USER SELECTS
│  ├─ Member DOB (read-only from reference)
│  ├─ Address (read-only from reference)
│  ├─ Postcode (read-only from reference)
│  ├─ Phone (read-only from reference)
│  ├─ Health Fund Name (read-only from reference)
│  ├─ Fund Number (read-only from reference)
│  └─ Membership Number (read-only from reference)
│
├─ PROVIDER (References)
│  ├─ Practice* (reference dropdown) ← USER SELECTS
│  ├─ Practitioner* (reference dropdown) ← USER SELECTS
│  └─ Practitioner AHPRA# (read-only from reference)
│
├─ CLAIM DETAILS
│  ├─ Claim Type* (dropdown: Extras, Pharmacy, Dental, etc.) ← USER SELECTS
│  ├─ Service Date* (date picker) ← USER ENTERS
│  ├─ Receipt Number (text) ← USER ENTERS
│  ├─ Receipt File Attachment* (upload) ← USER UPLOADS
│  └─ Practitioner Declaration (checkbox/text) ← USER ENTERS
│
├─ SERVICES (Repeating)
│  └─ ClaimLineItems*
│     ├─ ItemCode (reference/autocomplete)
│     ├─ Quantity (number)
│     ├─ ChargePerUnit or ItemAmount (number)
│     ├─ ItemDate (date, optional)
│     └─ ToothID (if dental, optional)
│
├─ SUMMARY (Calculated/Read-Only)
│  ├─ Total Amount Claimed (SUM of line items)
│  └─ Benefit Amount Paid (TBD by rules)
│
├─ PAYMENT/REFUND
│  ├─ Payment Method (enum: BANK_TRANSFER, CHEQUE, etc.) ← USER SELECTS
│  └─ Amount Received (member refund amount, calculated)
│
├─ FRAUD DETECTION (Auto-Captured)
│  ├─ GeoSession (embedded)
│  │  ├─ IPAddress (auto)
│  │  ├─ Latitude (auto)
│  │  ├─ Longitude (auto)
│  │  └─ AnomalyFlags (auto-evaluated)
│  │
│  └─ DeviceSession (embedded)
│     ├─ DeviceFingerprint (auto)
│     ├─ DeviceType (auto)
│     ├─ Browser (auto)
│     └─ AnomalyFlags (auto-evaluated)
│
└─ METADATA (Auto-Set)
   ├─ SubmissionDateTime
   ├─ Case Status
   └─ ClaimID
```
