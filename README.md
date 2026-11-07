# Violett Store Manager

<!-- mesbah-lab-credit -->
> **A Mesbah Lab freebie.** Designed and coded by us at [Mesbah Lab](https://mesbahlab.net).
>
> **More freebies:** [mesbahlab.net](https://mesbahlab.net)
>
> **Follow us:** [Instagram](https://www.instagram.com/themesbahlab/) · [X](https://x.com/mesbahlab) · [Facebook](https://www.facebook.com/profile.php?id=1421874334341579) · [Pinterest](https://www.pinterest.com/mesbahlab/) · [YouTube](https://www.youtube.com/channel/UCyPo3LFW1Xv8DkcEnRdB7Ug) · [Behance](https://www.behance.net/mesbahismail) · [GitHub](https://github.com/mesbahismail)
>
> **Enjoying this freebie?** [Support us with a donation on PayPal](https://paypal.me/mesbahlab). Your tip keeps designs free for everyone.
<!-- /mesbah-lab-credit -->

A responsive store manager with a charcoal theme, Inter typography, and violet accents. The workspace includes store activity, searchable orders and full-height detail panels, a 12-product photo catalog with grid/list views and pagination, wallet performance and payouts, analytics, customer support tickets, a year/month/week/day calendar, and a searchable help center. Support, settings, and help use a shared content-first layout with navigation on the left. Wallet and analytics share a 60/40 widget-height split. The header Add menu opens product, event, ticket, and dashboard-widget creation. Activity opens in an anchored popover. Support includes solve/reopen, archive/restore, edit, and delete with undo. Interface icons are from [Lucide](https://lucide.dev/).

The app currently uses sample data. New products, order status changes, support replies, and calendar events are kept for the current session; payments, email delivery, and a backend are not connected.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). Development output uses `.next-dev` so production builds do not interrupt the running preview.

## Validation

```bash
npm test
npm run lint
npm run build
```

Tests cover order search/status/sort behavior, calendar boundaries, and rendered store screens.

## Use as a shadcn registry template

The root [registry.json](./registry.json) registers `violett-saas-dashboard` as a `registry:template`. The item includes its page and stylesheet and declares `lucide-react` as a dependency.

To generate registry item files with the shadcn CLI, run:

```bash
npx shadcn@latest build
```

Publish the generated registry output alongside the app, then install the item with:

```bash
npx shadcn@latest add https://your-domain.example/r/violett-saas-dashboard.json
```

## Product photography

Twelve photos are bundled under `public/products/`; source URLs are recorded in `public/products/sources.json`. They are demonstration catalog imagery sourced from DummyJSON, Unsplash (TuanAnh Blue), and Gabucci. The registry template’s source files reference these assets; copy `public/products/` alongside the template when installing it.
