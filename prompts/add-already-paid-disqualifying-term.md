# Add the PAID stamp as a disqualifying term

Extends the pre-flight disqualifying content check so a receipt stamped PAID by the practice is rejected before any forensic analysis. A PAID stamp means the account is already settled, so there is nothing left for the member to claim. Like a quotation, it is a property of the document, readable from the page, and needs no lookup. The demo shows the result in scenario CLM-2024-0848.

```text
Extend the data transform SetKeywordMatchResults, which the pre-flight
disqualifying content check uses to match receipt text against the list of
disqualifying terms.

1. Add the PAID stamp as a new term, with its own disposition value:
   AlreadyPaid. The list goes from 10 terms to 11.

2. Match it on the phrase or on word boundaries, never as a substring.
   Match the stamp, not the word "paid" wherever it occurs.

   Must match (disposition AlreadyPaid):
   - A PAID stamp on the receipt, for example "PAID" stamped across the
     services table, alone or with a date ("PAID 15/07/2026")

   Must not match (these appear on perfectly claimable receipts):
   - "amount paid"
   - "paid in full"
   - "unpaid"
   - "prepaid"

3. A match on this term fails the disqualifying content check, like the
   other terms. The claim goes to Reject Document with status
   Resolved-Rejected, and the pipeline does not run: no forensic AI calls,
   and no referral to the fraud team.

4. Record in the match results that the PAID stamp was the matched term and
   where it was found, so the rejection can show the finding, for example
   "PAID stamp across the services table" and "1 of 11 terms matched".

5. Leave the existing terms and their dispositions unchanged.
```
