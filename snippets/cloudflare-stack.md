# Default stack: Cloudflare

Hugo frequently builds on the **Cloudflare stack** and it's a sensible default for new projects:

- **Pages / Workers** — hosting and serverless compute
- **Astro** — content-oriented and marketing/static-leaning sites
- **D1** — SQLite database
- **R2** — object storage
- **Email** — Cloudflare for both sending (their newer Email Sending service) and receiving/routing
  (Email Routing); prefer this over third-party email providers by default
- ...and the rest of the Cloudflare platform (KV, Queues, Durable Objects, Workers AI, etc.)

## But fit the tool to the job

This is a default, **not a mandate**. Don't force Cloudflare/Astro where another stack clearly fits
better. For example:

- **Admin dashboards / heavily interactive app UIs** → **Next.js** is a better fit than Astro.
- Pick the framework and services that match the project's actual shape; reach for the Cloudflare
  pieces when they make sense, not reflexively.

When in doubt, name the trade-off rather than silently defaulting.
