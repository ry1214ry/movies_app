# FLIXAPP Backend API - Complete Build Guide

Base URL: `http://127.0.0.1:8000/api/v1`

This document contains every endpoint the FLIXAPP frontend needs to function
as a complete professional movie website. It includes database schemas,
Laravel routes, controller logic, and request/response formats.

---

## TABLE OF CONTENTS

1. Database Migrations (Tables)
2. Authentication Endpoints (2 missing)
3. Movies Endpoints (1 missing)
4. Genres Endpoints (already working)
5. Favorites Endpoints (3 missing)
6. Watchlist Endpoints (3 missing)
7. Reviews Endpoints (3 missing)
8. Contact Endpoint (1 missing)
9. User Profile Endpoint (1 missing)
10. Laravel Routes File
11. Summary Checklist

---

## 1. DATABASE MIGRATIONS

### Table: users (already exists from Laravel default)

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->string('avatar')->nullable();
    $table->rememberToken();
    $table->timestamps();
});
```

---

### Table: movies (already exists)

```php
Schema::create('movies', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('genre');
    $table->decimal('rating', 3, 2)->default(0);
    $table->integer('year');
    $table->string('runtime');
    $table->string('language')->default('English');
    $table->string('country')->default('USA');
    $table->text('poster');
    $table->text('cover');
    $table->text('description');
    $table->string('director');
    $table->json('cast');
    $table->string('production');
    $table->string('trailer_url');
    $table->boolean('is_trending')->default(false);
    $table->boolean('is_popular')->default(false);
    $table->timestamps();
});
```

---

### Table: genres (already exists)

```php
Schema::create('genres', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->timestamps();
});
```

---

### Table: favorites (NEEDS TO BE CREATED)

```php
Schema::create('favorites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('movie_id')->constrained()->onDelete('cascade');
    $table->timestamps();

    $table->unique(['user_id', 'movie_id']);
});
```

---

### Table: watchlist (NEEDS TO BE CREATED)

```php
Schema::create('watchlist', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('movie_id')->constrained()->onDelete('cascade');
    $table->timestamps();

    $table->unique(['user_id', 'movie_id']);
});
```

---

### Table: reviews (NEEDS TO BE CREATED)

```php
Schema::create('reviews', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('movie_id')->constrained()->onDelete('cascade');
    $table->integer('rating')->unsigned(); // 1 to 5
    $table->text('comment');
    $table->integer('votes')->default(0);
    $table->timestamps();
});
```

---

### Table: contact_messages (NEEDS TO BE CREATED)

```php
Schema::create('contact_messages', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->text('message');
    $table->boolean('is_read')->default(false);
    $table->timestamps();
});
```

---

## 2. AUTHENTICATION ENDPOINTS

### POST /api/v1/auth/register
Status: ALREADY WORKING

Request:
{
    "name": "Roeun daro",
    "email": "dari12@example.com",
    "password": "12345678"
}

Response:
{
    "success": true,
    "access_token": "8|BGv439QuA4IxE8C8g1rogb1E7KhAvKrun7KbYvWf66edbcc8",
    "token_type": "Bearer"
}

---

### POST /api/v1/auth/login
Status: ALREADY WORKING

Request:
{
    "email": "dari12@example.com",
    "password": "12345678"
}

Response:
{
    "success": true,
    "access_token": "9|h158FVcV1DZpecBaz9Xj3pLRn56UWhktfKznyGAY1c2c7a51",
    "token_type": "Bearer"
}

---

### GET /api/v1/auth/me  <<< NEEDS TO BE BUILT

Purpose: Fetch the authenticated user profile. The frontend needs this
to display user name and email on the ProfilePage after login or page reload.

Auth: Bearer token required

Controller Logic:
```php
public function me(Request $request)
{
    return response()->json([
        'success' => true,
        'data' => $request->user(),
    ]);
}
```

Response:
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Roeun daro",
        "email": "dari12@example.com",
        "avatar": null,
        "created_at": "2026-07-05T10:00:00.000000Z",
        "updated_at": "2026-07-05T10:00:00.000000Z"
    }
}

---

### POST /api/v1/auth/logout  <<< NEEDS TO BE BUILT

Purpose: Invalidate the current access token server-side.

Auth: Bearer token required

Controller Logic:
```php
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'success' => true,
        'message' => 'Logged out successfully',
    ]);
}
```

Response:
{
    "success": true,
    "message": "Logged out successfully"
}

---

## 3. MOVIES ENDPOINTS

### GET /api/v1/movies
Status: ALREADY WORKING

Response:
{
    "success": true,
    "data": [ ... array of movie objects ... ]
}

---

### GET /api/v1/movies/{id}  <<< NEEDS TO BE BUILT

Purpose: Fetch a single movie with its reviews. The frontend currently
loads all movies and finds by ID client-side, which is wasteful.

Auth: Not required (public)

Controller Logic:
```php
public function show($id)
{
    $movie = Movie::with('reviews.user')->findOrFail($id);

    $movie->reviews = $movie->reviews->map(function ($review) {
        return [
            'id' => $review->id,
            'user' => $review->user->name,
            'avatar' => $review->user->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($review->user->name),
            'rating' => $review->rating,
            'date' => $review->created_at->format('Y-m-d'),
            'comment' => $review->comment,
            'votes' => $review->votes,
        ];
    });

    return response()->json([
        'success' => true,
        'data' => $movie,
    ]);
}
```

Response:
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
        "poster": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
        "cover": "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
        "description": "Scientists accidentally create a portal...",
        "director": "Denis Villeneuve",
        "cast": ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
        "production": "Legendary Entertainment",
        "trailer_url": "https://www.youtube.com/embed/scifi456",
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

---

## 4. GENRES ENDPOINTS

### GET /api/v1/genres
Status: ALREADY WORKING

Response:
{
    "success": true,
    "data": [ ... array of genre objects ... ]
}

---

## 5. FAVORITES ENDPOINTS <<< ALL 3 NEED TO BE BUILT

### GET /api/v1/favorites

Purpose: Fetch all favorite movies for the logged-in user.
The frontend needs this so favorites persist across sessions.

Auth: Bearer token required

Controller Logic:
```php
public function index(Request $request)
{
    $favorites = Favorite::where('user_id', $request->user()->id)
        ->with('movie')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $favorites,
    ]);
}
```

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "movie_id": 9,
            "movie": {
                "id": 9,
                "title": "Quantum Paradox",
                "genre": "Horror",
                "rating": 4.8,
                "year": 2024,
                "runtime": "145 min",
                "poster": "https://...",
                "cover": "https://...",
                "is_trending": true,
                "is_popular": true
            }
        }
    ]
}

---

### POST /api/v1/favorites

Purpose: Add a movie to favorites.

Auth: Bearer token required

Request:
{
    "movie_id": 9
}

Controller Logic:
```php
public function store(Request $request)
{
    $request->validate([
        'movie_id' => 'required|exists:movies,id',
    ]);

    $favorite = Favorite::firstOrCreate([
        'user_id' => $request->user()->id,
        'movie_id' => $request->movie_id,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Movie added to favorites',
    ], 201);
}
```

Response:
{
    "success": true,
    "message": "Movie added to favorites"
}

---

### DELETE /api/v1/favorites/{movieId}

Purpose: Remove a movie from favorites.

Auth: Bearer token required

Controller Logic:
```php
public function destroy(Request $request, $movieId)
{
    Favorite::where('user_id', $request->user()->id)
        ->where('movie_id', $movieId)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Movie removed from favorites',
    ]);
}
```

Response:
{
    "success": true,
    "message": "Movie removed from favorites"
}

---

## 6. WATCHLIST ENDPOINTS <<< ALL 3 NEED TO BE BUILT

### GET /api/v1/watchlist

Purpose: Fetch the user's watchlist.

Auth: Bearer token required

Controller Logic:
```php
public function index(Request $request)
{
    $watchlist = Watchlist::where('user_id', $request->user()->id)
        ->with('movie')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $watchlist,
    ]);
}
```

Response:
{
    "success": true,
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "movie_id": 8,
            "movie": {
                "id": 8,
                "title": "Midnight Shadows",
                "genre": "Drama",
                "rating": 4.5,
                "year": 2023,
                "runtime": "101 min",
                "poster": "https://...",
                "cover": "https://...",
                "is_trending": true,
                "is_popular": true
            }
        }
    ]
}

---

### POST /api/v1/watchlist

Purpose: Add a movie to watchlist.

Auth: Bearer token required

Request:
{
    "movie_id": 8
}

Controller Logic:
```php
public function store(Request $request)
{
    $request->validate([
        'movie_id' => 'required|exists:movies,id',
    ]);

    $item = Watchlist::firstOrCreate([
        'user_id' => $request->user()->id,
        'movie_id' => $request->movie_id,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Movie added to watchlist',
    ], 201);
}
```

Response:
{
    "success": true,
    "message": "Movie added to watchlist"
}

---

### DELETE /api/v1/watchlist/{movieId}

Purpose: Remove a movie from watchlist.

Auth: Bearer token required

Controller Logic:
```php
public function destroy(Request $request, $movieId)
{
    Watchlist::where('user_id', $request->user()->id)
        ->where('movie_id', $movieId)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Movie removed from watchlist',
    ]);
}
```

Response:
{
    "success": true,
    "message": "Movie removed from watchlist"
}

---

## 7. REVIEWS ENDPOINTS <<< ALL 3 NEED TO BE BUILT

### GET /api/v1/movies/{movieId}/reviews

Purpose: Fetch all reviews for a specific movie.

Auth: Not required (public)

Controller Logic:
```php
public function index($movieId)
{
    $reviews = Review::where('movie_id', $movieId)
        ->with('user')
        ->latest()
        ->get()
        ->map(function ($review) {
            return [
                'id' => $review->id,
                'user' => $review->user->name,
                'avatar' => $review->user->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($review->user->name),
                'rating' => $review->rating,
                'date' => $review->created_at->format('Y-m-d'),
                'comment' => $review->comment,
                'votes' => $review->votes,
            ];
        });

    return response()->json([
        'success' => true,
        'data' => $reviews,
    ]);
}
```

Response:
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

---

### POST /api/v1/movies/{movieId}/reviews

Purpose: Submit a review for a movie. Requires authentication.

Auth: Bearer token required

Request:
{
    "rating": 5,
    "comment": "An absolute masterpiece. Visual styling and sound design are out of this world!"
}

Controller Logic:
```php
public function store(Request $request, $movieId)
{
    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'comment' => 'required|string|min:1|max:1000',
    ]);

    $movie = Movie::findOrFail($movieId);

    $review = Review::create([
        'user_id' => $request->user()->id,
        'movie_id' => $movie->id,
        'rating' => $request->rating,
        'comment' => $request->comment,
    ]);

    return response()->json([
        'success' => true,
        'data' => [
            'id' => $review->id,
            'user' => $request->user()->name,
            'avatar' => $request->user()->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($request->user()->name),
            'rating' => $review->rating,
            'date' => $review->created_at->format('Y-m-d'),
            'comment' => $review->comment,
            'votes' => 0,
        ],
    ], 201);
}
```

Response:
{
    "success": true,
    "data": {
        "id": 15,
        "user": "Roeun daro",
        "avatar": "https://ui-avatars.com/api/?name=Roeun+daro",
        "rating": 5,
        "date": "2026-07-20",
        "comment": "An absolute masterpiece...",
        "votes": 0
    }
}

---

### DELETE /api/v1/reviews/{reviewId}

Purpose: Delete a review. Only the review author can delete.

Auth: Bearer token required

Controller Logic:
```php
public function destroy(Request $request, $reviewId)
{
    $review = Review::findOrFail($reviewId);

    if ($review->user_id !== $request->user()->id) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized',
        ], 403);
    }

    $review->delete();

    return response()->json([
        'success' => true,
        'message' => 'Review deleted',
    ]);
}
```

Response:
{
    "success": true,
    "message": "Review deleted"
}

---

## 8. CONTACT ENDPOINT <<< NEEDS TO BE BUILT

### POST /api/v1/contact

Purpose: Submit a support or contact message. Does not require authentication.

Request:
{
    "name": "John Doe",
    "email": "john@company.com",
    "message": "I need help with my account."
}

Controller Logic:
```php
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string|max:2000',
    ]);

    ContactMessage::create([
        'name' => $request->name,
        'email' => $request->email,
        'message' => $request->message,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Support message received. We will get back to you shortly.',
    ], 201);
}
```

Response:
{
    "success": true,
    "message": "Support message received. We will get back to you shortly."
}

---

## 9. USER PROFILE ENDPOINT <<< NEEDS TO BE BUILT

### PATCH /api/v1/user/profile

Purpose: Update the authenticated user's profile.

Auth: Bearer token required

Request:
{
    "name": "Roeun Dary",
    "email": "newemail@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
}

Controller Logic:
```php
public function update(Request $request)
{
    $request->validate([
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|max:255|unique:users,email,' . $request->user()->id,
        'avatar' => 'sometimes|nullable|string|max:500',
    ]);

    $user = $request->user();
    $user->update($request->only(['name', 'email', 'avatar']));

    return response()->json([
        'success' => true,
        'data' => $user,
        'message' => 'Profile updated',
    ]);
}
```

Response:
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

---

## 10. LARAVEL ROUTES FILE

Put this in `routes/api.php`:

```php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes (no auth needed)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);
Route::get('/genres', [GenreController::class, 'index']);

