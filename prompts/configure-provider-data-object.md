# Configure provider data object

Creates the Provider data object in Pega, loads three test providers and turns the Fraud Investigation form's Provider field into a searchable data-reference dropdown.

Placeholders: `{{client_name}}` (health fund client), `{{dev_system_id}}` (Pega dev system ID).

```text
In the {{client_name}} Fraud Detection dev system ({{dev_system_id}}), configure Provider data 
for the Fraud Investigation form:

==========================================
TASK 1: CREATE PROVIDER DATA OBJECT
==========================================

Create a new Data Object called "Provider" with these fields:

Field Name              | Type        | Required | Notes
---                     | ---         | ---      | ---
Provider ID             | Text        | Yes      | Unique identifier (e.g., 1948302K)
Provider Name           | Text        | Yes      | Full business name (e.g., Brighton Dental Care)
Provider Type           | Text        | Yes      | Dental, Physio, Hospital, etc.
Address                 | Text        | No       | Full address
Phone                   | Text        | No       | Contact phone
ABN                     | Text        | No       | Australian Business Number

System of Record: PegaLocal
Primary Key: Provider ID

==========================================
TASK 2: ADD TEST PROVIDER RECORDS
==========================================

Create 3 provider records with this data:

PROVIDER 1:
├─ Provider ID: 1948302K
├─ Provider Name: Brighton Dental Care
├─ Provider Type: Dental
├─ Address: 12 Bay St, Brighton VIC 3186
├─ Phone: (03) 9592 3344
└─ ABN: 74 291 836 540

PROVIDER 2:
├─ Provider ID: 7291048H
├─ Provider Name: Valley Physio & Rehab Centre
├─ Provider Type: Physio
├─ Address: 47 Railway Parade, Ferntree Gully VIC 3156
├─ Phone: (03) 9758 4429
└─ ABN: 91 632 847 501

PROVIDER 3:
├─ Provider ID: 6601430N
├─ Provider Name: Greenlight Medical Services
├─ Provider Type: Medical
├─ Address: [Address as needed]
├─ Phone: [Phone as needed]
└─ ABN: [ABN as needed]

==========================================
TASK 3: CONFIGURE PROVIDER DROPDOWN
==========================================

On the Fraud Investigation form (Stage 1: Claim Submitted):

1. Locate the "Provider" field in the form configuration
2. Change field type to: "Reference" or "Data Reference"
3. Link to: "Provider" data object
4. Display format: "Provider Name" (or "Provider ID - Provider Name")
5. Allow search/filter: Yes
6. Make required: Yes

Field Configuration:
├─ Label: Provider
├─ Type: Data Reference
├─ References: Provider (data object)
├─ Display Value: Provider Name
├─ Search Fields: Provider Name, Provider ID
├─ Required: Yes
└─ Help Text: "Select the healthcare provider from the list"

==========================================
EXPECTED RESULT
==========================================

When filling out Fraud Investigation form:

User clicks "Provider" dropdown
└─ See options:
   ├─ Brighton Dental Care (1948302K)
   ├─ Valley Physio & Rehab Centre (7291048H)
   └─ Greenlight Medical Services (6601430N)

User selects one
└─ Form captures full Provider reference (ID + Name + all details)

==========================================
```
