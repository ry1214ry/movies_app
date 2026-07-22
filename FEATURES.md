# FLIXAPP Feature Implementation Specification

> This document defines all remaining features needed to make FLIXAPP a professional, fully functional streaming UI. Each feature includes: description, implementation details, affected files, and acceptance criteria.

---

## Phase 1 — Critical (Fix UX Gaps)

---

### FEATURE-001: User Avatar File Upload

**Description:** Allow users to upload an avatar image directly instead of only providing a URL.

**Endpoint:** `POST /api/v1/user/avatar` (multipart/form-data)

**Request:**
```http
POST /api/v1/user/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Fields:
  avatar: <file> (image/jpeg, image/png, image/webp — max 2MB)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "http://localhost:8000/storage/avatars/abc123.jpg"
  }
}
```

**Response (422):**
```json
{
  "success": false,
  "errors": {
    "avatar": ["Image must be less than 2MB."]
  }
}
```

**Frontend Changes:**
| File | Change |
|------|--------|
| `ProfilePage.jsx` | Replace URL input with file input + preview + upload button |
| `api.js` | Add `uploadAvatar(file)` function with FormData |
| `AppContext.jsx` | Update `user.avatar` state after upload |

**Acceptance Criteria:**
- [ ] Click avatar or "Upload" button opens file picker
- [ ] Image preview shown before upload
- [ ] File validation: JPEG/PNG/WebP only, max 2MB
- [ ] Progress indicator during upload
- [ ] Old avatar replaced in UI immediately (optimistic update)
- [ ] Error toast shown if upload fails

---

### FEATURE-002: Password Visibility Toggle

**Description:** Users can toggle password visibility on login and register forms.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `LoginPage.jsx` | Add Eye/EyeOff toggle button inside password field |
| `RegisterPage.jsx` | Add Eye/EyeOff toggle button inside password field |

**Acceptance Criteria:**
- [ ] Eye icon appears at right end of password input
- [ ] Clicking toggles between `type="password"` and `type="text"`
- [ ] Icon changes from Eye to EyeOff when visible
- [ ] Works on both login and register forms

---

### FEATURE-003: Inline Form Validation

**Description:** Show validation errors below each field in real-time.

**Endpoint:** None (frontend only)

**Rules:**
```json
{
  "name": {
    "required": "Full name is required",
    "minLength": "Name must be at least 2 characters",
    "maxLength": "Name must be less than 50 characters"
  },
  "email": {
    "required": "Email is required",
    "pattern": "Please enter a valid email address"
  },
  "password": {
    "required": "Password is required",
    "minLength": "Password must be at least 8 characters"
  }
}
```

**Frontend Changes:**
| File | Change |
|------|--------|
| `LoginPage.jsx` | Add inline error messages below each input |
| `RegisterPage.jsx` | Add inline error messages below each input |
| `ContactPage.jsx` | Add inline error messages below each input |
| `ProfilePage.jsx` | Add inline error messages in edit form |

**Acceptance Criteria:**
- [ ] Errors shown after field loses focus (onBlur)
- [ ] Errors clear when user starts typing again
- [ ] Submit button disabled until all fields valid
- [ ] Red border on invalid fields
- [ ] Server errors still shown at top of form

---

### FEATURE-004: Mobile Search Bar

**Description:** Add a search bar accessible on mobile devices.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `MobileMenu.jsx` | Add search icon button that opens search overlay |
| New: `MobileSearchOverlay.jsx` | Full-screen search overlay with input and results |

**Acceptance Criteria:**
- [ ] Search icon in bottom tab bar (5th item or replaces one)
- [ ] Tapping opens full-screen search overlay
- [ ] Overlay has back/close button
- [ ] Search input auto-focused
- [ ] Results shown as list (title + genre + year)
- [ ] Tapping result navigates to `/movies/:id` and closes overlay
- [ ] ESC key or back button closes overlay

---

### FEATURE-005: Image Error Handling

