# KaariGhar — Project Overview

> **India's first transparent custom furniture marketplace** connecting customers with verified master craftsmen. Milestone-based escrow payments, live order tracking, and honest GST-inclusive pricing — every single time.

---

## Table of Contents

1. [What the App Does](#1-what-the-app-does)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Database Schema](#4-database-schema)
5. [Feature Breakdown by Route](#5-feature-breakdown-by-route)
6. [API Reference](#6-api-reference)
7. [Auth Flow](#7-auth-flow)
8. [Key Components](#8-key-components)
9. [Landing Page Architecture](#9-landing-page-architecture)
10. [i18n / Localisation](#10-i18n--localisation)
11. [Design System](#11-design-system)

---

## 1. What the App Does

**KaariGhar** (Hindi: कारीघर — "Craftsman's Workshop") is a B2C marketplace for bespoke furniture in India. Its core pillars:

| Pillar | Description |
|---|---|
| **Verified Makers** | Every craftsman is background-verified with on-site workshop visits, GST registration, and ID checks |
| **Transparent Quoting** | Makers bid with full cost breakdowns — materials, labour, delivery, platform commission, and GST. Zero hidden charges |
| **Milestone Escrow** | Customers pay in stages (Raw Material → Frame → Finishing & Delivery), each unlocked by photo-verified proof |
| **AI-Assisted Requests** | Customers describe or upload a reference image; AI analysis suggests wood type, finish, dimensions, and style — generating a structured spec sheet for craftsmen |
| **Real-time Messaging** | Direct chat between customer and maker once a quote is submitted |
| **Maker Map** | MapLibre-GL powered interactive map showing nearby verified craftsmen with availability status |

### Core User Journey

```
Customer signs up
  → Describes dream furniture (uploads images / paste links / describe in text)
  → AI analyses reference → generates spec sheet
  → Request is broadcast to all verified Makers in the area
  → Makers submit itemised quotes
  → Customer reviews, chats with maker, accepts quote
  → Order created → Milestone escrow tracker activated
  → Customer releases payment per verified milestone
  → Delivery + installation → Customer leaves review
```

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 + Vanilla CSS modules per component |
| **Animation** | Framer Motion v12 + GSAP v3 |
| **Smooth Scroll** | Lenis v1 |
| **Maps** | MapLibre GL v5 |
| **Video** | hls.js v1 (HLS streaming for landing page video) |
| **Icons** | Lucide React v1 |
| **Toasts** | react-hot-toast v2 |
| **HTTP Client** | Axios v1 |
| **Backend** | Express v5 (Node.js) |
| **ORM** | Prisma v5 |
| **Database** | PostgreSQL (prod) / SQLite dev.db (local dev) |
| **Auth** | JWT (jsonwebtoken v9) + bcryptjs v3 |
| **Deployment** | Vercel (frontend + serverless API via `api/index.js`) |

---

## 3. Directory Structure

```
KaariGhar/
├── src/                              ← Frontend React app (Vite)
│   ├── main.jsx                      ← React entry point
│   ├── App.jsx                       ← Root router + ProtectedRoute + AppNavbar
│   ├── AuthContext.jsx               ← Global auth state (JWT + localStorage)
│   ├── api.js                        ← Axios instance (base URL + auth header)
│   ├── i18n.js                       ← Translation strings (EN + HI)
│   ├── data.js                       ← Static mock data for featured makers etc.
│   │
│   ├── landing/                      ← Premium editorial landing page (separate CSS)
│   │   ├── LandingPage.jsx           ← Root landing shell (LoadingScreen → AppShell)
│   │   ├── index.css                 ← Landing-specific design tokens + animations
│   │   ├── hooks/
│   │   │   └── useSmoothScroll.js    ← Lenis smooth scroll initialisation
│   │   └── components/
│   │       ├── Navbar.jsx            ← Landing navbar with scroll behaviour
│   │       ├── Hero.jsx              ← Full-screen hero section
│   │       ├── Marquee.jsx           ← Infinite scrolling text ticker
│   │       ├── StatsSection.jsx      ← Animated counters (makers, rating, cities)
│   │       ├── EditorialSpaces.jsx   ← Scroll-triggered editorial room showcases
│   │       ├── MaterialsGallery.jsx  ← Wood & material texture gallery
│   │       ├── Manifesto.jsx         ← Brand story / philosophy section
│   │       ├── ProcessSection.jsx    ← Step-by-step process explainer
│   │       ├── ContactFooter.jsx     ← Landing footer with contact form
│   │       ├── LoadingScreen.jsx     ← Animated intro loading screen
│   │       ├── CustomCursor.jsx      ← Custom magnetic cursor (desktop)
│   │       └── HlsVideo.jsx          ← HLS video player wrapper
│   │
│   ├── components/                   ← App portal components
│   │   ├── Auth/
│   │   │   └── AuthTabs.jsx          ← Login / Register tabs (role selector)
│   │   ├── Customer/
│   │   │   ├── CustomerDashboard.jsx ← Full customer portal (tabs: requests, orders, map, etc.)
│   │   │   ├── MakerMap.jsx          ← MapLibre GL interactive maker map
│   │   │   ├── MakerProfileModal.jsx ← Detailed maker profile drawer (portfolio, reviews)
│   │   │   └── ReviewCard.jsx        ← Individual review display card
│   │   ├── Maker/
│   │   │   └── MakerDashboard.jsx    ← Full maker portal (tabs: requests, orders, portfolio, stats)
│   │   ├── Hero.jsx                  ← Legacy marketplace hero (at /app route)
│   │   ├── HowItWorks.jsx            ← Process steps component
│   │   ├── FeaturedMakers.jsx        ← Featured craftsmen cards
│   │   ├── Footer.jsx                ← App footer
│   │   ├── NotificationBell.jsx      ← Bell icon + dropdown (polls every 15s)
│   │   ├── Chat.jsx                  ← Customer ↔ Maker direct messaging
│   │   ├── RequestFlow.jsx           ← 4-step order creation wizard (AI analysis included)
│   │   ├── QuoteCard.jsx             ← Quote display with itemised breakdown
│   │   ├── EscrowTracker.jsx         ← Milestone payment tracker
│   │   ├── OrderTimeline.jsx         ← Order status timeline component
│   │   ├── OrdersPage.jsx            ← Orders list view
│   │   ├── ProfileSetup.jsx          ← Post-registration profile onboarding overlay
│   │   └── ProfileSettings.jsx       ← In-app profile editor (both roles)
│   │
│   └── pages/                        ← Public legal pages
│       ├── PrivacyPolicy.jsx
│       ├── TermsOfService.jsx
│       └── CookiePolicy.jsx
│
├── server/
│   └── index.js                      ← Express API server (all routes, ~480 lines)
│
├── api/
│   └── index.js                      ← Vercel serverless entry (re-exports server)
│
├── prisma/
│   └── schema.prisma                 ← Full database schema
│
├── public/                           ← Static assets
├── index.html                        ← Vite HTML shell
├── vite.config.js                    ← Vite config (React plugin)
├── vercel.json                       ← Vercel routing config
└── package.json                      ← All dependencies
```

---

## 4. Database Schema

All models are defined in [prisma/schema.prisma](./prisma/schema.prisma). Uses **PostgreSQL** in production, **SQLite** (`server/dev.db`) locally.

### `User`
Single table for both Customers and Makers, distinguished by `role`.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `email` | String | Unique |
| `passwordHash` | String | bcryptjs |
| `name` | String | |
| `role` | String | `'CUSTOMER'` or `'MAKER'` |
| `phone`, `city`, `bio` | String? | |
| `isProfileComplete` | Boolean | `false` until onboarding done |
| `shopName`, `shopAddress` | String? | Maker only |
| `licenseNumber` | String? | GST / Trade License |
| `yearsExperience` | Int? | |
| `materials` | String? | Comma-separated: `"Teak,Sheesham,Plywood"` |
| `workingHours` | String? | e.g. `"Mon-Sat, 9 AM - 7 PM"` |
| `deliveryRadius` | String? | e.g. `"50 km"` |
| `availability` | String | `AVAILABLE`, `BUSY`, `ON_VACATION` |
| `latitude`, `longitude` | Float? | For map; auto-assigned if missing |

### `Request`
A customer's furniture order request, broadcast to all makers.

| Field | Type | Notes |
|---|---|---|
| `customerId` | UUID FK | → User |
| `title`, `description` | String | |
| `specs` | String? | JSON-stringified spec object |
| `budget` | Float? | |
| `status` | String | `OPEN` → `QUOTED` → `IN_PROGRESS` → `COMPLETED` |
| `attachments` | String? | JSON array of image URLs / YouTube / Instagram links |
| `aiInsights` | String? | AI-generated summary for craftsman |

### `Quote`
A maker's bid on an open request.

| Field | Type | Notes |
|---|---|---|
| `requestId` | UUID FK | → Request |
| `makerId` | UUID FK | → User |
| `price` | Float | Full itemised total |
| `message` | String | Cover note from maker |
| `proposedTimeline` | String? | e.g. `"3-4 weeks"` |
| `status` | String | `PENDING` → `ACCEPTED` / `REJECTED` |

### `Order`
Created when a customer accepts a quote.

| Field | Type | Notes |
|---|---|---|
| `quoteId` | UUID FK unique | One order per quote |
| `status` | String | `IN_PROGRESS` → `COMPLETED` |
| `totalPrice` | Float | |
| `milestones` | Milestone[] | |

### `Milestone`
Payment phases tied to an order (Escrow Tracker).

| Field | Type | Notes |
|---|---|---|
| `orderId` | UUID FK | → Order |
| `title`, `description` | String | e.g. "Raw Material Arrival" |
| `amount` | Float | Payment for this phase |
| `status` | String | `PENDING` → `COMPLETED` → `PAID` |

### `Message`
Direct messages between customer and maker.

| Field | Type | Notes |
|---|---|---|
| `senderId`, `receiverId` | UUID FK | Both → User |
| `content` | String | |
| `read` | Boolean | |

### `Review`
Post-order star rating, one per order.

| Field | Type | Notes |
|---|---|---|
| `orderId` | UUID FK unique | |
| `customerId`, `makerId` | UUID FK | |
| `rating` | Int | 1–5 |
| `comment` | String? | |

### `Favorite`
Customer's saved makers list.

| Field | Type | Notes |
|---|---|---|
| `customerId`, `makerId` | UUID FK | Unique pair |

### `PortfolioItem`
Maker's work showcase images.

| Field | Type | Notes |
|---|---|---|
| `makerId` | UUID FK | |
| `imageUrl` | String | Base64 or external URL |
| `caption` | String? | |
| `category` | String? | e.g. `"Bedroom"`, `"Living Room"` |

### `Notification`
In-app notification inbox.

| Field | Type | Notes |
|---|---|---|
| `userId` | UUID FK | Recipient |
| `type` | String | `QUOTE_RECEIVED`, `ORDER_UPDATE`, `MESSAGE`, `REVIEW` |
| `title`, `message` | String | Display content |
| `link` | String? | Optional deep link |
| `read` | Boolean | |

---

## 5. Feature Breakdown by Route

### Public Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `LandingPage.jsx` | Premium editorial landing page |
| `/auth` | `AuthTabs.jsx` | Login / Register with role selection |
| `/privacy` | `PrivacyPolicy.jsx` | Privacy policy |
| `/terms` | `TermsOfService.jsx` | Terms of service |
| `/cookies` | `CookiePolicy.jsx` | Cookie policy |

### Protected Routes

| Route | Component | Role | Purpose |
|---|---|---|---|
| `/customer/*` | `CustomerDashboard.jsx` | CUSTOMER | Full customer portal |
| `/maker/*` | `MakerDashboard.jsx` | MAKER | Full maker portal |
| `/app` | Legacy hero + sections | Any | Legacy marketplace home |

### Customer Dashboard Tabs

| Tab | Description |
|---|---|
| **My Requests** | Lists all submitted furniture requests with quote counts and status badges |
| **Request Flow** | 4-step wizard to create a new request (Upload → AI Analysis → Spec → Review) |
| **Orders** | Active and completed orders with milestone escrow tracker |
| **Messages** | Direct chat with a maker |
| **Makers Map** | Interactive MapLibre map showing nearby makers with availability pins |
| **Favourites** | Saved/bookmarked makers |
| **Profile** | Edit personal details |

### Maker Dashboard Tabs

| Tab | Description |
|---|---|
| **Overview** | Stats: active orders, incoming requests, this month's earnings, total orders, completion rate |
| **Incoming Requests** | Browse all open customer requests; submit a quote with price, message, and timeline |
| **Active Orders** | Track in-progress orders with milestone management |
| **Portfolio** | Upload and categorise completed work photos |
| **Availability** | Toggle status: Available / Busy / On Vacation |
| **Profile** | Edit shop details, GST number, materials, working hours |

---

## 6. API Reference

All routes in `server/index.js`, prefixed `/api`. JWT auth via `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create user (role: CUSTOMER or MAKER) → returns JWT |
| `POST` | `/api/auth/login` | Login → returns JWT |

### Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/profile` | ✓ | Get current user's full profile |
| `PUT` | `/api/profile` | ✓ | Update profile (marks `isProfileComplete = true`) |
| `GET` | `/api/makers/:id` | — | Public maker profile |

### Customer
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/customer/requests` | CUSTOMER | Create a new furniture request |
| `GET` | `/api/customer/requests` | CUSTOMER | List own requests (with quotes) |
| `GET` | `/api/customer/stats` | CUSTOMER | Dashboard stats |
| `POST` | `/api/customer/quotes/:id/accept` | CUSTOMER | Accept a quote → creates Order, notifies maker |

### Maker
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/maker/requests` | MAKER | List all OPEN requests from customers |
| `POST` | `/api/maker/quotes` | MAKER | Submit a quote → notifies customer |
| `GET` | `/api/maker/orders` | MAKER | List own active orders with milestones |
| `PUT` | `/api/maker/availability` | MAKER | Update availability status |

### Discovery / Map
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/makers/nearby` | ✓ | All makers with lat/lng (auto-assigned if missing) |
| `GET` | `/api/makers/search` | — | Search makers by name, city, materials |

### Messaging
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/messages` | ✓ | Send a message |
| `GET` | `/api/messages/:otherUserId` | ✓ | Get message thread with a user |

### Reviews
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews` | CUSTOMER | Submit a review (1–5 stars) |
| `GET` | `/api/makers/:id/reviews` | — | Get all reviews for a maker + average rating |

### Favourites
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/favorites/:makerId` | CUSTOMER | Toggle favourite (creates or deletes) |
| `GET` | `/api/favorites` | CUSTOMER | List all favourited makers |

### Portfolio
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/portfolio` | MAKER | Add portfolio item (Base64 image) |
| `GET` | `/api/makers/:id/portfolio` | — | Get maker's portfolio |
| `DELETE` | `/api/portfolio/:id` | MAKER | Delete own portfolio item |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | ✓ | Get last 30 notifications + unread count |
| `PUT` | `/api/notifications/:id/read` | ✓ | Mark single notification as read |
| `PUT` | `/api/notifications/read-all` | ✓ | Mark all as read |

---

## 7. Auth Flow

```
1. User visits /auth
2. Selects role: Customer or Maker
3. Registers with email + password + name + city
   → POST /api/auth/register
   → JWT (7d expiry) + user object stored in localStorage
4. AuthContext reads localStorage on page load to restore session
5. ProtectedRoute wrapper in App.jsx checks user context
   → No user → redirect to /auth
   → Wrong role → redirect to /
6. After registration, if isProfileComplete === false
   → ProfileSetup overlay appears (onboarding flow)
   → User fills in shop details / personal info
   → PUT /api/profile → sets isProfileComplete = true
7. Logout clears localStorage and resets context
```

---

## 8. Key Components

### `AuthContext.jsx`
Global React context providing `user`, `login()`, `register()`, `logout()`, `updateUser()`. Persists session via `localStorage`. Wraps the entire app in `main.jsx`.

### `RequestFlow.jsx` — 4-Step Order Wizard
The core customer acquisition flow:
1. **Upload & Describe** — Drag-and-drop reference images, paste YouTube/Instagram/Pinterest links, free-text description
2. **AI Analysis** — Simulated AI reads the image and returns wood type, finish, estimated dimensions, style, and confidence % (displayed as an animated ring)
3. **Spec Template** — Mandatory structured form: Category, L×W×H dimensions, Wood Grade, Finish, Storage, Budget Range, Notes. Shows an "anti-waste" warning for items like "Shoe Rack" recommending standardised alternatives
4. **Review & Submit** — Summary table before broadcasting to makers

### `CustomerDashboard.jsx`
The main authenticated customer portal (~28KB). Contains all customer tabs, quote management, order tracking, the `RequestFlow` wizard, and integration points for `Chat`, `MakerMap`, `MakerProfileModal`, and `EscrowTracker`.

### `MakerDashboard.jsx`
The main authenticated maker portal (~23KB). Contains quote submission, order management, portfolio upload, stats overview, and availability toggle.

### `MakerMap.jsx`
MapLibre GL-powered interactive map. Fetches all makers from `/api/makers/nearby`, plots pins coloured by availability status (green = available, yellow = busy, red = on vacation). Clicking a pin opens a maker card.

### `MakerProfileModal.jsx`
Full-screen drawer showing a maker's complete public profile: bio, shop details, materials, experience, availability, portfolio grid, and all reviews with average rating.

### `EscrowTracker.jsx`
Milestone payment UI. Shows the three payment phases with status indicators (Pending / Completed / Paid) and a "Release Payment" button per phase.

### `NotificationBell.jsx`
Bell icon in the app navbar. Polls `/api/notifications` every 15 seconds. Shows unread badge count (9+ cap). Dropdown lists notifications with type-specific icons (Quote → cart, Order → check, Message → speech bubble, Review → star).

### `Chat.jsx`
Direct messaging between customer and maker. Fetches the message thread for a given `otherUserId`, auto-scrolls to latest, and refreshes every 3 seconds.

### `ProfileSetup.jsx`
Post-registration onboarding overlay triggered when `user.isProfileComplete === false`. Collects role-specific details and calls `PUT /api/profile`.

---

## 9. Landing Page Architecture

The landing page (`/`) is a **completely separate design system** from the app portals — it has its own CSS (`src/landing/index.css`), its own component tree, and its own hooks.

```
LandingPage.jsx
  ├── LoadingScreen         ← Animated brand intro (dismisses on complete)
  └── AppShell
      ├── CustomCursor      ← Magnetic custom cursor (desktop only)
      ├── Navbar            ← Scroll-aware nav with CTA
      ├── Hero              ← Full-screen hero with video background
      ├── Marquee           ← Infinite scrolling text ticker (both directions)
      ├── StatsSection      ← Animated stat counters
      ├── Marquee           ← Second ticker (right direction)
      ├── EditorialSpaces   ← Scroll-triggered room photography showcases
      ├── MaterialsGallery  ← Wood & material texture cards
      ├── Manifesto         ← Brand story / philosophy
      ├── ProcessSection    ← "How it works" steps
      └── ContactFooter     ← Footer + contact form
```

Smooth scrolling powered by **Lenis** via `useSmoothScroll` hook.

---

## 10. i18n / Localisation

**File:** `src/i18n.js`

Supports two languages: **English (`en`)** and **Hindi (`hi`)**. All UI strings are keyed (e.g., `hero_title_1`, `rf_submit`, `escrow_pay`) and resolved via the `t(key, lang)` helper.

Language toggle (`EN` / `हिं`) is built into the app navbar but stored as local component state (not persisted). Language selection is passed as a prop (`lang`) to all major components.

```javascript
import { t } from '../i18n';
t('hero_cta', lang) // → "Start Your Order" or "ऑर्डर शुरू करें"
```

---

## 11. Design System

### Colours
Two separate design systems exist in parallel:

**Landing Page** (`landing/index.css`):
- `--bg`: Dark warm near-black
- `--text`: Off-white
- `--accent`: Muted sage/warm tones
- Grain overlay texture on root element

**App Portals** (`index.css`):
- `--bg-dark`: `#0a0a0a` (near-black)
- `--bg-card`: `#111` (card surfaces)
- `--gold`: `#c9a96e` (primary brand accent — all CTAs, highlights)
- `--gold-light`: `#e2c98b`
- `--text-light`: `#f0ead6` (primary text)
- `--text-muted`: `#8a8070` (secondary text)
- `--border`: `#2a2520` (subtle borders)
- `--success`: `#4caf50`
- `--error`: `#f44336`

### Typography
- Primary font: System sans-serif stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`)
- Headings use weight 600–700
- Gold colour (`var(--gold)`) used for all interactive elements and CTAs

### Key CSS Classes
- `.gold-btn` — Primary gold CTA button with hover lift animation
- `.outline-btn` — Secondary outlined button
- `.glass-card` — Glassmorphism card (blur + translucent background)
- `.app-nav` — Fixed top navigation bar for authenticated portal
- `.anim-fade-up` — Fade + slide-up entrance animation

### Animation
- **Framer Motion** — Page transitions, modal entrances/exits in landing page
- **GSAP** — Complex scroll-triggered animations (landing page sections)
- **Lenis** — Smooth scroll inertia
- CSS keyframe animations for loading screen, fade-up entrances

---

*Last updated: June 2026*
