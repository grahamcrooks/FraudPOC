# Create GeoSession data object

Step 1 of 2. Creates the GeoSession data object, which captures where a claim was submitted from (IP address, location, distance from the member's address) and the resulting location anomaly flags.

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
```