**Description:** Show fallback when movie poster or cover image fails to load.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieCard.jsx` | Add `onError` handler with fallback placeholder |
| `MovieDetailsPage.jsx` | Add `onError` handler on poster and cover images |
| New: `ImageFallback.jsx` | Reusable component showing Film icon on error |

**Acceptance Criteria:**
- [ ] Broken images show dark card with Film icon
- [ ] No broken image icons visible anywhere
- [ ] Fallback matches surrounding dark theme
- [ ] Covers both `poster` and `cover` image fields

---

### FEATURE-006: Scroll to Top on Route Change

**Description:** Page scrolls to top when navigating between routes.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `App.jsx` | Fix `ScrollToTop` component to use `useEffect` properly |

**Acceptance Criteria:**
- [ ] Page always starts at top when route changes
- [ ] Works for all routes including dynamic `/movies/:id`
- [ ] Works with browser back/forward buttons
- [ ] No scroll jump on initial page load

---

## Phase 2 — Important (Streaming App Standards)

---

### FEATURE-007: Recently Viewed Section

**Description:** Show last 6 viewed movies on home page.

**Endpoint:** None (stored in localStorage)

**Storage Key:** `recently_viewed`

**Storage Format:**
```json
[
  { "id": 1, "viewedAt": "2026-07-20T10:30:00Z" },
  { "id": 5, "viewedAt": "2026-07-20T09:15:00Z" }
]
```

**Frontend Changes:**
| File | Change |
|------|--------|
| `AppContext.jsx` | Add `recentlyViewed` state + `addToRecentlyViewed(id)` function |
| `HomePage.jsx` | Add "Recently Viewed" section using `MovieSectionGrid` |
| `MovieDetailsPage.jsx` | Call `addToRecentlyViewed(id)` on mount |

**Acceptance Criteria:**
- [ ] Last 6 unique movies shown on home page
- [ ] Most recent first
- [ ] Duplicates removed (same movie moved to top)
- [ ] Persisted across page refreshes
- [ ] Section hidden if no recently viewed movies

---

### FEATURE-008: Continue Watching Section

**Description:** Show movies user has in watchlist as "Continue Watching" on home page.

**Endpoint:** `GET /api/v1/watchlist` (already exists)

**Frontend Changes:**
| File | Change |
|------|--------|
| `HomePage.jsx` | Add "Continue Watching" section using watchlist data |

**Acceptance Criteria:**
- [ ] Section shown only when user is authenticated
- [ ] Movies from watchlist displayed in grid
- [ ] Empty section hidden when watchlist is empty
- [ ] Uses existing `MovieSectionGrid` component

---

### FEATURE-009: Movie Share Button

**Description:** Share movie link via native share API or copy to clipboard.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieDetailsPage.jsx` | Add share icon button next to favorite/watchlist buttons |

**Acceptance Criteria:**
- [ ] Share button (Share2 icon from lucide-react)
- [ ] On mobile: triggers native share sheet with movie title + URL
- [ ] On desktop: copies URL to clipboard + toast "Link copied"
- [ ] URL format: `https://domain.com/movies/{id}`
- [ ] Share includes movie title as share text

---

### FEATURE-010: Advanced Search Filters

**Description:** Add year range and rating range filters to MoviesPage.

**URL Params:**
```
/movies?search=batman&genre=Action&year_from=2020&year_to=2026&rating_min=4&sort=Latest&page=1
```

**Frontend Changes:**
| File | Change |
|------|--------|
| `MoviesPage.jsx` | Add collapsible "Advanced Filters" panel with year range and rating slider |

**Acceptance Criteria:**
- [ ] "Advanced Filters" toggle button (collapsible)
- [ ] Year From / Year To number inputs
- [ ] Rating Min slider (0-5 with step 0.5)
- [ ] All filters reflected in URL params
- [ ] "Clear All" resets all advanced filters
- [ ] Filters work with existing search/genre/sort

---

### FEATURE-011: User Review Editing

**Description:** Allow users to edit their own reviews.

