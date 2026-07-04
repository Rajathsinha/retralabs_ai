# RetraLabs — Premium Shopify Theme (Dawn overlay)

Pixel-accurate implementation of the approved RetraLabs homepage design as a set of
Shopify Online Store 2.0 sections built on the Dawn architecture. Everything is
editable through the Theme Editor — no hardcoded products, all content driven by
Shopify objects (collections, products, linklists, metafields).

## What's included

| Path | Purpose |
|---|---|
| `sections/retra-announcement-bar.liquid` | 40px dark marquee bar, rotating messages (blocks) |
| `sections/retra-header.liquid` | Sticky header — transparent at top, white on scroll, dropdown + mega menu, AJAX cart badge |
| `sections/retra-hero.liquid` | 50/50 split hero — badge, accent heading, dual CTAs, LCP-optimized image |
| `sections/retra-trust-strip.liquid` | 4-column trust strip with thin dividers |
| `sections/retra-cod-banner.liquid` | Light-green COD banner, icon left, pill right |
| `sections/retra-best-sellers.liquid` | Collection-driven product carousel (4-up, scroll-snap, arrow) |
| `sections/retra-assurance-strip.liquid` | 4-column icon assurance strip |
| `sections/retra-footer.liquid` | Dark footer — brand column + up to 3 menu columns |
| `snippets/retra-product-card.liquid` | Product card: image scale 1.03 hover, review stars from metafields, AJAX add-to-cart |
| `snippets/retra-icon.liquid` | Inline SVG icon set |
| `assets/retra-theme.css` | Design tokens + all component styles |
| `assets/retra-theme.js` | Header state, reveals, carousel, AJAX cart (~2.5 KB, deferred) |
| `templates/index.json` | Homepage template wiring the sections in order |
| `sections/header-group.json` / `footer-group.json` | Header/footer section groups |

## Install

1. Start from a copy of [Dawn](https://github.com/Shopify/dawn) (any recent version).
2. Copy this directory's `sections/`, `snippets/`, `assets/`, and `templates/`
   files into the theme, overwriting `templates/index.json`,
   `sections/header-group.json`, and `sections/footer-group.json`.
3. Push with the Shopify CLI:
   ```sh
   shopify theme push --store your-store.myshopify.com
   ```
4. In the Theme Editor:
   - **Best sellers** → pick your Best Sellers collection.
   - **Hero** → upload studio product photography (≥1100×1200) and set button links.
   - **Header** → assign your main menu (nest links for dropdowns; nest two levels for a mega menu).
   - **Footer** → assign one menu per column.
5. Typography: set Dawn's body font to **Inter** (Settings → Typography). The CSS
   falls back to Dawn's `--font-body-family`, then the system stack.

## Review stars

Cards read the standard Shopify product-review metafields
(`reviews.rating`, `reviews.rating_count`) — populated automatically by most
review apps (Judge.me, Loox, Shopify Product Reviews). Cards hide the star row
when a product has no reviews.

## Design system

- Background `#FFFFFF` · Primary `#111111` · Accent `#2563EB` · Success `#16A34A`
- Gray `#F5F7FA` · Border `#E5E7EB`
- Radius: 16px base / 14px buttons / 18px cards · very soft shadows
- Type: Inter — hero 64/800, product titles 24/700, body 18, buttons 16
- Animations: transform/opacity only (60fps), `prefers-reduced-motion` respected
- Performance: single deferred JS file, lazy images with `srcset`/`sizes`,
  explicit width/height (CLS-safe), hero image `fetchpriority="high"`
