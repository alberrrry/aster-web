# Aster

A minimal, full-stack e-commerce app with category browsing, product variants, a persistent cart, and Stripe checkout.

## Features

- Category navigation with hover dropdowns and a product grid
- Product pages with variant selection (e.g. size, color)
- Debounced search with live results dropdown
- Database-persisted cart in a slide-out drawer
- Two-step checkout (shipping, then payment) with Stripe
- Order confirmation and order history
- Token-based auth with Laravel Sanctum

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Axios |
| Backend | Laravel 11, Sanctum, Filament v3 admin |
| Database | PostgreSQL |
| Payments | Stripe |

## Architecture

```
React SPA (aster-web)  ──REST + Sanctum token──▶  Laravel API (aster-api)  ──▶  PostgreSQL
                                                          └──▶ Stripe
```

Auth state lives in a React `AuthContext`. The cart and orders are stored server-side, so they persist across sessions and devices.

## Getting Started

**Prerequisites:** Node.js [version] and a running instance of [aster-api](https://github.com/[username]/aster-api).

```bash
git clone https://github.com/[username]/aster-web.git
cd aster-web
npm install
cp .env.example .env   # set the API URL and Stripe publishable key
npm run dev
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of aster-api (e.g. `http://localhost:8000/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable (test) key |