**Endpoint:**
```http
PATCH /api/v1/reviews/{reviewId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated review text"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": "John Doe",
    "rating": 4,
    "comment": "Updated review text",
    "date": "2026-07-20"
  }
}
```

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieDetailsPage.jsx` | Add edit button on own reviews + inline edit form |
| `api.js` | Add `updateReview(reviewId, rating, comment)` function |

**Acceptance Criteria:**
- [ ] Edit (Pencil) icon visible only on own reviews
- [ ] Clicking opens inline edit form with current rating + text
- [ ] Save and Cancel buttons
- [ ] Optimistic update on save
- [ ] Error toast on failure

---

### FEATURE-012: Confirm Delete Dialog

**Description:** Show confirmation modal before deleting reviews.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `ConfirmDialog.jsx` | Reusable modal with title, message, confirm/cancel buttons |
| `MovieDetailsPage.jsx` | Show ConfirmDialog before `handleDeleteReview` |

**Acceptance Criteria:**
- [ ] Modal overlay with dark backdrop
- [ ] Title: "Delete Review"
- [ ] Message: "Are you sure you want to delete this review?"
- [ ] "Delete" button (red) and "Cancel" button
- [ ] ESC key or backdrop click closes modal
- [ ] Focus trapped inside modal

---

### FEATURE-013: Trailer Modal Overlay

**Description:** Play trailers in a full-screen modal without leaving the page.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `TrailerModal.jsx` | Full-screen modal with YouTube iframe, close button |
| `MovieDetailsPage.jsx` | "Play Trailer" button opens modal instead of inline iframe |
| `MovieCard.jsx` | Add small play button overlay on poster hover |

**Acceptance Criteria:**
- [ ] Modal covers full screen with dark backdrop
- [ ] YouTube iframe centered, max 16:9 aspect ratio
- [ ] Close button (X) top-right corner
- [ ] ESC key closes modal
- [ ] Video pauses when modal closes
- [ ] Body scroll locked when modal open

---

### FEATURE-014: Related Movies

**Description:** Show movies from the same genre on detail page.

**Endpoint:** `GET /api/v1/movies?genre={genre}&per_page=6` (already exists)

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieDetailsPage.jsx` | Add "More Like This" section at bottom |
| `api.js` | Add `getMoviesByGenre(genre, perPage)` function |

**Acceptance Criteria:**
- [ ] Section title: "More Like This"
- [ ] Shows 6 movies from same genre (excluding current movie)
- [ ] Horizontal scrollable row on mobile
- [ ] Grid on desktop
- [ ] Each card navigates to that movie's detail page
- [ ] Section hidden if no related movies found

---

### FEATURE-015: Sort on Trending/Popular Pages

**Description:** Add sort dropdown to Trending and Popular pages.

**Endpoint:** None (frontend sort)

**Frontend Changes:**
| File | Change |
|------|--------|
| `TrendingPage.jsx` | Add sort dropdown (Latest, Oldest, Highest Rated) |
| `HomePage.jsx` | No change needed (sections already filtered) |

**Acceptance Criteria:**
- [ ] Sort dropdown matches MoviesPage style
- [ ] Default: "Latest" (newest first)
- [ ] All three options work
- [ ] Sort persists in URL params

---

### FEATURE-016: Pull-to-Refresh (Mobile)

**Description:** Native pull-to-refresh gesture on mobile pages.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `AppContext.jsx` | Add `refreshData()` function that re-fetches movies + genres |
| All pages | Wrap content with pull-to-refresh handler |

**Acceptance Criteria:**
- [ ] Pull down gesture triggers refresh
- [ ] Loading spinner shown during refresh
- [ ] Data re-fetched from API
- [ ] Toast notification "Data refreshed"
- [ ] Only works on mobile (touch devices)

---

## Phase 3 — Polish (Professional Finish)

---

### FEATURE-017: Keyboard Shortcuts

**Description:** Global keyboard shortcuts for power users.

**Shortcuts:**
| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `Escape` | Close modal / clear search |
| `g` then `h` | Go to Home |
| `g` then `m` | Go to Movies |
| `g` then `f` | Go to Favorites |

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `useKeyboardShortcuts.js` | Custom hook for global key listeners |
| `App.jsx` | Mount keyboard shortcuts hook |
| `Navbar.jsx` | Add `ref` to search input for programmatic focus |

**Acceptance Criteria:**
- [ ] `/` focuses search input from anywhere
- [ ] `Escape` closes any open modal or overlay
- [ ] Navigation shortcuts work with `g` prefix
- [ ] Shortcuts disabled when typing in input/textarea
- [ ] Help tooltip showing shortcuts on `?` key

---

### FEATURE-018: Breadcrumbs

**Description:** Show navigation breadcrumbs on inner pages.

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `Breadcrumbs.jsx` | Reusable breadcrumb component |
| `MovieDetailsPage.jsx` | Home > Movies > {Genre} > {Title} |
| `CategoriesPage.jsx` | Home > Genres |
| `WatchlistPage.jsx` | Home > Watchlist |

**Acceptance Criteria:**
- [ ] Breadcrumbs shown below navbar
- [ ] Each segment is a clickable link
- [ ] Current page is not clickable (plain text)
- [ ] Separator: `>` or `/`
- [ ] Responsive: full path on desktop, collapsed on mobile

---

### FEATURE-019: System Theme Preference

**Description:** Auto-detect system dark/light preference on first visit.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `AppContext.jsx` | On first load, check `prefers-color-scheme` media query |

**Acceptance Criteria:**
- [ ] First-time visitors get theme matching OS preference
- [ ] Returning visitors keep their manually selected theme
- [ ] Stored in `localStorage` key `theme`
- [ ] Manual toggle overrides system preference

