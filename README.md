

## Deployment

Vercel, from `main`. Vite builds to `dist/`; `vercel.json` carries the SPA
rewrite, the immutable cache headers for hashed assets, and the security
headers.

### The rewrite excludes `assets/` and `fonts/` on purpose

`vercel.json` is strict JSON and cannot hold a comment, so the reasoning lives
here.

The SPA rewrite used to be `/((?!api/).*)` — everything that is not the API
falls through to `index.html`. That is the standard recipe and it has a nasty
failure mode on a hashed-asset build:

1. A browser holds a stale `index.html` (an open tab from before a deploy, or
   a disk-cache hit) that references `/assets/index-OLDHASH.css`.
2. That file no longer exists, so the rewrite catches the request and serves
   `index.html` — status **200**, content type **text/html**.
3. `X-Content-Type-Options: nosniff` is set, so the browser refuses to parse
   HTML as a stylesheet and drops it.
4. The page renders completely unstyled, and there is **no 404 in the network
   tab** to explain it. Every request looks successful.

The pattern is now `/((?!api/|assets/|fonts/)[^.]*)`, which rewrites only
dot-free paths. Real routes (`/`, `/about`, `/services`) still reach the SPA;
anything that looks like a file returns an honest 404, so a stale reference
fails loudly and a reload fixes it.

If you change this pattern, re-check it against `/`, `/about`, `/assets/x.css`,
`/fonts/x.woff2`, `/robots.txt` and `/api/send-enquiry` before shipping.
