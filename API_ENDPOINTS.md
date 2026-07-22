# FLIXAPP - Backend API Endpoints Reference

Base URL: `http://127.0.0.1:8000/api/v1`

All authenticated endpoints require the header:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 1. Authentication

### POST /auth/register
Create a new user account. Auto-logs in and returns a token.

**Request:**
```json
{
  "name": "Roeun daro",
  "email": "dari12@example.com",
  "password": "12345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "access_token": "8|BGv439QuA4IxE8C8g1rogb1E7KhAvKrun7KbYvWf66edbcc8",
  "token_type": "Bearer"
}
```

**Error (422):**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

**Status: IMPLEMENTED**

---

### POST /auth/login
Authenticate an existing user and return a token.

**Request:**
```json
{
  "email": "dari12@example.com",
  "password": "12345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "access_token": "9|h158FVcV1DZpecBaz9Xj3pLRn56UWhktfKznyGAY1c2c7a51",
  "token_type": "Bearer"
}
```

**Status: IMPLEMENTED**

---

### GET /auth/me
Fetch the authenticated user's profile. Used on page reload to rehydrate user state.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Roeun daro",
    "email": "dari12@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Frontend need:** ProfilePage shows user name/email. Currently shows "Guest" because this endpoint is not called.

**Status: NOT IMPLEMENTED**

---

### POST /auth/logout
Invalidate the current token server-side.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Frontend need:** Navbar "Sign Out" button currently only clears localStorage. Token should be invalidated server-side.

**Status: NOT IMPLEMENTED**

---

## 2. Movies

### GET /movies
Fetch all movies. Supports optional query parameters for filtering and sorting.

**Query Parameters (optional):**
| Param | Type | Description | Example |
|-------|------|-------------|---------|
| search | string | Filter by title, director, or cast | `?search=nolan` |
| genre | string | Filter by genre name | `?genre=Horror` |
| sort | string | Sort order | `?sort=rating` |
| is_trending | boolean | Filter trending movies | `?is_trending=true` |
| is_popular | boolean | Filter popular movies | `?is_popular=true` |

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 9,
      "title": "Quantum Paradox",
      "genre": "Horror",
      "rating": 4.8,
      "year": 2024,
      "runtime": "145 min",
      "language": "English",
      "country": "USA",
      "poster": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
      "cover": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
      "description": "Scientists accidentally create a portal to a parallel universe...",
      "director": "Denis Villeneuve",
      "cast": ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
      "production": "Legendary Entertainment",
      "trailer_url": "https://www.youtube.com/embed/scifi456",
      "is_trending": true,
      "is_popular": true,
      "reviews": []
    }
  ]
}
```

**Status: IMPLEMENTED (basic GET only, no query params)**

---

### GET /movies/:id
Fetch a single movie by ID with full details including reviews.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 9,
    "title": "Quantum Paradox",
    "genre": "Horror",
    "rating": 4.8,
    "year": 2024,
    "runtime": "145 min",
    "language": "English",
    "country": "USA",
    "poster": "https://...",
    "cover": "https://...",
    "description": "...",
    "director": "Denis Villeneuve",
    "cast": ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    "production": "Legendary Entertainment",
    "trailer_url": "https://...",
    "is_trending": true,
    "is_popular": true,
    "reviews": [
      {
        "id": 1,
        "user": "Alex Mercer",
        "avatar": "https://...",
        "rating": 5,
        "date": "2026-05-12",
        "comment": "An absolute masterpiece.",
        "votes": 42
      }
    ]
  }
}
```

**Frontend need:** MovieDetailsPage currently fetches all movies and finds by ID client-side. A dedicated endpoint would be more efficient.

**Status: NOT IMPLEMENTED**

---

## 3. Genres

### GET /genres
Fetch all available genres.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Interstellar Horizon",
      "created_at": "2026-07-05T10:21:46.000000Z",
      "updated_at": "2026-07-05T10:21:46.000000Z"
    }
  ]
}
```

**Status: IMPLEMENTED**

---

## 4. Favorites

### GET /favorites
Fetch the authenticated user's favorite movies list.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "movie_id": 9, "movie": { "id": 9, "title": "Quantum Paradox", ... } },
    { "id": 2, "movie_id": 5, "movie": { "id": 5, "title": "Interstellar Horizon", ... } }
  ]
}
```

**Frontend need:** FavoritesPage currently uses local state array of IDs. Favorites are lost on page refresh.

**Status: NOT IMPLEMENTED**

---

### POST /favorites
Add a movie to the user's favorites.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "movie_id": 9
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie added to favorites"
}
```

**Frontend need:** MovieCard heart button and MovieDetailsPage heart button currently only toggle local state.

**Status: NOT IMPLEMENTED**

---

### DELETE /favorites/:movieId
Remove a movie from the user's favorites.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Movie removed from favorites"
}
```