Route::get('/movies/{movieId}/reviews', [ReviewController::class, 'index']);

Route::post('/contact', [ContactController::class, 'store']);

// Protected routes (auth token required)
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{movieId}', [FavoriteController::class, 'destroy']);

    // Watchlist
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{movieId}', [WatchlistController::class, 'destroy']);

    // Reviews
    Route::post('/movies/{movieId}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{reviewId}', [ReviewController::class, 'destroy']);

    // User Profile
    Route::patch('/user/profile', [UserController::class, 'update']);
});
```

---

## 11. LARAVEL MODELS

### app/Models/Favorite.php

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = ['user_id', 'movie_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}
```

### app/Models/Watchlist.php

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Watchlist extends Model
{
    protected $table = 'watchlist';
    protected $fillable = ['user_id', 'movie_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}
```

### app/Models/Review.php

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = ['user_id', 'movie_id', 'rating', 'comment', 'votes'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }
}
```

### app/Models/ContactMessage.php

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';
    protected $fillable = ['name', 'email', 'message', 'is_read'];
}
```

### Add to app/Models/User.php

Add these relationships to the existing User model:

```php
public function favorites()
{
    return $this->hasMany(Favorite::class);
}

public function watchlist()
{
    return $this->hasMany(Watchlist::class);
}

public function reviews()
{
    return $this->hasMany(Review::class);
}
```

### Add to app/Models/Movie.php

Add these relationships to the existing Movie model:

```php
public function reviews()
{
    return $this->hasMany(Review::class);
}

public function favoritedBy()
{
    return $this->belongsToMany(User::class, 'favorites');
}
```

---

## 12. SUMMARY CHECKLIST

| # | Method | Endpoint | What To Build | File |
|---|--------|----------|---------------|------|
| 1 | POST | /auth/register | DONE | - |
| 2 | POST | /auth/login | DONE | - |
| 3 | GET | /auth/me | AuthController@me | AuthController.php |
| 4 | POST | /auth/logout | AuthController@logout | AuthController.php |
| 5 | GET | /movies | DONE | - |
| 6 | GET | /movies/{id} | MovieController@show | MovieController.php |
| 7 | GET | /genres | DONE | - |
| 8 | GET | /favorites | FavoriteController@index | FavoriteController.php |
| 9 | POST | /favorites | FavoriteController@store | FavoriteController.php |
| 10 | DELETE | /favorites/{movieId} | FavoriteController@destroy | FavoriteController.php |
| 11 | GET | /watchlist | WatchlistController@index | WatchlistController.php |
| 12 | POST | /watchlist | WatchlistController@store | WatchlistController.php |
| 13 | DELETE | /watchlist/{movieId} | WatchlistController@destroy | WatchlistController.php |
| 14 | GET | /movies/{movieId}/reviews | ReviewController@index | ReviewController.php |
| 15 | POST | /movies/{movieId}/reviews | ReviewController@store | ReviewController.php |
| 16 | DELETE | /reviews/{reviewId} | ReviewController@destroy | ReviewController.php |
| 17 | POST | /contact | ContactController@store | ContactController.php |
| 18 | PATCH | /user/profile | UserController@update | UserController.php |

Files to create:
- database/migrations/xxxx_create_favorites_table.php
- database/migrations/xxxx_create_watchlist_table.php
- database/migrations/xxxx_create_reviews_table.php
- database/migrations/xxxx_create_contact_messages_table.php
- app/Models/Favorite.php
- app/Models/Watchlist.php
- app/Models/Review.php
- app/Models/ContactMessage.php
- app/Http/Controllers/FavoriteController.php
- app/Http/Controllers/WatchlistController.php
- app/Http/Controllers/ReviewController.php
- app/Http/Controllers/ContactController.php
- app/Http/Controllers/UserController.php

Files to modify:
- routes/api.php (add all routes above)
- app/Models/User.php (add relationships)
- app/Models/Movie.php (add relationships)
- app/Http/Controllers/AuthController.php (add me + logout methods)

---

## 13. FRONTEND API SERVICE FILE

The frontend API client is at `src/services/api.js`. Once you build the
endpoints above, add these functions to the frontend:

```javascript
// Add to src/services/api.js

export function getMe() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

export function getFavorites() {
  return request("/favorites");
}

export function addFavorite(movieId) {
  return request("/favorites", {
    method: "POST",
    body: JSON.stringify({ movie_id: movieId }),
  });
}

export function removeFavorite(movieId) {
  return request(`/favorites/${movieId}`, { method: "DELETE" });
}

export function getWatchlist() {
  return request("/watchlist");
}

export function addToWatchlist(movieId) {
  return request("/watchlist", {
    method: "POST",
    body: JSON.stringify({ movie_id: movieId }),
  });
}

export function removeFromWatchlist(movieId) {
  return request(`/watchlist/${movieId}`, { method: "DELETE" });
}

export function getMovieReviews(movieId) {
  return request(`/movies/${movieId}/reviews`);
}

export function submitReview(movieId, rating, comment) {
  return request(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

export function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, { method: "DELETE" });
}

export function submitContact(name, email, message) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}

export function updateProfile(data) {
  return request("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
```
