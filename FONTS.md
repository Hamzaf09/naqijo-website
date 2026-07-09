# Fonts — Thmanyah (licensed) provisioning & license compliance

NaqiJo uses the **official licensed Thmanyah** family (Sans + Serif Display + Serif Text).
The license permits commercial use on websites/apps but **prohibits redistribution or
exposing the font files for independent download**. This document explains how the
project honors that — and how to provision the files.

## How it's configured (and why it's the safest practical setup)

> Honest note: any web font is transmitted to the browser to render, so it can never be
> made *cryptographically* undownloadable. "Safest possible" means: no source files, no
> guessable download URL, never in a public repo, and only what's needed on the wire.
> This setup does all of that.

1. **`next/font/local`** (`src/fonts/thmanyah.ts`) self-hosts the fonts. Next.js serves
   them from **hashed, fingerprinted URLs** (`/_next/static/media/<hash>.woff2`) with
   long-lived immutable caching — there is **no clean, predictable path** like
   `/fonts/thmanyah/thmanyahsans-Regular.woff2` for anyone to `curl`.
2. **WOFF2 only.** The desktop **OTF/TTF source files are never placed in the project**
   (they stay in your licensed download). Only the web-optimized WOFF2 subset ships.
3. **Files live in `src/fonts/thmanyah/` — NOT in `public/`.** Anything in `public/` is
   served verbatim at a predictable URL; `src/` assets are only emitted through the
   hashed `next/font` pipeline.
4. **Gitignored** (`.gitignore`): `src/fonts/**/*.{woff,woff2,otf,ttf}` are never
   committed, so they cannot leak through a public repository or git history.
5. **Preloading is scoped** — only the Sans family (used above the fold everywhere) is
   preloaded; Display/Text load on `swap`. Keeps payload and exposure minimal.

## Provisioning the files (required before `build`/`dev`)

Because the WOFF2 are gitignored, a fresh checkout will **not** contain them and the
build will fail with a missing-file error until they are provided. Put the 15 WOFF2
files here:

```
src/fonts/thmanyah/
├── thmanyahsans-Light.woff2   Regular  Medium  Bold  Black
├── thmanyahserifdisplay-Light.woff2   Regular  Medium  Bold  Black
└── thmanyahseriftext-Regular.woff2   Medium   (+ Light/Bold/Black available)
```

Choose one provisioning method:

- **Local dev:** copy your licensed WOFF2 into `src/fonts/thmanyah/` (already done on this
  machine).
- **CI / Vercel (public repo):** store the WOFF2 in a **private** bucket (e.g. Supabase/S3)
  and download them in a `prebuild` step using a secret (`FONTS_URL` / access key). Never
  bake them into a public artifact.
- **CI / Vercel (private repo):** a private repository may commit the WOFF2 if you prefer
  (the license bars *public* repos and independent download, not private version control).
  If you go this route, remove the font lines from `.gitignore` **only** while the repo is
  private, and keep serving via `next/font` (hashed URLs).

## Do / Don't

- ✅ Serve via `next/font/local` (hashed URLs), WOFF2 only, from `src/`.
- ✅ Keep the OTF/TTF sources and the license PDFs outside the repo.
- ❌ Never put font files in `public/`.
- ❌ Never commit font files to a public repository.
- ❌ Never link to a raw font file or offer it for download.
- ❌ Never convert/re-export and redistribute the font.

The full license terms (`LICENSE.pdf` / `ترخيص خط ثمانية.pdf`) ship with your licensed
download — keep them on file and treat their terms as authoritative over this summary.
