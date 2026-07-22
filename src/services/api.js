const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : "";
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      ...defaultHeaders,
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    if (data.errors) {
      const msgs = Object.values(data.errors).flat().join(", ");
      throw new Error(msgs);
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────

export function register({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

// ─── Movies ─────────────────────────────────────────────────────────
// Query params: page, per_page, search, genre, genre_id,
//               year_from, year_to, rating_min,
//               sort (latest, oldest, highest_rated, lowest_rated, title_asc, title_desc)

export function getMovies(params = {}) {
  const query = buildQuery(params);
  return request(`/movies${query}`);
}

export function getMovieById(id) {
  return request(`/movies/${id}`);
}

export function getTrendingMovies(params = {}) {
  const query = buildQuery(params);
  return request(`/movies/trending${query}`);
}

export function getPopularMovies(params = {}) {
  const query = buildQuery(params);
  return request(`/movies/popular${query}`);
}

// ─── Genres ─────────────────────────────────────────────────────────

export function getGenres() {
  return request("/genres");
}

export function getGenreById(id) {
  return request(`/genres/${id}`);
}

// ─── Reviews ────────────────────────────────────────────────────────

export function getMovieReviews(movieId) {
  return request(`/movies/${movieId}/reviews`);
}

export function submitReview(movieId, rating, comment) {
  return request(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });
}

export function updateReview(reviewId, rating, comment) {
  return request(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify({ rating, comment }),
  });
}

export function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, { method: "DELETE" });
}

// ─── Favorites ──────────────────────────────────────────────────────

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

// ─── Watchlist ──────────────────────────────────────────────────────

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

// ─── User Profile ───────────────────────────────────────────────────

export function updateProfile(data) {
  return request("/user/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  return request("/user/avatar", {
    method: "POST",
    body: formData,
  });
}

// ─── Contact ────────────────────────────────────────────────────────

export function submitContact(name, email, message) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}
