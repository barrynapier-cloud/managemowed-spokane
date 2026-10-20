# Submit a reviewed website change for publishing

Kiran uses her own GitHub account. She does not need a Vercel seat, hosting token or Barry's login. A scheduled owner publishing agent checks requests hourly while Barry's Mac/Codex is available. It uses existing agent allowance and hosting usage; this avoids an additional Vercel seat, not all operating costs. Processing is not instant or guaranteed while the Mac is asleep/offline or usage is unavailable.

## Your agent's steps

1. Fetch the latest source and release receipt. Create a task branch, make the focused edit, and preview on desktop and mobile. Read publishing-scope.md. Do not deploy from the dated baseline without checking newer releases.
2. Commit and push the exact reviewed change to the matching repository using KiranRana-291. Record full base and head SHAs. Never send credentials.
3. Open a GitHub issue in that same repository with the label `mm-publish`. Use the included `scripts/request-publish.py` helper or create it through your authenticated GitHub app. Include the target, mode, SHAs, exact requested change, affected URLs and preview evidence. A branch name alone is insufficient.
4. Wait for the publishing reply on the issue. Routine eligible edits use Barry's standing authorization. Kiran-approved contact corrections and evidenced legacy redirects also publish without another Barry approval under publishing-scope.md. Other larger changes pause for Barry's exact approval. If a request is blocked, answer the specific issue, supply the corrected SHA if needed, and re-add `mm-publish` to retry.
5. Call the change live only when the worker reports successful production verification and a live URL. Record the source/publication revisions and rollback target. A closed dry-run request is not a live deployment.

Targets and repositories:
- corporate: barrynapier-cloud/managemowed (src/)
- franchise-preview: barrynapier-cloud/managemowed (franchise/); does not launch the public franchise route
- dark: barrynapier-cloud/managemowed-seattle
- light: barrynapier-cloud/managemowed-spokane, including Eugene

Request body:

```text
Mode: publish (or dry-run for review without deployment)
Target: light
Base SHA: [full 40-character source revision]
Head SHA: [full 40-character reviewed revision]
Affected URL: [exact public page]
Requested change: [what changed and why]
Preview checks: [desktop/mobile evidence, links, affected locations, tests]
```

The worker preserves Kiran's source commits and records attribution when preparing an owner publication commit. It will stop if current live source is not reconciled, scope is larger than authorized, checks fail, or the provider rejects deployment. It will never pretend to be Kiran or strip metadata to evade provider restrictions.

## Eugene example, not an instruction to edit now

Barry requested a worked example only. Current number verified September 23: (541) 216-7366. When Barry provides the replacement, update only `locations.eugene.contact.phone` and `phoneRaw` in the light repository. Check navigation (desktop/mobile), hero call link, contact, footer, structured-data telephone and all `tel:` links. Preserve lead recipients and every other location. Use `Mode: dry-run` for the first practice request. Do not invent or publish a practice number. A real phone update needs an evidenced replacement and Kiran approval under the October 19 delegation; no additional Barry approval is required.

## Configuration-only redirects

Use Target: corporate-redirects and Mode: publish with mm-publish. Include exact old paths, verified destinations, supporting evidence and Kiran approval. No source deployment SHA is required for a redirect-only request. The worker compares live/staged versions, stages only the approved rules, checks the staging alias, promotes the exact verified version, and verifies public variants. Never redeploy the application for this request. Seattle remains blocked until its actual old link and intended destination are evidenced.
