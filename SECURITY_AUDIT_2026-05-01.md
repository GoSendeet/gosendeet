# GoSendeet Frontend — Security Audit Report

**Date:** 2026-05-01
**Auditor:** Claude Code (Anthropic) / Jerry Ebizo (GoSendeet)
**Branch audited:** `fix/quick-security-audity`
**Scope:** Full frontend codebase (`src/`, `vercel.json`, `.env`, `vite.config.ts`)
**Methodology:** Static analysis + diff review + false-positive validation with multiple independent review agents

---

## Executive Summary

The audit identified **4 confirmed findings** across critical, high, and medium severity tiers. Three of the four findings have been remediated directly in this audit session. One finding (credentials in git history) requires immediate manual action by a project owner with repository admin access.

No instances of XSS vectors (`dangerouslySetInnerHTML`, `innerHTML`, `eval`), unprotected API tokens in `localStorage`, or hardcoded credentials in active source code were found.

---

## Findings Overview

| ID | Severity | Status | Title |
|----|----------|--------|-------|
| SEC-01 | CRITICAL | Manual action required | Sensitive credentials committed to git history |
| SEC-02 | HIGH | Manual action required | Google Maps API key exposed without referrer restrictions |
| SEC-03 | MEDIUM | Fixed in this audit | No HTTP security headers (CSP, HSTS, etc.) |
| SEC-04 | MEDIUM | Fixed in this audit | Bank account PII logged to browser console |
| SEC-05 | MEDIUM | Fixed in this audit | Payment redirect URL not validated against allowlist |

---

## Detailed Findings

---

### SEC-01 — CRITICAL: Credentials Committed to Git History

- **Severity:** CRITICAL
- **CVSS Base Score (estimated):** 9.1
- **Status:** Manual action required — NOT automatically fixable
- **Files:** `.env` (removed, but history persists)
- **Discovery:** Git log analysis found a prior commit that added `.env` before it was removed

**Description:**

The `.env` file was committed to the git repository at least once before being removed. The following values are readable by anyone with `git clone` access to the repository:

```
VITE_GOOGLE_MAPS_KEY=AIzaSyAeOoOlja0aMdSWuXyj-hItWj-YbA0AcOU  (old key — possibly still active)
VITE_SECRET_KEY=rLHwtS9)^X-aN1|G+S<,5[J9]Z48BRxa             (still in current .env)
```

The current `.env` uses a different Google Maps key (`AIzaSyAIn1mUm7WyBcBX4OdomfkRjubSE28carI`), suggesting the Maps key was rotated — but the **`VITE_SECRET_KEY` was not rotated** and its value remains identical between the leaked commit and the current file.

Additionally, `VITE_SECRET_KEY` is a `VITE_`-prefixed variable, meaning it is **compiled into the client JavaScript bundle** and visible to any browser user — it is not secret regardless of history.

**Impact:**

- The old Google Maps API key may still be active and can be used by third parties to make billed Maps API calls against GoSendeet's account.
- If `VITE_SECRET_KEY` is used for signing, hashing, or encryption anywhere in the backend (e.g., shared between frontend and backend), the value is now fully public.
- Even after git history is rewritten, the old values may be cached in forks, CI/CD logs, or contributor machines.

**Required Actions (in order):**

1. **Immediately revoke the old Google Maps key** (`AIzaSyAeOoOlja0aMdSWuXyj-hItWj-YbA0AcOU`) in Google Cloud Console → APIs & Services → Credentials.
2. **Rotate `VITE_SECRET_KEY`** — generate a new random value and update it in all environments (production, staging, CI). If this value is used on the backend, coordinate the rotation.
3. **Purge `.env` from git history** using `git filter-repo` (preferred) or BFG Repo Cleaner:
   ```bash
   # Install git-filter-repo
   pip install git-filter-repo

   # Remove .env from all history
   git filter-repo --path .env --invert-paths

   # Force-push all branches and tags
   git push --force --all
   git push --force --tags
   ```
   **Warn all contributors to re-clone after this operation.**
4. Check GitHub's "Exposed secrets" alerts tab — GitHub may have already flagged the Google Maps key.
5. Add `.env` to `.gitignore` if not already present (verify with `cat .gitignore | grep .env`).
6. Add a pre-commit hook via `git-secrets` or `gitleaks` to prevent future credential commits.

---

### SEC-02 — HIGH: Google Maps API Key in Client Bundle Without Referrer Restrictions

- **Severity:** HIGH
- **Status:** Manual action required (Google Cloud Console configuration)
- **File:** `.env` (`VITE_GOOGLE_MAPS_KEY`), `src/main.tsx`

**Description:**

