# Embed session objects in the Claim

Step 3 of 3. Embeds GeoSession and DeviceSession in the single Claim object (1:1) and makes sure each has the fields that Phase 2 event strategies ES-001 and ES-002 need. Run it after steps 1 and 2: it refers to the objects they create.

**Dependency (not part of this prompt):** ES-001 also needs `RegisteredAddressLatitude` and `RegisteredAddressLongitude` on the Member object. Without them the strategy has no registered address to measure the submission location against.

```text
Embed the GeoSession and DeviceSession data objects in the Claim object,
and make sure each has the fields listed below.

WHY THESE FIELDS EXIST
- ES-001 compares the location a claim was submitted from against the
  member's registered address. The GeoSession geocode fields are its input.
- ES-002 aggregates claims on the device fingerprint. DeviceFingerprintID
  is its aggregation key.
Without the geocode and fingerprint fields, neither strategy has an input.

==========================================
TASK 1: EMBED THE SESSION OBJECTS IN CLAIM
==========================================

Property Name: GeoSession
Type: Data Object
Data Object Type: GeoSession (created in step 1)
Embedded: Yes
Cardinality: 1:1

Property Name: DeviceSession
Type: Data Object
Data Object Type: DeviceSession (created in step 2)
Embedded: Yes
Cardinality: 1:1

Both properties belong to Claim. There is no separate ClaimHeader object.

==========================================
TASK 2: GEOSESSION FIELDS
==========================================

Add any of these fields that GeoSession does not already have:

Field Name               | Type     | Notes
---                      | ---      | ---
SubmissionIPAddress      | Text 45  | IPv6 capable
IPGeoLatitude            | Decimal  |
IPGeoLongitude           | Decimal  |
IPGeoCity                | Text     |
IPGeoState               | Text     |
IPGeoCountry             | Text     |
IPGeoResolvedDateTime    | DateTime |
IPGeoSource              | Text     | Which lookup produced the geocode
IsVPNOrProxy             | Boolean  |
IsHostingRange           | Boolean  |

==========================================
TASK 3: DEVICESESSION FIELDS
==========================================

Add any of these fields that DeviceSession does not already have:

Field Name                   | Type        | Notes
---                          | ---         | ---
DeviceFingerprintID          | Text        | The ES-002 aggregation key
DeviceType                   | Text        |
OperatingSystem              | Text        |
ClientApp                    | Text        |
AppVersion                   | Text        |
UserAgent                    | Text (long) |
FingerprintMethod            | Text        | Which SDK produced the fingerprint
FingerprintCapturedDateTime  | DateTime    |

==========================================
EXPECTED RESULT
==========================================

Claim
├─ GeoSession (embedded, 1:1)
│  └─ SubmissionIPAddress, IPGeoLatitude, IPGeoLongitude, IPGeoCity,
│     IPGeoState, IPGeoCountry, IPGeoResolvedDateTime, IPGeoSource,
│     IsVPNOrProxy, IsHostingRange
└─ DeviceSession (embedded, 1:1)
   └─ DeviceFingerprintID, DeviceType, OperatingSystem, ClientApp,
      AppVersion, UserAgent, FingerprintMethod,
      FingerprintCapturedDateTime

Example paths:
  Claim.GeoSession.IPGeoLatitude
  Claim.GeoSession.IsVPNOrProxy
  Claim.DeviceSession.DeviceFingerprintID
  Claim.DeviceSession.FingerprintMethod
```
