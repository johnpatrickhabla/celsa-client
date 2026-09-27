# Celsa Handicrafts — Frontend Scaffold

Next.js (App Router) + TypeScript + Bootstrap frontend for the three portals shown in
the approved mockup: **Admin Dashboard**, **Staff Portal**, **Customer Portal**. This
talks to a separate Express + MongoDB backend (`/server`, not included here) over REST.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your Express backend
npm run dev
```

Visit:
- `/` — Customer portal (public)
- `/admin/dashboard` — Admin (requires an `admin`-role JWT — see RBAC below)
- `/staff/dashboard` — Staff (requires a `staff`-role JWT)
- `/login`, `/signup`

## How RBAC is wired

- **`src/middleware.ts`** gates every `/admin/*` and `/staff/*` request. It reads the
  `celsa_token` cookie, decodes the JWT, and redirects based on role:
  - No token → `/login`
  - `customer` → sent home, can never reach `/admin` or `/staff`
  - `staff` → blocked from all of `/admin` (including `/admin/reports` and `/admin/users`)
  - `admin` → full access
- **`src/lib/nav-config.ts`** defines the sidebar per role. `STAFF_NAV` simply omits
  Reports and Users (Staff Account Management) — per the locked-in decision that Staff
  stays restricted from Reports, matching the SRS rather than the initial mockup draft.
- **This is a UI-layer gate only.** The real security boundary is on the Express side —
  every API route must re-check the role from the JWT via its own middleware, since a
  token can be used to call the API directly without ever loading these pages.

## Structure

```
src/
  app/
    (admin)/admin/...      Admin portal pages (11 modules)
    (staff)/staff/...      Staff portal pages (5 modules — no Reports/Users)
    (customer)/...         Public storefront (Home, Products, Custom Orders, My Orders, About)
    (auth)/login, /signup
  components/
    shared/                DashboardSidebar, DashboardTopbar, StatCard, StatusBadge, PageShell
    customer/               CustomerNavbar, CustomerFooter
  lib/
    auth.ts                JWT decode + role helpers
    api.ts                 Axios client for the Express API
    nav-config.ts           Per-role sidebar/nav definitions
  styles/globals.css        Bootstrap import + brand tokens taken from the mockup
```

## What's stubbed vs. real

- All module pages under `/admin` and `/staff` besides Dashboard use `PageShell` —
  a placeholder that names the module and its intended Express endpoint. Replace each
  with a real table/form once that endpoint exists.
- Dashboard pages (`/admin/dashboard`, `/staff/dashboard`) match the mockup's layout
  with static placeholder data — swap in real fetches (`api.get(...)`) and Recharts
  where charts are marked as placeholders.
- Login/signup call `/api/auth/login` and `/api/auth/signup` on the Express backend —
  build those routes to match (JWT access token in the response body, refresh token as
  an httpOnly cookie).
- Payment methods (Stripe, PayPal, GCash, COD) aren't wired into checkout yet — this
  scaffold only covers the page/route/RBAC layer, not the checkout flow itself.

## Next steps

- Build the checkout flow (`/cart`, `/checkout`) with the guest → login-gate → checkout
  pattern described in the implementation plan.
- Wire product/order/inventory pages to real Express endpoints.
- Add the Express backend scaffold (`/server`) if you'd like it generated too.
