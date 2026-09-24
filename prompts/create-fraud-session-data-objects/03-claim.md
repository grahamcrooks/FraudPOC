# Embed session objects in the Claim

Step 3 of 3. Embeds GeoSession and DeviceSession in the Claim (1:1) and lists the example property paths. Run it after steps 1 and 2: it refers to the objects they create.

```text
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