---

### FEATURE-020: Offline Indicator

**Description:** Show banner when API is unreachable.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `OfflineBanner.jsx` | Fixed banner at top: "You are offline" |
| `AppContext.jsx` | Add `isOnline` state + `navigator.onLine` listeners |

**Acceptance Criteria:**
- [ ] Banner appears when `navigator.onLine === false`
- [ ] Banner disappears when back online
- [ ] Red/warning style banner
- [ ] Non-blocking (content still visible below)
- [ ] Auto-refresh data when coming back online

---

### FEATURE-021: Lazy Load Images

**Description:** Load images only when scrolled into viewport.

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieCard.jsx` | Add `loading="lazy"` attribute on `img` tags |
| `MovieDetailsPage.jsx` | Add `loading="lazy"` on poster/cover images |

**Acceptance Criteria:**
- [ ] All `img` tags have `loading="lazy"`
- [ ] Above-the-fold images (hero carousel) excluded
- [ ] No layout shift on load

---

### FEATURE-022: Trailer Autoplay Mute

**Description:** YouTube trailers start muted with unmute button.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieDetailsPage.jsx` | Add `?mute=1` to YouTube iframe src |
| New: `TrailerModal.jsx` | Add unmute toggle button |

**Acceptance Criteria:**
- [ ] Trailer starts muted
- [ ] Mute/Unmute button visible on player
- [ ] Works with both inline and modal trailer

---

### FEATURE-023: Social Login Buttons

**Description:** Visual Google/GitHub OAuth login buttons.

**Endpoint:** `GET /api/v1/auth/google/redirect` (Laravel Socialite)

**Frontend Changes:**
| File | Change |
|------|--------|
| `LoginPage.jsx` | Add "Or continue with" divider + Google/GitHub buttons |
| `RegisterPage.jsx` | Same buttons |

**Acceptance Criteria:**
- [ ] Divider line with "Or continue with" text
- [ ] Google button with Google icon
- [ ] GitHub button with GitHub icon
- [ ] Buttons redirect to OAuth provider
- [ ] Loading state while redirecting

---

### FEATURE-024: Accessibility Labels

**Description:** Add `aria-label` attributes to all interactive elements.

**Frontend Changes:**
| File | Change |
|------|--------|
| All components | Add `aria-label` to icon-only buttons |

**Labels:**
```json
{
  "theme_toggle": "Toggle dark/light theme",
  "profile_button": "Go to profile",
  "search_clear": "Clear search",
  "favorite_toggle": "Add to favorites",
  "watchlist_toggle": "Add to watchlist",
  "share_button": "Share this movie",
  "close_modal": "Close",
  "menu_toggle": "Open menu",
  "back_button": "Go back"
}
```

**Acceptance Criteria:**
- [ ] All icon-only buttons have `aria-label`
- [ ] All modals have `role="dialog"` and `aria-modal="true"`
- [ ] All images have descriptive `alt` text
- [ ] Form inputs have associated labels
- [ ] Tab order is logical

---

### FEATURE-025: Page Transition Animations

**Description:** Smooth fade/slide transitions between pages.

**Frontend Changes:**
| File | Change |
|------|--------|
| `App.jsx` | Wrap routes with `AnimatePresence` |
| All pages | Add fade-in animation wrapper |

**Acceptance Criteria:**
- [ ] Pages fade in on enter (200ms)
- [ ] Pages fade out on exit (150ms)
- [ ] No animation on initial page load
- [ ] Animations disabled for reduced-motion users

---

### FEATURE-026: Responsive Font Sizes

**Description:** Better typography scaling across devices.

**Frontend Changes:**
| File | Change |
|------|--------|
| `index.css` | Add fluid typography utilities |
| All pages | Use responsive text classes |

**Acceptance Criteria:**
- [ ] Hero title: `text-4xl md:text-6xl lg:text-7xl`
- [ ] Section titles: `text-2xl md:text-3xl`
- [ ] Body text: `text-sm md:text-base`
- [ ] No text overflow on any screen size

---

### FEATURE-027: Back to Top Button

**Description:** Floating button that appears when scrolled down.

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `BackToTop.jsx` | Floating button, appears after 300px scroll |
| `App.jsx` | Add BackToTop component |

**Acceptance Criteria:**
- [ ] Button appears after scrolling 300px down
- [ ] Smooth scroll to top on click
- [ ] Fixed position bottom-right
- [ ] Fade in/out animation
- [ ] Hidden on mobile (scroll up is natural)

