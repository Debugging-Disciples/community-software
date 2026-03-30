# Debugging Disciples – Community Hub

A Next.js community engagement hub for the **Debugging Disciples** community.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-based theme configuration)
- **NextAuth.js** (Slack OAuth)
- **ESLint**

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXTAUTH_URL` | Base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session signing |
| `SLACK_CLIENT_ID` | Slack OAuth app client ID |
| `SLACK_CLIENT_SECRET` | Slack OAuth app client secret |

## Features

- 🔐 **Slack OAuth** sign-in
- 📊 **Engagement stats** dashboard (messages, prayer requests, sessions, streaks)
- 🏆 **Badges** with hover tooltips
- 📋 **Activity feed** with categorized entries
- 👤 **Member profile** pages with editable bio
- 🎨 **Dark tech aesthetic** with cyan/purple gradient branding

## Project Structure

```
app/
  page.tsx              # Landing / sign-in page
  dashboard/page.tsx    # Protected dashboard
  profile/[id]/page.tsx # Member profile pages
  api/auth/[...nextauth]/route.ts
components/
  AuthProvider.tsx
  LandingHero.tsx
  Features.tsx
  Navbar.tsx
  DashboardClient.tsx
  StatsGrid.tsx
  BadgesSection.tsx
  ActivityFeed.tsx
  ProfileClient.tsx
lib/
  auth.ts               # NextAuth configuration
```
