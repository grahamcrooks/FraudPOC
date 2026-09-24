# Create DeviceSession data object

Step 2 of 2. Creates the DeviceSession data object, which captures the device and browser a claim was submitted from and the resulting device anomaly flags.

```text
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
```
