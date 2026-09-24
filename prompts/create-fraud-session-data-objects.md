# Create fraud session data objects

Creates the GeoSession and DeviceSession data objects, embeds both in the Claim case (1:1) and summarises the resulting ClaimHeader paths used by the fraud checks. Run the parts in the order shown: the embedding step refers to the objects created before it.

```text
Name: GeoSession
Type: Data Object
Scope: Embedded in Claim (scoped)

Properties:
  - GeoSessionID               [key]
  - IPAddress                  [string]
  - Latitude                   [decimal]
  - Longitude                  [decimal]
  - Suburb                     [string]
  - Postcode                   [string]
  - CountryCode                [string, "AU"]
  - StateCode                  [string, "VIC"]
  - LocationAccuracy           [integer, meters]
  - DistanceFromMemberAddress  [decimal, km]
  - GeofenceRiskLevel          [enum: LOW, MEDIUM, HIGH]
  - AnomalyFlags               [text: DISTANCE_ANOMALY | TIMEZONE_MISMATCH | IMPOSSIBLE_TRAVEL]
  - CapturedDateTime           [datetime, UTC]
  - CapturedBy                 [string, "system" or user ID]

Name: DeviceSession
Type: Data Object
Scope: Embedded in Claim (scoped)

Properties:
  - DeviceSessionID            [key]
  - DeviceFingerprint          [string, hashed]
  - DeviceType                 [enum: MOBILE, TABLET, DESKTOP]
  - Browser                    [string, "Chrome", "Safari"]
  - BrowserVersion             [string]
  - OSType                     [enum: iOS, Android, Windows, macOS, Linux]
  - OSVersion                  [string]
  - ScreenResolution           [string]
  - UserAgent                  [text]
  - Timezone                   [string, "Australia/Melbourne"]
  - Language                   [string, "en-AU"]
  - DeviceRiskLevel            [enum: LOW, MEDIUM, HIGH]
  - AnomalyFlags               [text: DEVICE_RING | BULK_SUBMISSION | SPOOFING]
  - CapturedDateTime           [datetime, UTC]
  - CapturedBy                 [string, "system" or user ID]

Property Name: GeoSession
Type: Data Object
Data Object Type: GeoSession (the object you just created)
Embedded: Yes
Cardinality: 1:1

Property Name: DeviceSession
Type: Data Object
Data Object Type: DeviceSession (the object you just created)
Embedded: Yes
Cardinality: 1:1

Name: ClaimHeader
Type: Case (remains same)

New Embedded Objects:
  - GeoSession                 [GeoSession data object, 1:1]
  - DeviceSession              [DeviceSession data object, 1:1]

Example path in Claim:
  Claim.GeoSession.Latitude
  Claim.GeoSession.AnomalyFlags
  Claim.DeviceSession.DeviceFingerprint
  Claim.DeviceSession.DeviceRiskLevel
```