---

### FEATURE-028: Cookie Consent Banner

**Description:** GDPR-compliant cookie consent notice.

**Endpoint:** None (frontend only)

**Frontend Changes:**
| File | Change |
|------|--------|
| New: `CookieBanner.jsx` | Fixed bottom banner with Accept/Decline |
| `App.jsx` | Show banner if no consent stored |

**Acceptance Criteria:**
- [ ] Banner at bottom of screen
- [ ] Text: "We use cookies to improve your experience"
- [ ] "Accept" and "Decline" buttons
- [ ] Consent stored in `localStorage` key `cookie_consent`
- [ ] Banner hidden after choice is made
- [ ] No cookies set before consent (if applicable)

---

### FEATURE-029: 404 Movie Redirect

**Description:** When movie ID not found, show suggestions instead of plain error.

**Frontend Changes:**
| File | Change |
|------|--------|
| `MovieDetailsPage.jsx` | On 404, show "Movie not found" with suggested movies grid |

**Acceptance Criteria:**
- [ ] "Movie not found" message displayed
- [ ] Show 4 random movies as suggestions
- [ ] "Browse All Movies" link
- [ ] "Go Home" link

---

### FEATURE-030: Admin Panel Link

**Description:** Show admin link in navbar for admin users.

**Endpoint:** `GET /api/v1/auth/me` (returns `role` field)

**Frontend Changes:**
| File | Change |
|------|--------|
| `Navbar.jsx` | Conditionally show "Admin" link when `user.role === "admin"` |
| `AppContext.jsx` | Store `user.role` from API response |

**Acceptance Criteria:**
- [ ] "Admin" link visible only for admin users
- [ ] Links to admin dashboard (external or `/admin`)
- [ ] Shield icon (Shield from lucide-react)
- [ ] Hidden for regular users

---

## API Endpoints Summary

| # | Method | Endpoint | Auth | Feature |
|---|--------|----------|------|---------|
| 1 | POST | `/user/avatar` | Yes | FEATURE-001 |
| 2 | PATCH | `/reviews/{reviewId}` | Yes | FEATURE-011 |
| 3 | GET | `/auth/google/redirect` | No | FEATURE-023 |
| 4 | GET | `/auth/github/redirect` | No | FEATURE-023 |

All other features are frontend-only.

---

## Affected Files Summary

| File | Features Impacted |
|------|-------------------|
| `App.jsx` | 006, 017, 025, 027, 028 |
| `AppContext.jsx` | 001, 007, 016, 019, 020, 030 |
| `api.js` | 001, 011, 014 |
| `Navbar.jsx` | 024, 030 |
| `MovieCard.jsx` | 005, 013, 021 |
| `MovieDetailsPage.jsx` | 005, 006, 007, 009, 011, 012, 013, 014, 022, 029 |
| `MoviesPage.jsx` | 010 |
| `LoginPage.jsx` | 002, 003, 023 |
| `RegisterPage.jsx` | 002, 003, 023 |
| `ProfilePage.jsx` | 001, 003 |
| `ContactPage.jsx` | 003 |
| `CategoriesPage.jsx` | 018 |
| `TrendingPage.jsx` | 015 |
| `HomePage.jsx` | 007, 008 |
| `MobileMenu.jsx` | 004 |
| `index.css` | 026 |

---

## New Files to Create

| File | Feature |
|------|---------|
| `src/components/ConfirmDialog.jsx` | FEATURE-012 |
| `src/components/TrailerModal.jsx` | FEATURE-013 |
| `src/components/ImageFallback.jsx` | FEATURE-005 |
| `src/components/MobileSearchOverlay.jsx` | FEATURE-004 |
| `src/components/Breadcrumbs.jsx` | FEATURE-018 |
| `src/components/OfflineBanner.jsx` | FEATURE-020 |
| `src/components/BackToTop.jsx` | FEATURE-027 |
| `src/components/CookieBanner.jsx` | FEATURE-028 |
| `src/hooks/useKeyboardShortcuts.js` | FEATURE-017 |

---

## Implementation Order

```
Week 1:  FEATURE-001 to FEATURE-006  (Critical UX fixes)
Week 2:  FEATURE-007 to FEATURE-010  (Streaming standards)
Week 3:  FEATURE-011 to FEATURE-016  (Interaction polish)
Week 4:  FEATURE-017 to FEATURE-024  (Professional features)
Week 5:  FEATURE-025 to FEATURE-030  (Final polish)
```
