# LuxeStay — Frontend

React + Vite frontend for the LuxeStay Hotel Management System. Provides a guest-facing booking portal and a full admin panel, both backed by a Spring Boot REST API.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Dev server & bundler |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Zustand | 5 | Global auth state |
| React Hot Toast | 2.x | Toast notifications |
| Lucide React | 1.x | Icon library |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080` (see `/backend`)

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173**. All `/api/*` requests are proxied to `http://localhost:8080` via `vite.config.js`.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

---

## Project Structure

```
frontend/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── assets/              # Images (hero.png, etc.)
│   ├── components/          # Shared reusable components
│   │   ├── AdminLayout.jsx  # Admin sidebar + outlet wrapper
│   │   ├── BookingForm.jsx  # Date picker + booking submission
│   │   ├── InvoiceCard.jsx  # Bill display with live service total
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── RoomCard.jsx     # Room listing card
│   │   └── ServiceRequest.jsx  # Facility add-on request UI
│   ├── pages/
│   │   ├── admin/           # Admin-only pages (protected)
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminRooms.jsx
│   │   │   ├── AdminBookings.jsx
│   │   │   ├── AdminServices.jsx
│   │   │   └── AdminBilling.jsx
│   │   ├── Home.jsx         # Public landing page
│   │   ├── Login.jsx        # Login form
│   │   ├── Signup.jsx       # Registration form
│   │   ├── Rooms.jsx        # Available rooms listing
│   │   ├── RoomDetail.jsx   # Single room view + booking form
│   │   └── MyBookings.jsx   # Guest booking history + billing
│   ├── routes/
│   │   └── ProtectedRoute.jsx  # Auth + role guard
│   ├── services/
│   │   ├── api.js           # Axios instance with interceptors
│   │   └── index.js         # All service modules (auth, room, booking, etc.)
│   ├── store/
│   │   └── authStore.js     # Zustand auth store (persisted)
│   ├── App.jsx              # Route definitions
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles + keyframe animations
├── vite.config.js           # Vite config with API proxy
└── package.json
```

---

## Routing

All routes are defined in `App.jsx`.

| Path | Access | Component |
|---|---|---|
| `/` | Public | `Home` |
| `/login` | Public | `Login` |
| `/signup` | Public | `Signup` |
| `/rooms` | Authenticated | `Rooms` |
| `/rooms/:id` | Authenticated | `RoomDetail` |
| `/my-bookings` | GUEST only | `MyBookings` |
| `/admin/dashboard` | ADMIN only | `AdminDashboard` |
| `/admin/rooms` | ADMIN only | `AdminRooms` |
| `/admin/bookings` | ADMIN only | `AdminBookings` |
| `/admin/services` | ADMIN only | `AdminServices` |
| `/admin/billing` | ADMIN only | `AdminBilling` |

### Route Protection — `ProtectedRoute.jsx`

Wraps any route that requires authentication or a specific role.

- If no user is in the store → redirects to `/login`
- If a `role` prop is provided and the user's role doesn't match → redirects to `/`

```jsx
<ProtectedRoute role="ADMIN">
  <AdminDashboard />
</ProtectedRoute>
```

---

## Pages

### Guest Pages

#### `Home.jsx`
Public landing page with six animated sections:
- **Hero** — gradient background, shimmer headline, live pulse badge, floating hotel icon, CTA buttons
- **Stats Strip** — 4 counters (guests, rooms, amenities, rating)
- **Features** — 6 feature cards with colored icons and hover lift effect
- **Room Types** — Standard / Deluxe / Suite showcase cards with pricing
- **Testimonials** — 3 guest review cards with star ratings
- **CTA Banner** — full-width gradient call-to-action
- **Footer** — minimal dark footer

#### `Rooms.jsx`
Lists all available rooms fetched from `GET /api/rooms/available`. Supports:
- Text search by room number
- Filter buttons by type: ALL / STANDARD / DELUXE / SUITE

#### `RoomDetail.jsx`
Shows full details for a single room (type, price, status, star rating) alongside the `BookingForm` component.

#### `MyBookings.jsx`
Shows all bookings for the logged-in guest. Each booking card is expandable and shows:
- `ServiceRequest` — request facility add-ons (only for CONFIRMED bookings)
- `InvoiceCard` — view bill breakdown, live total, and pay button
- Generate Bill button if no bill exists yet

#### `Login.jsx` / `Signup.jsx`
Standard auth forms with email + password. On success, user data is saved to the Zustand store and the user is redirected based on their role.

---

### Admin Pages

All admin pages are nested inside `AdminLayout` which renders a fixed dark sidebar with navigation links.

#### `AdminDashboard.jsx`
Rich overview dashboard that pulls data from multiple APIs simultaneously:

**Stat Cards (6)**
- Total Bookings, Revenue Collected, Pending Payments, Active Guests, Available Rooms, Facility Services

**Breakdown Panels (3)**
- Room Occupancy — visual progress bar (Booked vs Available %)
- Booking Breakdown — bar chart of Confirmed / Completed / Cancelled
- Billing Summary — Paid vs Pending bars + dollar totals

**Detail Panels (2)**
- Recent Bookings — last 5 bookings with guest, room, dates, status badge
- Available Facility Services — full service catalog with prices

#### `AdminRooms.jsx`
Full CRUD for hotel rooms. Supports create, edit, and delete via a modal form. Displays room number, type, price per night, and availability status.

#### `AdminBookings.jsx`
Read-only table of all bookings across all guests. Shows booking ID, guest name, room, check-in/out dates, and status badge.

#### `AdminServices.jsx`
Manage facility services (e.g. Gym, Laundry, Spa). Supports create and delete. Services created here appear in the guest's `ServiceRequest` component.

#### `AdminBilling.jsx`
Accordion-style billing view. Each row represents a booking that has a generated bill. Clicking a row expands to show:
- Guest name, room number, stay dates and night count
- Itemised room charges
- All facility add-ons requested with individual prices
- Live total (room charges + services)
- Invoice ID and "Mark as Paid" button

---

## Components

### `Navbar.jsx`
Sticky top navigation bar. Renders differently based on auth state:
- **Logged out** — Login + Sign Up links
- **Guest** — Rooms, My Bookings, user badge, Logout
- **Admin** — Dashboard link, user badge, Logout

### `AdminLayout.jsx`
Fixed dark sidebar (`w-64`, `bg-slate-900`) with `NavLink` items for all admin routes. Uses React Router's `<Outlet />` to render the active admin page in the main content area.

### `BookingForm.jsx`
Date range picker (check-in / check-out) with live night count and total price preview. Submits to `POST /api/bookings`.

### `InvoiceCard.jsx`
Displays a bill for a booking. Accepts a `refreshKey` prop — when it changes, services are re-fetched and the total is recomputed live as `roomCharges + Σ servicePrice` rather than using the stale DB total.

### `RoomCard.jsx`
Compact card showing room number, type badge, star rating (3–5 stars based on type), price per night, and a "Book Now" button that navigates to `/rooms/:id`.

### `ServiceRequest.jsx`
Grid of available facility services. Each service can be requested once per booking. On confirm, calls `POST /api/services/request` and triggers a bill refresh via the `onServiceRequested` callback.

---

## Services Layer — `src/services/`

### `api.js`
Axios instance configured with:
- `baseURL: '/api'` (proxied to backend by Vite)
- `withCredentials: true` — sends the HttpOnly JWT cookie automatically on every request
- Response interceptor — shows a toast on errors, redirects to `/login` on 401

### `index.js` — Service Modules

```js
authService    // login, register, logout
roomService    // getAvailable, getAll, create, update, delete
bookingService // create, getMyBookings, getAll, cancel
serviceService // getAll, create, delete, request, getByBooking
billingService // generate, getByBooking, pay
adminService   // getDashboard
```

All methods return Axios promises. Components call `.then(r => r.data)` or use `async/await`.

---

## State Management — `src/store/authStore.js`

Zustand store with `persist` middleware (saved to `localStorage` under the key `auth-storage`).

```js
{
  user: null | { email, role, ... },
  setUser(user),   // called after successful login/register
  clearUser(),     // called on logout
}
```

The `user` object drives all role-based rendering across the app (Navbar links, ProtectedRoute guards, admin vs guest layouts).

---

## Animations — `src/index.css`

Custom keyframe animations defined globally and applied via utility classes:

| Class | Effect | Usage |
|---|---|---|
| `.animate-fade-up` | Slide up + fade in | Hero text, section headings, cards |
| `.animate-fade-in` | Fade in only | Overlays, modals |
| `.animate-float` | Gentle infinite up-down float | Hero icon, room card icons |
| `.animate-scale-in` | Scale up + fade in | Stat cards, room type cards |
| `.animate-slide-right` | Slide from left + fade in | Sidebar items |
| `.shimmer-text` | Moving gradient shine | Hero headline |
| `.delay-100` → `.delay-700` | Animation delay steps | Staggered card entrances |

---

## API Proxy

Configured in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

Any request to `/api/*` in development is forwarded to the Spring Boot backend. No CORS configuration is needed in development.

---

## Authentication Flow

1. User submits login form → `POST /api/auth/login`
2. Backend sets an **HttpOnly JWT cookie** on the response
3. Frontend stores `{ email, role }` in Zustand (persisted to localStorage)
4. Every subsequent Axios request sends the cookie automatically (`withCredentials: true`)
5. On logout → `POST /api/auth/logout` clears the cookie, `clearUser()` clears the store

---

## Environment Notes

- No `.env` file is required for development — the proxy handles the backend URL
- The app assumes the backend is always at `http://localhost:8080` in dev
- For production, update the `proxy` target or configure a reverse proxy (e.g. Nginx)
