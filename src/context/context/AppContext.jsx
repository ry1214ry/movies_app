import { createContext, useState, useCallback, useEffect } from "react";
import {
  getMovies,
  getGenres,
  getTrendingMovies,
  getPopularMovies,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getMe,
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [reviewsCount, setReviewsCount] = useState(0);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const isAuthenticated = !!token;

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const triggerNotification = useCallback((message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [moviesRes, genresRes, trendingRes, popularRes] = await Promise.all([
          getMovies({ per_page: 100 }),
          getGenres(),
          getTrendingMovies({ per_page: 10 }).catch(() => ({ data: [] })),
          getPopularMovies({ per_page: 10 }).catch(() => ({ data: [] })),
        ]);
        setMovies(moviesRes.data || []);
        setGenres(genresRes.data || []);
        setTrendingMovies(trendingRes.data || []);
        setPopularMovies(popularRes.data || []);
      } catch {
        triggerNotification("Failed to load data from server");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [triggerNotification]);

  useEffect(() => {
    if (!token) return;
    async function loadUserData() {
      try {
        const [meRes, favsRes, wlRes] = await Promise.all([
          getMe().catch(() => null),
          getFavorites().catch(() => null),
          getWatchlist().catch(() => null),
        ]);
        if (meRes?.data) setUser(meRes.data);
        if (favsRes?.data) setFavorites(favsRes.data.map((f) => f.movie_id));
        if (wlRes?.data) setWatchlist(wlRes.data.map((w) => w.movie_id));
      } catch {
        // silently fail
      }
    }
    loadUserData();
  }, [token]);

  const handleLogin = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    const newToken = res.access_token || res.data?.token || res.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    triggerNotification("Logged in successfully");
    return res;
  }, [triggerNotification]);

  const handleRegister = useCallback(async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    const newToken = res.access_token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    triggerNotification("Account created successfully");
    return res;
  }, [triggerNotification]);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    setReviewsCount(0);
    triggerNotification("Logged out");
  }, [triggerNotification]);

  const toggleFavorite = useCallback(async (id) => {
    const isFav = favorites.includes(id);
    setFavorites((prev) =>
      isFav ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
    try {
      if (isFav) {
        await removeFavorite(id);
        triggerNotification("Removed from Favorites");
      } else {
        await addFavorite(id);
        triggerNotification("Added to Favorites");
      }
    } catch {
      setFavorites((prev) =>
        isFav ? [...prev, id] : prev.filter((fId) => fId !== id)
      );
      triggerNotification("Failed to update favorites");
    }
  }, [favorites, triggerNotification]);

  const toggleWatchlist = useCallback(async (id) => {
    const isWatched = watchlist.includes(id);
    setWatchlist((prev) =>
      isWatched ? prev.filter((wId) => wId !== id) : [...prev, id]
    );
    try {
      if (isWatched) {
        await removeFromWatchlist(id);
        triggerNotification("Removed from Watchlist");
      } else {
        await addToWatchlist(id);
        triggerNotification("Added to Watchlist");
      }
    } catch {
      setWatchlist((prev) =>
        isWatched ? [...prev, id] : prev.filter((wId) => wId !== id)
      );
      triggerNotification("Failed to update watchlist");
    }
  }, [watchlist, triggerNotification]);

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        watchlist,
        toggleWatchlist,
        theme,
        setTheme,
        notifications,
        triggerNotification,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        movies,
        genres,
        trendingMovies,
        popularMovies,
        loading,
        user,
        setUser,
        token,
        isAuthenticated,
        reviewsCount,
        setReviewsCount,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
