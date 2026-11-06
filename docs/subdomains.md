# Subdomain front: one app, one subdomain

The site is the front door: a page of tiles. Each app is a separate deploy on Google Cloud Run (copied from
`paid-app-starter`), and its tile points at `https://<name>.jameskidd.info`, never at the `*.run.app` URL. The
shell holds only the pointer, so what is public is decided one tile at a time, and an app can move without the
link on LinkedIn changing.

```
LinkedIn -> jameskidd.info (Vercel, this repo) -> tile -> <name>.jameskidd.info (Cloudflare DNS) -> Cloud Run
```

Where things are today: nameservers are Cloudflare, the apex serves from Vercel
(`System/Accounts/Environments/jameskidd.info.md` in the vault). Nothing below touches the apex record.

## Add an app (James's steps; an agent cannot do the account parts)

1. **Deploy the app** to Cloud Run (its own `docs/RUNBOOK.md`, the Cloud Run step). Check `curl <run.app url>/health`.
2. **Map the domain**: Cloud Run > Manage custom domains > Add mapping > service, domain `<name>.jameskidd.info`.
   Google shows the record to create (a CNAME to `ghs.googlehosted.com`).
3. **Add the record in Cloudflare** (DNS > jameskidd.info): type CNAME, name `<name>`, target as Google shows,
   **proxy off (grey cloud)** until the certificate issues, which takes up to an hour. Do not touch the apex or `www`.
4. **Point the app at itself**: set the app's public-URL variable (`PAIDAPP_PUBLIC_URL` in the starter) to
   `https://<name>.jameskidd.info`, and any Stripe webhook URL to the same host.
5. **Confirm it answers**: `curl -I https://<name>.jameskidd.info` returns 200 with a valid certificate.
6. **Add the tile** in `src/data/hero.js` `links`:

   ```js
   { id: "bynumber", label: "Paint by number", note: "Turn a photo into a kit",
     href: appUrl("bynumber"), icon: "app", external: true },
   ```

   Then `npm run copy-deck`, and stamp: `npm run approve -- src/data/hero.js`. Step 6 comes last on purpose: a tile
   for a subdomain that does not answer yet is a dead link on the front page.

## Rules

- One subdomain per app, named for the app. No wildcard record, so an unmapped name does not resolve.
- The shell never links to `*.run.app`.
- A page that should not be public yet gets no tile. There is no "coming soon" tile; it would announce the page.
- Each app is its own deploy with its own gate (paykit paywall or Cloud Run auth); the shell does not protect it.
- Each app sets `X-Robots-Tag: noindex` unless it should be found by search; the shell sitemap lists only `/`.

## Rolling back

Delete the tile (one entry, then stamp). The subdomain keeps answering until its Cloudflare record is removed.
