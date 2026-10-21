# Security Review — Prompt-Library

**Review date:** 2026-10-21  
**Scope:** `/Users/cipher/Projects/Prompt-Library`, current local `main` at `fd41c647c96391bdec73241e49d4db35f3d01db0`, including the ignored existing `dist/` output; live deployment URL `https://prompt-library-snowy.vercel.app`.  
**Overall risk:** **Moderate**. No client-side injection, credential disclosure, malicious prompt payload, or exposed API was found. The main actionable risk is vulnerable packages in the build/development dependency chain. There is also an environment-file ignore gap and a live root redirect that currently lands on a 404.

## Findings

### Medium — Vulnerable packages in the development/build dependency tree

**Location:** [package.json](/Users/cipher/Projects/Prompt-Library/package.json:21), `package-lock.json`; `npm audit` on 2026-10-21.

**Evidence:** `npm audit` reports four affected packages and four high-severity vulnerability entries in its summary (0 critical; fixes available). Its detailed report includes these advisories:

- `vite@8.0.14` (direct dev dependency; affected ranges include `8.0.0`–`8.0.15`; [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), among other Vite advisories).
- `postcss@8.5.15` (transitive dev dependency; affected `<=8.5.22`; [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849)).
- `nanoid@3.3.12` (transitive dev dependency; affected `<=3.3.17`; [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8)).
- `source-map-js@1.2.1` (transitive dev dependency; affected `<1.2.2`; [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)).

`npm explain` places all four under development/build tooling; none is in the production dependency graph. `npm outdated` also reports newer compatible versions, including Vite `8.3.5`. Advisories include denial-of-service and, for Vite/PostCSS, path disclosure or traversal conditions in affected tooling contexts.

**Impact:** An attacker who can reach a developer's affected tooling under the applicable advisory conditions could affect that development/build environment. The reviewed site is a static client app, and these packages are not shipped as server runtime code, so this does not establish a remotely exploitable production endpoint.

**Fix:** Update the direct build dependencies and regenerate `package-lock.json` so the resolved Vite, PostCSS, nanoid, and source-map-js versions fall outside their advisory ranges; then rerun `npm audit` and validate the production build in the normal release workflow.

### Low — Vite production/development env files are not all ignored

**Location:** [.gitignore](/Users/cipher/Projects/Prompt-Library/.gitignore:7).

**Evidence:** The ignore rules list `.env`, `.env.local`, and `.env.*.local`, but do not match Vite's common `.env.production` or `.env.development` filenames. No `.env` file was found in the reviewed tracked or working-tree file listing, and no secret-like credential pattern was found in the checked Git history.

**Impact:** A future developer could accidentally stage an unignored environment file containing secrets. This is a preventive coverage gap, not evidence that a secret is currently present.

**Fix:** Ignore `.env*` by default and explicitly allow a sanitized example such as `!.env.example`; keep actual values in deployment secrets or ignored local files.

### Low — Supplied live root URL redirects to a destination returning 404

