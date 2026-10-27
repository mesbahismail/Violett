# Violett SaaS Dashboard

A free, responsive SaaS dashboard template with a dark violet-and-rose theme. The workspace includes KPI cards, a revenue chart, recent activity, searchable orders, product performance, calendar events, notifications, and responsive navigation. Interface icons are from [Lucide](https://lucide.dev/).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). Development output uses `.next-dev` so production builds do not interrupt the running preview.

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