**Status: NOT IMPLEMENTED**

---

## 5. Watchlist

### GET /watchlist
Fetch the authenticated user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "movie_id": 8, "movie": { "id": 8, "title": "Midnight Shadows", ... } }
  ]
}
```

**Frontend need:** ProfilePage shows watchlist count. WatchlistPage does not exist yet. Currently local state only.

**Status: NOT IMPLEMENTED**

---

### POST /watchlist
Add a movie to the user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "movie_id": 8
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Movie added to watchlist"
}
```

**Frontend need:** MovieDetailsPage bookmark button currently only toggles local state.

**Status: NOT IMPLEMENTED**

---

### DELETE /watchlist/:movieId
Remove a movie from the user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Movie removed from watchlist"
}
```

**Status: NOT IMPLEMENTED**

---

## 6. Reviews

### GET /movies/:movieId/reviews
Fetch all reviews for a specific movie.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": "Alex Mercer",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      "rating": 5,
      "date": "2026-05-12",
      "comment": "An absolute masterpiece. Visual styling and sound design are out of this world!",
      "votes": 42
    }
  ]
}
```

**Frontend need:** MovieDetailsPage review section currently uses local state or movie.reviews. Reviews are not persisted.

**Status: NOT IMPLEMENTED**

---

### POST /movies/:movieId/reviews
Submit a new review for a movie. Requires authentication.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "rating": 5,
  "comment": "An absolute masterpiece. Visual styling and sound design are out of this world!"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "user": "Roeun daro",
    "avatar": "https://...",
    "rating": 5,
    "date": "2026-07-20",
    "comment": "An absolute masterpiece...",
    "votes": 0
  }
}
```

**Frontend need:** Review form on MovieDetailsPage currently creates local review objects with `id: Date.now()`. Data is lost on navigation.

**Status: NOT IMPLEMENTED**

---

### DELETE /reviews/:reviewId
Delete a review. Only the review author should be allowed.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted"
}
```

**Status: NOT IMPLEMENTED**

---

## 7. Contact / Support

### POST /contact
Submit a support or contact message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "message": "I need help with my account."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Support message received. We will get back to you shortly."
}
```

**Frontend need:** ContactPage form currently only shows a toast notification and resets. No data is sent.

**Status: NOT IMPLEMENTED**

---

## 8. User Profile

### PATCH /user/profile
Update the authenticated user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "name": "Roeun Dary",
  "email": "newemail@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Roeun Dary",
    "email": "newemail@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
  },
  "message": "Profile updated"
}
```

**Frontend need:** ProfilePage is currently read-only. Would allow users to edit their name, email, and avatar.

**Status: NOT IMPLEMENTED**

---

## Summary

| # | Method | Endpoint | Purpose | Status |
|---|--------|----------|---------|--------|
| 1 | POST | /auth/register | Register new account | IMPLEMENTED |
| 2 | POST | /auth/login | Login and get token | IMPLEMENTED |
| 3 | GET | /auth/me | Get authenticated user profile | NOT IMPLEMENTED |
| 4 | POST | /auth/logout | Invalidate token | NOT IMPLEMENTED |
| 5 | GET | /movies | List all movies | IMPLEMENTED |
| 6 | GET | /movies/:id | Get single movie details | NOT IMPLEMENTED |
| 7 | GET | /genres | List all genres | IMPLEMENTED |
| 8 | GET | /favorites | Get user favorites | NOT IMPLEMENTED |
| 9 | POST | /favorites | Add movie to favorites | NOT IMPLEMENTED |
| 10 | DELETE | /favorites/:movieId | Remove from favorites | NOT IMPLEMENTED |
| 11 | GET | /watchlist | Get user watchlist | NOT IMPLEMENTED |
| 12 | POST | /watchlist | Add movie to watchlist | NOT IMPLEMENTED |
| 13 | DELETE | /watchlist/:movieId | Remove from watchlist | NOT IMPLEMENTED |
| 14 | GET | /movies/:movieId/reviews | Get movie reviews | NOT IMPLEMENTED |
| 15 | POST | /movies/:movieId/reviews | Submit a review | NOT IMPLEMENTED |
| 16 | DELETE | /reviews/:reviewId | Delete a review | NOT IMPLEMENTED |
| 17 | POST | /contact | Submit support message | NOT IMPLEMENTED |
| 18 | PATCH | /user/profile | Update user profile | NOT IMPLEMENTED |

**Implemented: 4 / 18 endpoints**
**Not Implemented: 14 / 18 endpoints**