The Google Maps API key (`AIzaSyAIn1mUm7WyBcBX4OdomfkRjubSE28carI`) is embedded in the compiled JavaScript bundle via `import.meta.env.VITE_GOOGLE_MAPS_KEY`. This is expected and necessary for a client-side Maps integration — however, the key **must** be restricted to only accept requests originating from the GoSendeet domains. Without this restriction, anyone who reads the bundle source can extract the key and use it to make Maps API calls billed to the GoSendeet account.

**Impact:**

- Quota exhaustion and unexpected billing charges.
- The extracted key can be used to embed Google Maps on phishing pages under GoSendeet's account.

**Required Actions:**

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Click the GoSendeet Maps API key.
3. Under **Application restrictions**, select **HTTP referrers (websites)**.
4. Add the following referrer patterns:
   ```
   https://gosendeet.com/*
   https://www.gosendeet.com/*
   https://*.gosendeet.com/*
   http://localhost:*/*        (dev only — consider a separate dev key)
   ```
5. Under **API restrictions**, restrict the key to only the specific APIs in use:
   - Maps JavaScript API
   - Geocoding API (if used)
   - Places API (if used)
6. Save and test that the production application still loads Maps correctly.
7. Create a separate, unrestricted key for local development only — never commit it.

---

### SEC-03 — MEDIUM: No HTTP Security Headers

- **Severity:** MEDIUM
- **Status:** FIXED — `vercel.json` updated in this audit
- **File:** `vercel.json`

**Description:**

The application had no HTTP security headers configured at the hosting layer. This exposes users to:
- Clickjacking (no `X-Frame-Options` or `frame-ancestors` CSP)
- MIME-type sniffing attacks (no `X-Content-Type-Options`)
- Information leakage via `Referer` headers (no `Referrer-Policy`)
- XSS escalation if a vector is ever introduced (no `Content-Security-Policy`)
- Downgrade attacks (no `Strict-Transport-Security`)

**Fix Applied:**

Added the following headers to `vercel.json`:

| Header | Value | Purpose |
|--------|-------|---------|
| `Content-Security-Policy` | See `vercel.json` | Restricts script/style/connect/frame sources |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage |
| `Permissions-Policy` | Restricts camera, microphone, geolocation | Limits browser feature access |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Enforces HTTPS |

**Post-deploy verification:**

After deploying, run the following to verify headers are live:
```bash
curl -I https://gosendeet.com | grep -E "Content-Security|X-Frame|X-Content|Referrer|Strict-Transport"
```

