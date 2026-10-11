Mode: publish
Target: light
Base SHA: 0d3cac7347675d12bc955e70d21580f88cc45074
Head SHA: 10a287a1e02a90f4ca0475adfafa105730c090e6
Affected URL: https://www.managemowedcapecoral.com/ (also https://managemowedcapecoral.com/)
Requested change: Change only locations.capecoral.contact.email from Kristin@managemowed.com to Kristin.B@managemowed.com. This updates the visible contact section, footer, two mailto links and structured-data email. Phone numbers, other locations and lead recipients are unchanged in this revision.
Preview checks: Rendered-template checks verified both mailto links and structured data use the new address, with no old address in rendered HTML. Whole-JSON comparison confirmed only the one public contact email field changed. User supplied contact and footer screenshots and reported the narrow-screen check was "all good". Exact viewport sizes and separate desktop/mobile screenshot coverage are NOT independently verified; browser automation failed to initialize. Please complete missing visual checks before release or return that exact blocker. No real leads, emails or calls were sent.

## Specific instruction and submission authority

Original Teams instruction link supplied by Kiran:
https://teams.cloud.microsoft/l/message/19:17d0aa3dcb7a427683bcbdc64a48af33@thread.v2/1791478199716?context=%7B%22contextType%22%3A%22chat%22%7D

Screenshot supplied by Kiran says: "This isn't Kristin's right mm email. Can you update please Kiran Zafarullah?" and "This is from the lead submission from her website Cape Coral location in Florida". Kiran confirmed the correct address is Kristin.B@managemowed.com. The Teams permalink has not been independently opened/authenticated by this agent; the owner should verify its author and exact scope.

Barry's subsequent instruction as relayed by Kiran explicitly requests pushing this reviewed Cape Coral change, opening an mm-publish issue with Mode: publish, including the original direction link, and investigating form-lead routing separately. This request follows that direction, not blanket routine-copy permission.

## Separate routing finding: unresolved, not fixed by this revision

In the examined source, Cape Coral resend.notificationEmails contains Kristin@managemowed.com, james.j@managemowed.com and barrynapier@gmail.com. server.js selects the location from the incoming host, uses this list for lead notifications, and uses its first entry as Reply-To for the customer confirmation. The global James BCC is filtered out when already a direct recipient. Lead-notification Reply-To remains the prospect's submitted email.

Proposed additional correction: replace only locations.capecoral.resend.notificationEmails[0] with Kristin.B@managemowed.com, preserving James, Barry, sender identity, global BCC and other locations. This would also correct the customer-confirmation Reply-To. It has NOT been applied. Please verify whether the linked instruction authorizes this routing change; if further approval is needed, state that exact blocker. Do not treat publishing the display change as resolving lead delivery.

Source inspection is not proof of current deployed configuration or mailbox delivery. No provider logs or production secrets were accessed. Owner access is needed to verify production routing and delivery separately. Any controlled email test needs explicit authorization; no customer lead should be submitted as a test.

## Owner release checks

The selected base includes the published Eugene update and subsequent spam protection. Reconcile it with current production before release; the dated release branch alone is not production proof. If production advanced, return the mismatch rather than overwriting newer work. Save a rollback target, publish only the reviewed revision if its specific scope is authorized, verify the live page, and separately report lead-routing status. Return any exact blocker. This request is not a live receipt.
