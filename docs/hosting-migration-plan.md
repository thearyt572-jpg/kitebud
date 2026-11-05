# KITEBud hosting: Netlify → cPanel (HostAsean) — investigation and plan

> **Decision (owner, 2026-11-05): do not move the host. KITEBud stays on Netlify.** This file is kept for reference only; nothing below is to be carried out.

Prepared 2026-11-04 (redesign Phase 9). **Investigation only: nothing has been uploaded, no DNS record changed, Netlify untouched.**
Everything below about the server was found from outside (public DNS, the server's HTTPS certificate, HostAsean's public pages). Items marked **[CONFIRM]** must be checked in the HostAsean client area or cPanel.

## 1. Findings

### Hosting provider and plan
| Item | Finding | How we know |
|---|---|---|
| Provider | **HostAsean** (Cambodia) | the domain's nameservers are `ns1/ns2/ns3.hostasean.com` |
| Plan | "Pro" (owner). HostAsean's public listing for **Pro Hosting**: US$15/month, 6 GB disk, 100 GB transfer, 10 email accounts, 2 MySQL databases, free automatic SSL. **[CONFIRM]** the exact plan name and limits in the client area. | HostAsean pages (sources at the end) |
| Server | `128.199.243.161`, Apache | DNS A record; the server's reply header |
| cPanel | **Yes** | the server's certificate lists `cpanel.`, `webmail.`, `webdisk.`, `cpcontacts.`, `cpcalendars.thekitebud.com`: names cPanel creates itself |
| Web hosting | Yes (Apache answers for thekitebud.com) | HTTP reply |
| SSL | Free automatic SSL (AutoSSL) is advertised, **but today the site has a self-signed certificate** (issuer = thekitebud.com itself, valid 2026-10-15 → 2027-10-15). Browsers show a security warning until AutoSSL issues a trusted one. | certificate check |
| File Manager / FTP | Standard in cPanel. **[CONFIRM]** FTP account details in cPanel → FTP Accounts. | cPanel standard |
| PHP | Available on cPanel hosting, **not needed** by KITEBud | — |
| MySQL | 2 databases on Pro, **not needed** (KITEBud uses Supabase) | — |
| Email | `weare@thekitebud.com` runs on this same server (MX → thekitebud.com; SPF allows 128.199.243.161 and SendGrid) | DNS |

### Is the domain connected to the hosting account?
**Yes, already.** `thekitebud.com` → A `128.199.243.161`, `www` → CNAME `thekitebud.com`, DNS run by HostAsean. The website itself currently answers **403 Forbidden** (nothing published in `public_html` yet). So **the domain is not connected to Netlify**; the Netlify site runs on its own Netlify address **[CONFIRM the Netlify URL]**.

