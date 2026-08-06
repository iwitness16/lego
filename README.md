# LegoBricksLink

A Next.js 14 (App Router) storefront front end for browsing LEGO® sets and
minifigures by **theme → subtheme → product**, built with Tailwind CSS.

This is a **front-end only** project — there is no backend, payment
processing, or persistent order storage. The cart is kept in
`localStorage` on the visitor's device.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Required images (add these to `/public` yourself)

The project references the following files by name. Nothing will break if
they're missing (Next just shows a broken image), but add them for the
site to look right:

| File(s) | Used for |
|---|---|
| `logo.jpg` | Header + footer brand mark |
| `hero1.jpg` … `hero8.jpg` | Homepage hero slider (8 slides) |
| `sets.jpg` | "Browse → Sets" category card |
| `minifigures.jpg` | "Browse → Minifigures" category card |
| `rev1.jpg` … `rev10.jpg` | Reviewer avatars in the testimonial slider |

Everything else (all set product photography) is loaded live from
`images.brickset.com`, matching the source CSV. Minifigure product photos
use `placehold.co` placeholders since the source CSV only covered sets —
swap `lib/data.js` → `MINIFIGURES[].image` for real photography whenever
you have it.

## Data

All catalog data lives in `lib/data.js`:

- **Sets** — five themes (Icons, City, Friends, Creator, Seasonal), two
  subthemes each, three sets per subtheme — pulled directly from the
  Brickset 2025 sets export you provided (piece counts, RRP, designer,
  packaging, availability, and image URLs are all real).
- **Minifigures** — five themes (City, Star Wars, Marvel, Ninjago, Harry
  Potter), two subthemes each, three figures per subtheme — curated to
  match the same structure, since the source CSV didn't include
  minifigure rows.

`getThemes`, `getSubthemes`, `getProducts`, and `getProductById` are the
functions every page calls — swap this file for a real API/database layer
later without touching any component.

## Routes

```
/                                   Home (hero, browse, featured, reviews)
/sets                               All set themes
/sets/[theme]                       Subthemes within a theme
/sets/[theme]/[subtheme]            Paginated product listing (10/page)
/minifigures                        All minifigure themes
/minifigures/[theme]                Subthemes within a theme
/minifigures/[theme]/[subtheme]     Paginated product listing (10/page)
/cart                               Cart with quantity controls & subtotal
```

"Add to cart" adds the item and redirects straight to `/cart`, where a
"Continue shopping" button sends the visitor back to keep browsing.

## Stack

- Next.js 14 (App Router, Server Components by default)
- Tailwind CSS (custom design tokens in `tailwind.config.js`)
- `next/font/google`: Fredoka (display), Inter (body), IBM Plex Mono (data/specs)
- No external UI kit — all components are hand-built in `/components`
