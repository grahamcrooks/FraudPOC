In the Bupa Fraud Detection dev system (BP-2441061), configure Provider data 
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

Member Number* (text input — manual entry for testing)
Claim Type* (local list dropdown)
Service Date* (date picker — dd/mm/yy)
Practice* (reference dropdown — existing field)
Practitioner* (reference dropdown — existing field)


SECTION B: Line Items (Repeating Table)

Item Code, Quantity, Item Charge, Date
[+ Add Another Item] button

SECTION C: SUMMARY

Total Amount (auto-calculated)



PRACTICES TABLE
Practice Name	Provider ID	ABN	Type	Address	Phone	City
Brighton Dental Care	1948302K	74 291 836 540	Dental	12 Bay St, Brighton VIC 3186	(03) 9592 3344	Brighton
Valley Physio & Rehab Centre	7291048H	91 632 847 501	Physio	47 Railway Parade, Ferntree Gully VIC 3156	(03) 9758 4429	Ferntree Gully
ABC Dentistry	1948302K	11711111111	Dental	Level 1, 179 Turbot St, Brisbane QLD 4000	(07) 6557 3975	Brisbane
QML Pathology	2376344T	(not shown)	Pathology	QML Pathology	(not shown)	Brisbane
Best Remedial Services Chermside	C207589	65075978526	Massage/Remedial	Shop 104, 25 Brisbane Street Chermside QLD 4012	0478 254 235	Chermside
Dr Rachel Nowland Medical	123456AB	(not shown)	Medical	Suite 1, 11 Digital Street, Melbourne VIC 3000	(not shown)	Melbourne
PRACTITIONERS TABLE
Practitioner Name	Credentials	AHPRA/Registration	Associated Practice	Type
Dr. Wendy Kostadinov	BDS	(not shown)	Brighton Dental Care	Dentist
Amy Tran	B.Physio, APA	PHY0004827193	Valley Physio & Rehab Centre	Physiotherapist
Margaret Simpson	(not shown)	(not shown)	ABC Dentistry	Dentist
Dr Renu Vohra	(not shown)	(not shown)	QML Pathology	Pathologist
(Massage Therapist - name not shown)	(not shown)	(not shown)	Best Remedial Services Chermside	Massage Therapist
Dr Rachel Nowland	(not shown)	(not shown)	Dr Rachel Nowland Medical	Medical Practitioner
