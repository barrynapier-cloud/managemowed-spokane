# Cape Coral: publication handoff and routing investigation

Prepared October 11, 2026. Not published or submitted.

The public-email change replaces locations.capecoral.contact.email only, from Kristin@managemowed.com to Kristin.B@managemowed.com. It updates the contact section, footer mailto links and structured-data email. Automated rendered-template checks passed. All other JSON values remain unchanged.

## Source routing finding

Base examined: 0d3cac7347675d12bc955e70d21580f88cc45074.

The Cape Coral resend.notificationEmails list is:
- Kristin@managemowed.com
- james.j@managemowed.com
- barrynapier@gmail.com

server.js resolves the location from the incoming host and passes this list as the notification's to recipients. The global BCC list contains james.j@managemowed.com, filtered out when already in to. Customer-confirmation Reply-To uses the first notification recipient, currently Kristin@managemowed.com. The notification's Reply-To is the submitting prospect's address.

Proposed routing correction: change only locations.capecoral.resend.notificationEmails[0] to Kristin.B@managemowed.com. This would also correct customer-confirmation replies. Preserve James, Barry, global BCC, sender address, all other locations and the prospect reply behavior.

Routing has NOT been changed. Barry's October 8 instruction link is required to establish the precise authorized scope. Current source configuration does not prove current deployed configuration or successful mailbox delivery. The owner must verify deployed routing separately, with an authorized controlled delivery check if needed; no real lead or email has been sent by this agent.

## Preview evidence

User supplied contact and footer screenshots showing Kristin.B@managemowed.com, saved as capecoral-contact-user-preview.png and capecoral-footer-user-preview.png. User said "all good" after being asked for a narrow-screen check. Exact viewport dimensions and independent desktop/mobile screenshot coverage are not verified; do not label these as complete device evidence. Browser automation previously failed to initialize.

## Remaining handoff requirements

1. Include the link to Barry's October 8 direction.
2. Obtain properly identified desktop/mobile evidence or explicitly have the publisher complete the missing visual verification.
3. Push the exact reviewed public-contact revision and open an mm-publish issue with Mode: publish, full base/head identifiers, affected Cape Coral URLs, evidence, and this separate routing finding.
4. Do not silently include routing edits. Confirm authorization and review a new revision if routing is approved.
5. Verify the production page and lead routing separately after owner publication. Record source reconciliation, production receipt and rollback target.
