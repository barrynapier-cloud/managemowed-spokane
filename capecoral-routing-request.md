Mode: publish
Target: light
Base SHA: 0d3cac7347675d12bc955e70d21580f88cc45074
Head SHA: da256511184d71a1c3337283f75ede201a8e66be
Task branch: kiran/capecoral-email-20261009
Affected URL: https://www.managemowedcapecoral.com/

## Updated request: public email and lead routing

Supersedes the previous public-email-only head 10a287a1e02a90f4ca0475adfafa105730c090e6. Exactly two JSON values differ from the base:
- locations.capecoral.contact.email: Kristin@managemowed.com -> Kristin.B@managemowed.com.
- locations.capecoral.resend.notificationEmails[0]: Kristin@managemowed.com -> Kristin.B@managemowed.com.

The existing server uses notificationEmails[0] for customer-confirmation replyTo and reply_to, so no shared server/template change is needed. James and Barry remain on the notification list. Global BCC, sender, phone, all other fields and all 12 other location objects are unchanged. Sales-notification Reply-To still goes to the prospect.

## Barry's specific instruction, relayed by Kiran on October 13

> Hey Kiran, approved. Please replace Kristin@managemowed.com with Kristin.B@managemowed.com for Cape Coral lead notifications and the customer-confirmation Reply-To address, keeping all other recipients unchanged. Add this approval and the routing change to GitHub issue #8 and move it through the existing publishing process. Once published, send the live-page check and confirmation that a test lead reaches the correct address and customer replies go to Kristin.B@managemowed.com. Flag any blocker.

Kiran explicitly instructed this agent to carry out that request. This is the exact pasted authorization, not independent authentication of Barry's identity. The owner must apply its trusted authorization checks; if direct owner-chat evidence is still needed, state that precise blocker. The separate ServiceMinder instruction is outside this website release.

Original instruction link supplied by Kiran: https://teams.cloud.microsoft/l/message/19:17d0aa3dcb7a427683bcbdc64a48af33@thread.v2/1791478199716?context=%7B%22contextType%22%3A%22chat%22%7D

## Verification

- Fresh fetch of all branches and tags completed October 13. No newer source branch than the known spam-guard base was fetched. This is not proof of current production source.
- Actual Express POST /api/leads handler exercised locally for Cape Coral, Eugene and Spokane, with PostgreSQL and Resend replaced by local stubs. Cape Coral notification recipients and both customer Reply-To properties pass; control locations pass.
- Whole JSON comparison confirms only one additional routing field differs from previously reviewed 10a287a. All other location objects and global BCC unchanged.
- Cape Coral HTML renders identically to 10a287a; two mailto links use Kristin.B@managemowed.com and no old contact email remains in rendered HTML.
- No real lead, email or call sent. Local intercepted tests do not prove mailbox delivery.
- Prior user-provided contact/footer screenshots are retained as historical public-email preview evidence, not fresh desktop/mobile verification of this head. Fresh browser preview attempt failed with ERR_CONNECTION_TIMED_OUT. Complete independent desktop/mobile verification before release.

## Owner release and delivery checks still required

1. Verify specific authorization, reconcile with current production source and preserve newer work. Record any publication SHA if reconciliation creates one.
2. Verify desktop/mobile contact and footer, email links and structured data; preserve phone and other sites. Save rollback target and publish exact reviewed revision.
3. Verify public page on the real domain after deployment.
4. Perform the explicitly authorized controlled test lead using an owner-controlled test mailbox. Confirm notification delivery to Kristin.B@managemowed.com using provider/mailbox evidence, not only an HTTP success response. Check the received customer confirmation's Reply-To and reply destination. Do not substitute a real customer's details.
5. Report publication receipt and delivery confirmation separately, or exact access/authorization blocker. No deployment or live delivery has yet been confirmed by this agent.