### The KITEBud project
| Question | Answer |
|---|---|
| Static after the build? | **Yes.** `node tools/build-public.js` makes `public/`: 35 plain files (8 HTML pages, css, js, fonts, images, favicon). |
| Node.js on the server? | **No.** Node is only used on your computer to run the build and the tests. |
| External backend? | **Supabase** (database, insert-only, called from the visitor's browser). The Supabase library loads from **jsDelivr** after "Allow". Fonts are self-hosted. |
| Server-side environment variables? | **None.** The only settings are in `js/config.js` (showcase mode, Supabase URL and the *publishable* key, which is meant to be public; Row Level Security only allows inserts). No secrets are in the site. |
| Netlify-only features? | **None used:** no `_redirects`, `_headers`, functions, forms or environment variables. `netlify.toml` only sets the build command and the `public` folder. |

### How the Netlify deployment works today
1. Code is pushed to GitHub (`thearyt572-jpg/kitebud`, branch `main`).
2. Netlify sees the push, runs `node tools/build-public.js` on its own servers, and publishes only `public/`.
3. Netlify provides HTTPS, the HTTP→HTTPS redirect, a global CDN and its own logs automatically.

## 2. Netlify vs. cPanel (HostAsean)

| | Netlify (now) | cPanel / HostAsean |
|---|---|---|
| Deploy | automatic on every push to `main` | **manual**: build on your computer, upload `public/` contents |
| Build | Netlify runs Node | you run Node locally |
| Domain | not connected (Netlify address only) | **already connected** to thekitebud.com |
| HTTPS | automatic | AutoSSL, **must be run/fixed first** (self-signed today) |
| HTTP → HTTPS | automatic | one switch in cPanel ("Force HTTPS Redirect") |
| Speed | global CDN | one server (the IP is in a Singapore data-centre range: close to Cambodia) |
| Email | — | already hosts weare@thekitebud.com |
| Rollback | one click to an earlier deploy | restore a backup zip by hand |
| Cost | free tier | already paid (Pro, one year) |

**Conclusion:** KITEBud can be hosted on cPanel without code changes, because it is a static site with a browser-side database.
The trade-off is losing automatic deploys and one-click rollback.

*Alternative, not recommended here:* keep Netlify as the host and point thekitebud.com to Netlify. That would need DNS changes in HostAsean's zone, and email must stay on HostAsean.

## 3. Risks

| Area | Risk | Mitigation |
|---|---|---|
| HTTPS | Self-signed certificate: visitors see "Not secure / Your connection is not private". | Run AutoSSL **before** uploading or announcing; check the issuer is Let's Encrypt or Sectigo. If it fails, ask HostAsean support. |
| HTTPS | The site stays reachable on plain `http://`. The visitor-ID cookie only gets `Secure` on https. | Turn on "Force HTTPS Redirect" in cPanel → Domains (after AutoSSL works). |
| DNS | Changing records could break **email** (same server). | **No DNS change is needed** for this plan. Don't touch MX/SPF. |
| DNS | Two live copies (Netlify address + thekitebud.com) could drift apart. | Decide which one is official. Keep Netlify unchanged as the fallback until cPanel is verified. |
| Environment variables | None to move. A future secret key must never go in `js/config.js`. | Unchanged rule: only the publishable key in the site. |
| Database | Supabase is unchanged and accepts requests from any site address (no origin list to update). Tests on the live domain with "Allow" write **real rows**. | Test with "Decline" first. If you test "Allow", note the visitor ID shown on the results page and delete those rows in Supabase afterwards. |
| Private files | A manual upload could include `docs/` (question design, university sheet), `tools/`, `archive/` or `.git`. | Upload **only the contents of `public/`**; the build script already refuses to put private files there. After upload, check `https://thekitebud.com/docs/` returns 404. |
| Caching | Without filename versioning, browsers may keep old CSS/JS after an update. | Optional `.htaccess` with short cache times (a new file: needs your approval). Otherwise ask users to refresh after updates. |
| Directory listing | Apache may list a folder's files if it has no index page. | Optional `.htaccess` line `Options -Indexes` (needs approval). |
| Privacy notice | It says "our website host: up to 30 days" (log retention). That was written for Netlify; HostAsean's log retention may differ. | **[CONFIRM]** HostAsean's access-log retention. If different, the approved notice needs a wording update (and a Khmer review). |
| Process | `tools/build-public.js` and project notes say "deploy ONLY through Netlify". | Update that comment once the move is approved. |
| Credentials | cPanel and FTP passwords. | Never put them in the repo, chat or docs. Use FTPS/SFTP or cPanel File Manager. |

## 4. Migration plan (only after approval)

### Required files
The **contents** of `public/` after a build of the approved `main` branch: `index.html, assessment.html, results.html, report.html, checkout.html, faq.html, privacy.html, about.html, favicon.svg, css/, js/, fonts/, images/` (35 files).
Optional, only if approved: `.htaccess` (cache times, `Options -Indexes`).

### Build
1. `git checkout main` and `git pull` (only approved, merged work goes live).
2. `node tools/build-public.js`. It must print `public/ ready: 35 files … showcase mode ON`.
3. `node tools/test-scoring.js` (37/37) and `node tools/check-questions.js` (286/286).
4. Zip the **contents** of `public/` (not the folder itself) as `kitebud-public-YYYY-MM-DD.zip`.

### SSL (first)
1. cPanel → **SSL/TLS Status** → select thekitebud.com and www → **Run AutoSSL**.
2. Wait about 15 minutes, then reopen `https://thekitebud.com`. The padlock must show a trusted issuer (not "thekitebud.com").
3. cPanel → **Domains** → turn on **Force HTTPS Redirect** for thekitebud.com.

### Upload
1. cPanel → **File Manager** → `public_html`. Select everything there → **Compress** → download the zip as a backup (today it is probably empty or default files).
2. Upload `kitebud-public-YYYY-MM-DD.zip` into `public_html` → **Extract** → delete the zip from the server.
3. Check that `public_html/index.html` sits directly in `public_html` (not in `public_html/public/`). Permissions: files 644, folders 755.

### DNS
**No changes.** The domain already points to this server. Optional check in cPanel → **Zone Editor**: the A record matches the shared IP shown on the cPanel home page.

### Testing (on the live domain)
1. `https://thekitebud.com` and `https://www.thekitebud.com` load with a padlock; `http://` redirects to `https://`.
2. All 8 pages open, in Khmer and English, on a phone and on a desktop. The header stays on top while scrolling, and the favicon shows.
3. Cookie banner → **Decline** → take the whole test → results → report. Share and Retake work. Checkout says payment is coming soon.
4. "See an example" shows the sample.
5. Browser console (desktop, F12): no errors, no "mixed content" warnings.
6. `https://thekitebud.com/docs/`, `/tools/` and `/archive/` → 404 (not published).
7. Optional, with "Allow" on one test device: Supabase gets visitor + consent + 7 parts + results. Note the visitor ID and delete these test rows afterwards.
8. Email: send to and from weare@thekitebud.com once (it should be unaffected).

### Rollback
- Netlify stays untouched during the move, and its address keeps working the whole time.
- If the cPanel site has a problem: in File Manager, delete the uploaded files and restore the backup zip (step Upload 1). The domain then shows what it showed before.
- No DNS rollback is needed, because no DNS record changes.
- To roll back a later update: keep each dated `kitebud-public-*.zip`. Re-extracting the previous one restores that version.

## 5. Questions for the owner
1. The exact plan name and limits in the HostAsean client area (is it "Pro Hosting"?).
2. The Netlify site address, and whether a custom domain is set in Netlify.
3. Which address should be official after the move: thekitebud.com only, or keep the Netlify address too?
4. Do you approve an optional `.htaccess` (cache times and no directory listing)?
5. HostAsean's access-log retention, for the privacy notice.

## Sources
- [HostAsean: No need to buy SSL certificates – they're free!](https://www.hostasean.com/?p=3198)
- [HostAsean: Automatic free SSL certificates](https://www.hostasean.com/automatic-free-ssl-certificates/amp)
- [HostAsean: Free upgrades to existing web hosting packages](https://hostasean.com/free-upgrades-to-existing-web-hosting-packages/amp)
- [HostAsean: E-Commerce Website Hosting](https://www.hostasean.com/?p=2205)