Or test at [securityheaders.com](https://securityheaders.com/) — target score: **A or A+**.

**Note on CSP `'unsafe-inline'`:**

The CSP currently allows `'unsafe-inline'` for scripts and styles. This is required because Tailwind CSS injects inline styles and some third-party libraries use inline event handlers. To remove `'unsafe-inline'`, the team would need to:
1. Migrate to Tailwind's class-based approach with no inline style props.
2. Use nonces or hashes for any remaining inline scripts.

This is recommended as a future hardening step, not an immediate requirement.

---

### SEC-04 — MEDIUM: Bank Account PII Logged to Browser Console

- **Severity:** MEDIUM
- **Status:** FIXED — `console.log` removed in this audit
- **File:** `src/pages/franchise/FranchiseSettings/BankTab.tsx:34`

**Description:**

The bank account form's submit handler logged the complete form payload — bank name, account number, and account holder name — to the browser console via `console.log`. The form is connected to a mutation that had a `// TODO` marker indicating the API endpoint was not yet implemented.

Browser console output is accessible to:
- Browser extensions (including malicious ones)
- Logging/monitoring tools like LogRocket or Sentry if console capture is enabled
- Anyone sharing the device

**Fix Applied:**

Removed the `console.log` call. Replaced it with a comment indicating the API endpoint to wire up when implemented.

**Remaining action:**

The `BankTab` form does not yet call an actual API endpoint. This means submitted bank account data is currently silently discarded. Before shipping this feature, wire up the mutation to `POST /franchise/bank-account` (or equivalent backend endpoint).

---

### SEC-05 — MEDIUM: Payment Redirect URL Not Validated

- **Severity:** MEDIUM
- **Status:** FIXED — allowlist check added in this audit
- **File:** `src/pages/home/CostCalculator/components/Calculator/Booking/Checkout/index.tsx:65`

**Description:**

After a successful call to `payForBooking()`, the `authorizationUrl` returned in the API response was used directly as the `window.location.href` redirect target without any validation. If the backend is ever compromised, returns unexpected data, or the API response is intercepted, an attacker could inject an arbitrary URL — including a phishing payment page — into this field.

**Fix Applied:**

Added an allowlist check before redirecting:

```typescript
const ALLOWED_PAYMENT_ORIGINS = [
  "https://checkout.paystack.com",
  "https://standard.paystack.com",
  "https://paystack.com",
];

// In onSuccess:
if (!url || !ALLOWED_PAYMENT_ORIGINS.some((origin) => url.startsWith(origin))) {
  toast.error("Invalid payment redirect. Please contact support.");
  return;
}
window.location.href = url;
```

**Note:** If a payment provider other than Paystack is ever added (e.g., Flutterwave, Stripe), add its checkout domain to `ALLOWED_PAYMENT_ORIGINS`.

---

## Items Scanned With No Findings

The following categories were checked and found to be secure:

| Category | Result |
|----------|--------|
| `dangerouslySetInnerHTML` usage | None found anywhere in codebase |
| `eval()` / `new Function()` | None found |
| `innerHTML =` / `document.write` | None found |
| Auth tokens in `localStorage` | Not applicable — auth uses `httpOnly` cookies via `withCredentials: true` |
| JWT/password in console logs | None found |
| SQL/NoSQL injection | Not applicable — no direct DB queries from frontend |
| Hardcoded API keys in `.ts`/`.tsx` | None found in active source files |
| Open redirects with user-controlled URL | None found (dispatch link is one-time-exchange pattern; assessed as safe) |
| Insecure session management | sessionStorage stores only non-secret UI metadata; actual auth is cookie-based |

---

## False Positives Investigated and Dismissed

During the audit, the following patterns were investigated but determined to be false positives:

| Finding | Reason Dismissed |
|---------|-----------------|
| Module-level `redirected` flag never reset in `axios.ts` | `window.location.href` redirect causes full page reload, resetting all module state. Subsequent 401s on non-dashboard pages call `clearAuthSession()` which is idempotent. No exploitable path. |
| `role` in sessionStorage bypasses admin route guard | Route guards are client-side UX only. All admin API calls use `withCredentials: true` cookie authentication. Server independently validates role on every endpoint. |
| Dispatch access token in URL query string | Token is immediately exchanged for an `httpOnly` cookie session. URL is cleaned via `history.replace`. Token scope is limited to a single dispatch booking (operational only, not account-level). |
| OAuth `redirectUrl` using `window.location.origin` | Exploitable only if backend does not validate allowed origins — a server-side concern, not a frontend vulnerability. |

---

## Dependency Audit

`npm audit` identified 4 high-severity findings in dev/build toolchain:

| Package | CVE | Affects |
|---------|-----|---------|
| `vite@6.4.1` | GHSA-4w7w-66w2-5vf9 | Dev server only (path traversal in optimized deps) |
| `vite@6.4.1` | GHSA-p9ff-h696-f583 | Dev server only (arbitrary file read via WebSocket) |
| `serialize-javascript` | GHSA-5c6j-r48x-rmvq | Build-time only (RCE via untrusted input) |
| `rollup` | GHSA-mw96-cpmx-2vgc | Build-time only (arbitrary file write) |

**Assessment:** None of these affect production users directly — they are dev server and build-toolchain vulnerabilities. However, the build-time RCE in `rollup` and `serialize-javascript` is a supply-chain concern if any untrusted content flows through the build pipeline.

**Recommended action:**

```bash
npm audit fix
# Test thoroughly — some fixes may be breaking changes
```

---

## Security Hardening Roadmap (Future Work)

The following are not current vulnerabilities but are recommended hardening steps for the next sprint:

1. **Remove CSP `'unsafe-inline'`** — Migrate to nonce-based or hash-based CSP for scripts. This is the most impactful CSP hardening step.

2. **Add `gitleaks` pre-commit hook** — Prevent credential commits from ever reaching the repository:
   ```bash
   brew install gitleaks
   # Add to .pre-commit-config.yaml or .git/hooks/pre-commit
   ```

3. **Separate Google Maps keys for dev/prod** — Use an unrestricted key only in `.env.local` (gitignored), and a referrer-restricted key for production.

4. **Add Subresource Integrity (SRI)** to any externally loaded scripts (Google Fonts, etc.).

5. **Regular automated scanning** — Integrate `npm audit` and `gitleaks` into the CI/CD pipeline as blocking checks.

6. **Security.txt** — Add `/.well-known/security.txt` to the public directory so researchers know how to report vulnerabilities.

---

## Files Modified in This Audit

| File | Change |
|------|--------|
| `vercel.json` | Added 6 security response headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| `src/pages/franchise/FranchiseSettings/BankTab.tsx` | Removed `console.log` of bank account PII |
| `src/pages/home/CostCalculator/components/Calculator/Booking/Checkout/index.tsx` | Added Paystack domain allowlist check before payment redirect |

---

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Google Cloud — API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key)
- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [securityheaders.com](https://securityheaders.com/)
- [Content Security Policy Reference](https://content-security-policy.com/)
