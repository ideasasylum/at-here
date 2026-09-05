# at-here

A contact card for AT Protocol accounts. Give it a handle or DID and it lists every
app the account can be found on, with a downloadable vCard.

**Live at [at-here.ideasasylum.com](https://at-here.ideasasylum.com)** — try
[at-here.ideasasylum.com/jamie.ideasasylum.com](https://at-here.ideasasylum.com/jamie.ideasasylum.com).

[![The at-here card for jamie.ideasasylum.com: a neon sign of the handle over a dark wall, with a glowing cyan tube above the first app, Bluesky](docs/screenshot.png)](https://at-here.ideasasylum.com/jamie.ideasasylum.com)

    https://at-here.ideasasylum.com/jamie.ideasasylum.com        HTML card
    https://at-here.ideasasylum.com/jamie.ideasasylum.com.vcf    vCard 4.0
    https://at-here.ideasasylum.com/jamie.ideasasylum.com.json   JSON

## How it works

1. Resolve the handle to a DID (Bluesky AppView, then DNS TXT, then `.well-known/atproto-did`).
2. Fetch the DID document from `plc.directory` (or `.well-known/did.json` for `did:web`) to find the PDS.
3. Call `com.atproto.repo.describeRepo` on the PDS to list every record collection the account has written.
4. Map collection NSIDs to apps using the registry in `src/apps.ts`. Unrecognised collections are grouped
   by their reversed NSID authority so they still show up.
5. Fetch a few profile records (Bluesky, Sifa, Tangled) to fill in name, avatar and bio.

Responses are cached at the edge for five minutes. Append `?refresh` to bypass the cache.

## Development

    npm install
    npm run dev          # wrangler dev on http://localhost:8787
    npm test
    npm run typecheck
    npm run deploy

The Worker is configured with a custom domain route for `at-here.ideasasylum.com` in `wrangler.jsonc`.
The zone must already be on the Cloudflare account that deploys it.

## Adding an app

Add an entry to `APPS` in `src/apps.ts` with the NSID prefixes the app writes, a homepage, and a
`profileUrl` template if the app has public profile pages. The longest matching prefix wins, which is how
Bluesky feed generators and labelers get their own entries.
