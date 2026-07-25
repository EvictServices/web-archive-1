# Evict — Web

The marketing site for **Evict**, an all-in-one Discord server management bot.

Built with [Next.js 16](https://nextjs.org), React 19, Tailwind CSS 4, and Framer Motion.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, features, testimonials) |
| `/commands` | Command reference |
| `/status` | Real-time cluster & shard health dashboard |
| `/updates` | Changelog / update notes |
| `/embed` | Embed builder |
| `/avatars/[id]` | Avatar viewer |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/health` | Proxies the bot health endpoint |

Command, user, and guild lookups run as server actions (`lib/actions/`) and are not exposed as public endpoints.

## Project Structure

| Folder | Contents |
|--------|----------|
| `app/` | Routes, layouts, and the health API route |
| `components/` | React components, grouped by page/feature (`sections`, `status`, `commands`, `embeds`, `updates`, `tickets`, `avatars`, `legal`, `ui`) |
| `lib/` | Shared code grouped by domain: `actions/` (server actions), `commands/`, `status/`, `updates/`, `tickets/`, `avatars/`, plus `constants.ts`, `pageLayout.ts`, and `showcaseUsers.ts` |
| `hooks/` | Client-side React hooks |
| `types/` | Shared TypeScript types |

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Production

```bash
npm run build
npm run start
```

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **UI** — React 19, Tailwind CSS 4, Framer Motion
- **Utilities** — clsx, tailwind-merge, lucide-react, react-icons
- **Virtualization** — @tanstack/react-virtual
