# 01 Application Context

Starts a new Pega GenAI Blueprint with the application context and personas only. The case types come in steps 02 and 03, so Blueprint has less to take in at once. Run the four prompts in this folder in order, checking the result after each one. The design they build is in [`docs/blueprint/target-case-design.md`](../../docs/blueprint/target-case-design.md).

Placeholders:

- `{{organisation_name}}`: the organisation name shown in the Blueprint's application context.

```text
Design a new application. In this step, set up the application context and personas only. Do not create any case types or data objects yet; I will add them in the next steps.

APPLICATION CONTEXT
Application name: Health Claim Fraud Detection.
Organisation: {{organisation_name}}. Location: Australia. Industry: Healthcare. Industry subsegment: Healthcare Insurance (Payer). Department: Claims Operations. Language: English.
Real-time fraud detection for health insurance claims. It covers any receipt or tax invoice a member can claim and upload, such as extras (dental, optical, physiotherapy) and pathology; the design must extend to other claim types, such as ambulance, without changing the case structure: a new claim type adds reference data and checks, not new stages. Every claim passes through three phases of analysis: Phase 1 receipt forensics (is the receipt genuine?), Phase 2 cross-claim signals (does the claim fit a pattern across other claims?) and Phase 3 network intelligence (is the claim connected to known fraud or an organised ring?). Clean claims go to adjudication; suspicious claims are referred to an investigator or the Specialist Investigation Unit (SIU) with a complete evidence package.

PERSONAS
Create exactly these four personas:
- Member: submits claims through the web portal and mobile app.
- Claims Administrator: reviews receipt extractions with low confidence.
- Investigator: works fraud investigations in the Investigator queue.
- SIU Analyst: works fraud investigations in the SIU queue.
Practice, Practitioner and Patient are data, not personas. Do not create them as personas.
```

## Check before step 02

- The context matches, and no case types or data objects have been created. If Blueprint created any, delete them.
- There are exactly four personas.
