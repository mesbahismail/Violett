# Violett Store Manager

A responsive store manager with a charcoal theme, Inter typography, and violet accents. The workspace includes store activity, searchable orders and full-height detail panels, products with grid/list views, wallet performance and payouts, analytics, customer support tickets, and a month/week/day calendar. Interface icons are from [Lucide](https://lucide.dev/).

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