**Location:** [vercel.json](/Users/cipher/Projects/Prompt-Library/vercel.json:36); observed URLs: [preview root](https://prompt-library-snowy.vercel.app/) and [redirect destination](https://simonhakansson.com/prompt-library/).

**Evidence:** On review, `https://prompt-library-snowy.vercel.app/` returned HTTP 308 to `https://simonhakansson.com/prompt-library/`. That destination returned Vercel HTTP 404. The app itself did return HTTP 200 at `https://prompt-library-snowy.vercel.app/prompt-library/`.

**Impact:** Users following the supplied root URL are redirected to an unavailable destination. This is an availability/configuration issue; it does not indicate an open redirect because the destination is fixed, not user-controlled.

**Fix:** Ensure the canonical domain route is deployed and serving this app before redirecting the preview root, or change the root redirect to a path that returns the application.

### Info — Public profile links disclose the site owner's social identities

**Location:** [Header.tsx](/Users/cipher/Projects/Prompt-Library/src/components/layout/Header.tsx:28).

**Evidence:** The page includes links to a named LinkedIn profile and the `0fflineDocs` GitHub organization.

**Impact:** These links expose the owner's public social identities to every visitor. They appear intentional; no email address, authentication data, or other personal form data was observed on the page.

**Fix:** No fix is needed if intended. Remove or generalize the profile links if the identities should not be associated with this site.

## Checks completed and clean

- **Repository and history:** The working tree was clean. `git rev-list --left-right --count origin/main...HEAD` returned `0 0`; local `main` and the fetched local `origin/main` ref both pointed at `fd41c64`. This commit, “Serve site under simonhakansson.com path,” was reviewed. Thus, despite the request's note that local `main` was one commit ahead, no ahead-of-origin commit was present in the repository state available to this review. No environment/credential-named file appeared in Git history. A credential-pattern search over `git log --all -p` returned no matches. `gitleaks` and `trufflehog` were not installed, so this was a targeted pattern search, not a comprehensive secrets-scanner certification.
- **Secret/build output check:** `.env` files were not present in the reviewed file listing. Existing ignored `dist/` was inspected without rebuilding or changing it: it contained no `VITE_` identifiers, source-map reference, `*.map` file, or matching common credential pattern. The live JS bundle likewise contained no `sourceMappingURL`; a request for the corresponding `.js.map` path returned the app HTML fallback rather than a map.
- **Dependencies and lockfile:** `npm audit`, `npm outdated`, `npm ls --all --depth=1`, and `npm explain` were run. `package-lock.json` is lockfile v3, has registry-resolved packages with integrity hashes for all resolved entries, and contains no non-registry resolved URLs. `fsevents` is the only package with an install script; it is an optional platform dependency. No confirmed abandoned package was identified in these checks. `npm ls` showed extraneous optional native packages in the existing local `node_modules`, which are not declared by the lockfile.
- **Rendering, links, and clipboard:** Prompt text is rendered through React text interpolation and a `<pre>` element, not `dangerouslySetInnerHTML`, `innerHTML`, or Markdown/HTML rendering. The clipboard handler sends the bundled prompt string through `navigator.clipboard.writeText()` in a click handler; the content is copied as plain text. The social links using `target="_blank"` set `rel="noopener noreferrer"`. No user-controlled URL navigation, `window.open`, or open-redirect parameter was found.
- **API/serverless surface:** `src/lib/api.ts` uses an eager local JSON import and a simulated delay. No API route, serverless function, authentication flow, or backend fetch/SSRF surface was found in the repository.
- **Prompt content:** All 51 prompt JSON files parsed. A programmatic scan found no format-control, bidi, zero-width, or other nonstandard control characters in prompt content. The visible URL scan found templates/placeholders such as `actual-article-url` and `customer-externalweb.com`; these occur as explicit examples in prompt text, not hidden links. No suspicious redirect/shortener URL or covert exfiltration instruction was identified. Prompts necessarily contain visible instructions intended for users to copy into AI tools.
- **CI/Vercel:** No GitHub Actions workflow files were present, so there were no Actions permissions, `pull_request_target`, or workflow-secret uses to assess. `vercel.json` defines a fixed redirect, a path rewrite, and response headers; no user-controlled rewrite/redirect target was found.
- **Live headers/assets/privacy:** The app path `/prompt-library/` on the supplied Vercel deployment returned HTTP 200 with CSP, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. CSP includes `frame-ancestors 'none'`, `object-src 'none'`, and same-origin scripts/connects. HTML references only same-origin JS/CSS; no third-party script or mixed-content request was found. No analytics, cookie access, local/session storage, or cookie-setting response was observed. `/robots.txt`, `/sitemap.xml`, and a guessed source-map path under `/prompt-library/` return the rewritten app HTML with 200, not crawler files or a source map.

## Could not verify

- `npm audit` reflects the package advisory database available at review time; it is not proof of exploitability in this project's exact local workflow. No dependency install or build was run as part of this review.
- `origin/main` was the local Git remote-tracking ref; no fetch was performed. The review therefore confirms the local ref relationship, not the current remote branch state beyond that ref.
- The canonical custom-domain route returned 404, so its delivered application headers/content could not be examined. Header results above are for the app's working Vercel subpath. Checks were passive HTTP requests only; no scanning or load testing was performed.
- The local `dist/` folder is ignored and may not be byte-for-byte the current production build. The live deployment assets and local output were both checked separately.
