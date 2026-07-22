<div align="center">

# FLIXAPP

### Cinematic Media Networks

A Netflix-style movie browsing and streaming information web application.

**React 19 + Vite 8 + Tailwind CSS 4 + Laravel REST API**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](#contributing)

[![Deployed](https://img.shields.io/badge/Demo-Live-red?style=for-the-badge)](#)
[![Backend API](https://img.shields.io/badge/Backend-Laravel-orange?style=for-the-badge)](API_BACKEND_BUILD_GUIDE.md)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [State Management](#state-management)
- [API Endpoints](#api-endpoints)
- [Search, Filter & Sort](#search-filter--sort)
- [Authentication](#authentication)
- [Theme System](#theme-system)
- [Responsive Design](#responsive-design)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## About

**FLIXAPP** is a full-stack movie browsing platform designed as a Bachelor's Thesis project. It provides a Netflix-inspired UI for discovering, exploring, and reviewing movies, backed by a Laravel REST API with JWT authentication.

**Key highlights:**
- 10 fully designed pages with dark/light theme
- Real-time search, genre filtering, and sorting
- User authentication with JWT (register/login/logout)
- Favorites and watchlist with optimistic updates
- Interactive movie reviews with 5-star ratings
- Responsive design for mobile, tablet, and desktop

---

## Features

| Category | Feature |
|----------|---------|
| **Browsing** | Hero carousel with auto-rotation, trending/popular/top-rated sections |
| **Search** | Real-time search across title, director, and cast members |
| **Filtering** | Genre-based filtering with scrollable pill buttons |
| **Sorting** | Latest, oldest, and highest rated sort options |
| **Movies** | Detailed movie pages with trailer, cast, and specifications |
| **Reviews** | 5-star rating system with comments and delete own reviews |
| **Favorites** | Heart toggle to save favorite movies (persisted to API) |
| **Watchlist** | Bookmark toggle to track movies to watch later |
| **Auth** | JWT-based register, login, logout with profile management |
| **Theme** | Dark and light mode with smooth transitions |
| **Mobile** | Bottom tab bar navigation, responsive grid layouts |
| **Contact** | Support form with company info and location |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev) | ^19.2.7 | UI framework (JSX, hooks, Context API) |
| [Vite](https://vite.dev) | ^8.1.1 | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | ^4.3.2 | Utility-first CSS framework |
| [lucide-react](https://lucide.dev) | ^1.23.0 | Icon library |
| [ESLint](https://eslint.org) | ^10.6.0 | Code linting |
| **Fetch API** | Native | HTTP client |
| **localStorage** | Native | Token persistence |

**Backend:** [Laravel](https://laravel.com) REST API with Sanctum authentication — see [`API_BACKEND_BUILD_GUIDE.md`](API_BACKEND_BUILD_GUIDE.md)

---

## Screenshots

> Add your screenshots or GIFs here for a visual overview.

```
screenshots/
├── home-dark.png          # Home page (dark theme)
├── home-light.png         # Home page (light theme)
├── movies-browse.png      # Browse movies with filters
├── movie-details.png      # Movie detail page with trailer
├── reviews.png            # Review section
├── mobile-home.png        # Mobile home view
└── mobile-menu.png        # Mobile bottom navigation
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PHP** >= 8.1 (for Laravel backend)
- **Composer** (for Laravel backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/my-movies-app.git
cd my-movies-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend Setup

This frontend requires a Laravel API server. See [`API_BACKEND_BUILD_GUIDE.md`](API_BACKEND_BUILD_GUIDE.md) for full backend setup instructions.

```bash
# The backend must be running at the URL specified in .env
# Default: http://127.0.0.1:8000/api/v1
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# API Base URL (required)
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# App Info
VITE_APP_NAME=FLIXAPP
```

> **Note:** All environment variables must be prefixed with `VITE_` to be exposed to the client bundle.

---

## Project Structure

```
my-movies-app/
├── public/
│   ├── favicon.svg               # App favicon (purple lightning bolt)
│   └── icons.svg                 # SVG sprite sheet
├── src/
│   ├── main.jsx                  # React DOM entry point
│   ├── App.jsx                   # Root component (provider + layout)
│   ├── index.css                 # Global styles + Tailwind
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky top navigation
│   │   ├── MobileMenu.jsx        # Bottom tab bar (mobile)
│   │   ├── Footer.jsx            # Site footer
│   │   ├── MovieCard.jsx         # Reusable movie card
│   │   ├── MovieSectionGrid.jsx  # Titled section + grid
│   │   ├── PageRouter.jsx        # State-based SPA router
│   │   ├── NotificationToast.jsx # Toast notifications
│   │   └── EmptyState.jsx        # Empty state placeholder
│   ├── context/
│   │   └── AppContext.jsx        # Global state (React Context)
│   ├── pages/
│   │   ├── HomePage.jsx          # Hero carousel + 3 sections
│   │   ├── MoviesPage.jsx        # Browse with search/filter/sort
│   │   ├── MovieDetailsPage.jsx  # Full movie detail + reviews
│   │   ├── CategoriesPage.jsx    # Genre browsing cards
│   │   ├── TrendingPage.jsx      # Trending movies grid
│   │   ├── FavoritesPage.jsx     # User favorites
│   │   ├── ContactPage.jsx       # Support form
│   │   ├── ProfilePage.jsx       # User profile + edit
│   │   ├── LoginPage.jsx         # Sign in
│   │   └── RegisterPage.jsx      # Sign up
│   ├── services/
│   │   └── api.js                # API client (18 endpoints)
│   └── data/                     # Legacy mock data (unused)
├── API_ENDPOINTS.md              # API endpoint documentation
├── API_BACKEND_BUILD_GUIDE.md    # Laravel backend guide
├── eslint.config.js
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Pages

| Page | Route Key | Description |
|------|-----------|-------------|
| **Home** | `home` | Hero carousel (5s auto-rotate), trending, popular, top-rated sections |
| **Browse Movies** | `movies` | Full catalog with real-time search, genre filter, sort dropdown |
| **Movie Details** | `details` | Hero banner, trailer player, cast info, review form, review list |
| **Genres** | `categories` | Genre cards — click to filter movies by genre |
| **Trending** | `trending` | Grid of all trending movies |
| **My Favorites** | `favorites` | User's favorited movies (synced to API) |
| **Support** | `contact` | Contact form + company info + location card |
| **Profile** | `profile` | Avatar, stats (favorites/watchlist/reviews), edit profile |
| **Login** | `login` | Email + password with JWT token storage |
| **Register** | `register` | Name + email + password registration |

---

## Components

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `Navbar.jsx` | Logo, 6 nav links, search bar (expandable), theme toggle, profile/sign-in buttons |
| `MobileMenu` | `MobileMenu.jsx` | Fixed bottom tab bar: Home, Browse, Genres, Saved |
| `Footer` | `Footer.jsx` | Brand, copyright, Privacy/Terms/Licensing links |
| `MovieCard` | `MovieCard.jsx` | Poster, heart toggle, star rating, genre badge, title, year, runtime |
| `MovieSectionGrid` | `MovieSectionGrid.jsx` | Titled section wrapper with responsive MovieCard grid |
| `PageRouter` | `PageRouter.jsx` | Switch-based SPA router (10 pages) |
| `NotificationToast` | `NotificationToast.jsx` | Top-right toast notifications, auto-dismiss (3s) |
| `EmptyState` | `EmptyState.jsx` | Placeholder with icon and custom message |

---

## State Management

All global state is managed via `AppContext.jsx` using React Context API:

| State | Type | Description |
|-------|------|-------------|
| `currentPage` | `string` | Active page key |
| `selectedMovieId` | `number` | Movie ID for detail view |
| `searchQuery` | `string` | Global search text |
| `selectedGenre` | `string` | Active genre filter |
| `sortBy` | `string` | Sort option (`Latest`, `Oldest`, `Highest Rated`) |
| `movies` | `array` | All movies from API |
| `genres` | `array` | All genres from API |
| `favorites` | `array` | User's favorited movie IDs |
| `watchlist` | `array` | User's watchlist movie IDs |
| `user` | `object` | Authenticated user profile |
| `token` | `string` | JWT access token |
| `isAuthenticated` | `boolean` | Derived from token presence |
| `theme` | `string` | `"dark"` or `"light"` |
| `notifications` | `array` | Active toast notification objects |
| `loading` | `boolean` | Initial data loading state |

**Key patterns:**
- **Optimistic updates** for favorites and watchlist with automatic rollback on API failure
- **Parallel fetching** on mount: movies, genres, and (if authenticated) user profile, favorites, watchlist

---

## API Endpoints

All endpoints connect to the Laravel backend at `VITE_API_BASE_URL`.

### Auth

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Sign in, returns JWT |
| GET | `/auth/me` | Yes | Get current user profile |
| POST | `/auth/logout` | Yes | Invalidate token |

### Movies

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/movies` | No | Fetch all movies |
| GET | `/movies/:id` | No | Fetch single movie |

### Genres

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/genres` | No | Fetch all genres |

### Favorites

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/favorites` | Yes | Get user favorites |
| POST | `/favorites` | Yes | Add movie to favorites |
| DELETE | `/favorites/:movieId` | Yes | Remove from favorites |

### Watchlist

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/watchlist` | Yes | Get user watchlist |
| POST | `/watchlist` | Yes | Add to watchlist |
| DELETE | `/watchlist/:movieId` | Yes | Remove from watchlist |

### Reviews

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/movies/:movieId/reviews` | No | Get reviews for a movie |
| POST | `/movies/:movieId/reviews` | Yes | Submit a review |
| DELETE | `/reviews/:reviewId` | Yes | Delete own review |

### Contact & Profile

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/contact` | No | Send support message |
| PATCH | `/user/profile` | Yes | Update user profile |

> Full API documentation: [`API_ENDPOINTS.md`](API_ENDPOINTS.md)

---

## Search, Filter & Sort

**Search** (Navbar):
- Matches `movie.title`, `movie.director`, `movie.cast[]`
- Case-insensitive substring matching
- Auto-navigates to Browse Movies on input

**Genre Filter** (Browse Movies):
- Scrollable pill buttons from API genres
- "All" resets filter
- Active genre highlighted in red

**Sort** (Browse Movies dropdown):
- `Latest` — newest first
- `Oldest` — oldest first
- `Highest Rated` — by rating descending

All three work simultaneously.

---

## Authentication

1. User registers or logs in via forms
2. Backend returns `{ access_token }` (JWT via Laravel Sanctum)
3. Token stored in `localStorage`
4. `AppContext` detects token and fetches in parallel:
   - `GET /auth/me` → user profile
   - `GET /favorites` → favorited movie IDs
   - `GET /watchlist` → watchlist movie IDs
5. `isAuthenticated` becomes `true`
6. Protected actions enabled: reviews, favorites, watchlist, profile edit
7. Logout clears token from state and `localStorage`

---

## Theme System

- **Default:** Dark mode (black background, zinc text)
- **Toggle:** Sun/Moon icon button in Navbar
- **Dark:** `bg-black text-zinc-100` with surface colors `#141414`, `#1E1E1E`
- **Light:** `bg-zinc-50 text-zinc-900`
- **Brand color:** `#E50914` (Netflix red)
- **Transition:** 300ms smooth color transitions

---

## Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| **Mobile** (< 768px) | Bottom tab bar, 2-column grid, hidden search bar, hidden carousel arrows |
| **Tablet** (768px - 1024px) | 3-4 column grid, visible search bar |
| **Desktop** (> 1024px) | Full navbar, 4-6 column grid, carousel arrows visible |

**Movie grid:** `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`

---

## Known Issues

- URL-based routing not implemented (no deep linking, no browser history)
- Loading states use plain text instead of skeleton placeholders
- No error boundary for crash recovery
- Theme preference resets on page refresh
- Reviews count on Profile is hardcoded to `0`
- Footer links (Privacy, Terms, Licensing) are placeholder anchors
- No pagination or infinite scroll for large catalogs
- API base URL hardcoded (needs `.env` support)

---

## Roadmap

- [ ] Implement React Router for URL-based routing with deep linking
- [ ] Add loading skeleton components for better perceived performance
- [ ] Add React Error Boundaries for graceful crash recovery
- [ ] Persist theme preference to localStorage
- [ ] Add dedicated Watchlist page
- [ ] Implement pagination or infinite scroll
- [ ] Add 404 catch-all page
- [ ] Create real Privacy Policy, Terms of Service, and Licensing pages
- [ ] Add search result count display and clear button
- [ ] Implement Framer Motion for page transitions and card animations
- [ ] Add social login (Google OAuth)
- [ ] Migrate to TypeScript
- [ ] Add unit and integration tests (Vitest + React Testing Library)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code passes `npm run lint`
- No new ESLint warnings or errors
- Changes are tested on mobile, tablet, and desktop viewports

---

## Author

**Roeun Dary**

Bachelor's Thesis — BVI Chan Volak

```
2026 FlixApp Cinematic Media Networks. Developed by Roeun Dary.
```

---

## License

This project is for educational purposes as part of a Bachelor's Thesis.

---

<div align="center">

**If you found this project helpful, give it a star!**

</div>
