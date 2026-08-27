# Angelo Boutique Stays

A hotel reservation platform for a curated collection of boutique properties across the Philippines. Guests can browse hand-picked hotels, check availability, and book stays; administrators manage inventory and monitor reservations from a dedicated dashboard.

Live: **https://bookhotel.angeloproj.com**

---

## Stack

| Layer     | Tech                                                                 |
| --------- | -------------------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS 4         |
| Backend   | Laravel 12, PHP 8.2, Sanctum (SPA auth), SQLite                      |
| Infra     | AWS EC2 (Ubuntu 24.04), Nginx, PHP-FPM, Let's Encrypt SSL, Cloudflare DNS |
| CI/CD     | GitHub Actions — test on every push, auto-deploy on `main`           |

---

## Project structure

```
.
├── backend/                # Laravel API (see backend/README on layout)
│   ├── app/Http/Controllers  # AuthController, BookingController, AdminController, HotelController
│   ├── app/Http/Middleware/EnsureUserIsAdmin.php
│   ├── app/Models           # User, Hotel, Room, Booking
│   ├── database/migrations, factories, seeders
│   └── routes/api.php
├── frontend/               # React SPA
│   ├── src/pages           # HomePage, HotelDetailPage, MyBookingsPage, AdminPage, ...
│   ├── src/components      # BookingModal, HotelCard, ...
│   ├── src/context         # AuthContext (Sanctum token in localStorage)
│   └── src/lib/api.ts      # centralized fetch wrapper (reads VITE_API_URL)
├── .github/workflows/ci.yml  # test + deploy pipeline
└── deploy.sh                 # server-side deploy script (invoked over SSH from CI)
```

---

## Running locally

**Requirements:** PHP 8.2+ with the `sqlite`, `pdo_sqlite`, `mbstring`, `xml`, `curl`, `bcmath`, `zip` extensions · Composer 2 · Node 20 · npm 10

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

The API is now on `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The SPA is on `http://localhost:5173` and talks to the backend URL defined in `.env` (defaults to `http://127.0.0.1:8000`).

### Demo credentials

The database seeder creates a working admin account and eleven fake guests:

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | `admin@hotel.com` | `admin123`  |

---

## Feature overview

### Guest-facing
- Editorial homepage with hero search, autocomplete over hotels and destinations, filterable collection (beachfront / city / heritage / mountain).
- Property detail page — gallery, amenities grid, room list with per-room reserve action, sticky booking sidebar.
- Booking modal with live nights + tax breakdown, availability conflict check (returns HTTP 409 on overlap).
- Booking confirmation page with reference code (`ANG-XXXXXX`), itinerary and printable summary.
- My Trips — upcoming / past / cancelled tabs, cancel-with-confirmation, rebook shortcut.
- Experiences and Contact pages (concierge, offices, FAQ).

### Admin
- Sidebar console at `/admin` — protected by `EnsureUserIsAdmin` middleware.
- Overview with tonal stat cards, recent reservations feed and an SVG occupancy donut.
- Bookings and rooms tables with client-side search, cancelled bookings excluded from revenue and active-room counts.

---

## API (selected endpoints)

All API routes are prefixed `/api` and, unless noted, require a Bearer token issued via `POST /login`.

| Method | Path                              | Description                                |
| ------ | --------------------------------- | ------------------------------------------ |
| POST   | `/register`                       | Create account, returns token              |
| POST   | `/login`                          | Exchange credentials for a Sanctum token   |
| POST   | `/logout`                         | Revoke the current token                   |
| GET    | `/hotels`                         | List hotels (public)                       |
| GET    | `/hotels/{id}`                    | Hotel + rooms (public)                     |
| POST   | `/bookings`                       | Create a booking (409 on overlap)          |
| GET    | `/bookings/mine`                  | Authenticated user's bookings              |
| GET    | `/bookings/{id}`                  | Single booking (owner only)                |
| POST   | `/bookings/{id}/cancel`           | Cancel an upcoming booking                 |
| GET    | `/admin/stats`                    | Aggregate metrics (admin only)             |
| GET    | `/admin/bookings`                 | All bookings with hotel + room (admin)     |
| GET    | `/admin/rooms`                    | All rooms with booking counts (admin)      |

---

## Deployment

The `main` branch is the production branch. Every push runs the CI workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

1. **Frontend job** — installs deps, runs `tsc --noEmit`, and builds with Vite.
2. **Backend job** — installs Composer deps, runs migrations against SQLite, executes `php artisan test`.
3. **Deploy job** — runs only on direct pushes to `main` and only if both jobs pass. It opens an SSH session to the EC2 host and invokes `deploy.sh`, which:
   - pulls the latest commit,
   - clears stale bootstrap caches,
   - installs Composer dependencies with `--no-dev`,
   - runs pending migrations,
   - rebuilds config, route and view caches,
   - runs `npm ci` and `npm run build` in the frontend,
   - fixes ownership back to `www-data`,
   - reloads `php8.2-fpm` and `nginx`.

Nginx serves the built SPA out of `/var/www/bookhotel/frontend/dist` and reverse-proxies `/api` and `/sanctum` to PHP-FPM against `/var/www/bookhotel/backend/public`.

### Required GitHub secrets

| Secret        | Value                                                     |
| ------------- | --------------------------------------------------------- |
| `EC2_HOST`    | Public IPv4 of the EC2 instance                           |
| `EC2_USER`    | `ubuntu`                                                  |
| `EC2_SSH_KEY` | Private key whose public half is in `~/.ssh/authorized_keys` on the server |

---

## Environment variables

**backend/.env**

```
APP_NAME="Angelo Boutique Stays"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://bookhotel.angeloproj.com
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/bookhotel/backend/database/database.sqlite
```

**frontend/.env.production**

```
VITE_API_URL=https://bookhotel.angeloproj.com
```

`VITE_API_URL` is baked into the JS bundle at build time; the frontend has no runtime API configuration.

---

## Notes on data

- Availability is enforced server-side. `POST /bookings` rejects any request whose check-in / check-out range overlaps an existing non-cancelled booking on the same room.
- Booking references (`ANG-XXXXXX`) and initial status (`confirmed`) are set by the model on creation.
- The admin dashboard's revenue and "active today" counts explicitly exclude cancelled bookings.
