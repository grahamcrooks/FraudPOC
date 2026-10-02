# 03 Fraud Investigation Case Type

Adds the Fraud Investigation as a child case of the Claim, created only on referral, and connects it to the Claim's Referred stage. Run it after [02](02-claim-case-type.md).

No placeholders.

```text
Add a case type called Fraud Investigation. It is a child case of Claim, created only when a claim is referred. It references its parent Claim and does not copy the claim's data. Create exactly the stages and steps below, with the names exactly as written. Do not add stages or steps that are not listed.

Then update the Claim case type: in its Referred alternate stage, the Create Fraud Investigation step creates this Fraud Investigation as a child case, passing the referring phase, queue and priority. Wait for Investigation waits until the Fraud Investigation resolves.

Stage 1: Triage
- Route to Queue (automation): Investigator queue or SIU queue, as set by the referring phase on the parent Claim.
- Set Priority and SLA (automation): HIGH priority has a 4-hour SLA; Standard priority uses the standard SLA.

Stage 2: Investigate
- Review Evidence (user step, Investigator or SIU Analyst): the claim, the receipt, every check with its verdict, the forensic narrative and the network results.
- Request Information (user step, optional): from the member or the practice.
- Escalate to SIU (user step, optional, Investigator): move the case to the SIU queue.

Stage 3: Outcome
- Record Decision (user step, Investigator or SIU Analyst): Confirmed Fraud, False Positive or Pay, with notes.
- Feed Back Outcome (automation): add confirmed cases to the fraud case library and the network graph; record false positives for threshold tuning.
```

## Check before step 04

- Fraud Investigation is a child of Claim, not the other way round.
- Exactly three stages: Triage, Investigate, Outcome.
- The Claim's Referred stage creates the Fraud Investigation and waits for it.
- No other case types exist. If Blueprint created a Claim Validation or Network Intelligence Assessment case type, delete it.
