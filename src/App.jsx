import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  Film,
  Search,
  Heart,
  Bookmark,
  TrendingUp,
  Grid,
  User,
  LogIn,
  Mail,
  Star,
  Play,
  X,
  SlidersHorizontal,
  ChevronRight,
  MessageSquare,
  MapPin,
  Phone,
  Sun,
  Moon,
  Info,
  Clapperboard,
  Flame,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

// ==========================================
// EXPANDED MOCK DATA SYSTEM
// ==========================================
const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Crime",
  "Documentary",
  "Animation",
];

const MOCK_MOVIES = [
  {
    id: 1,
    title: "Interstellar Horizon",
    genre: "Sci-Fi",
    rating: 4.9,
    year: 2024,
    runtime: "169 min",
    language: "English",
    country: "USA",
    poster:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
    cover:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    description:
      "A team of explorers travel beyond this galaxy to discover whether mankind has a future among the stars.",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    production: "Syncopy Inc.",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    isTrending: true,
    isPopular: true,
    isLatest: false,
    isTopRated: true,
  },
  {
    id: 2,
    title: "The Midnight Neon",
    genre: "Action",
    rating: 4.5,
    year: 2025,
    runtime: "124 min",
    language: "English",
    country: "UK",
    poster:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60",
    cover:
      "https://images.unsplash.com/photo-1542204172-e7052809a8a7?w=1200&auto=format&fit=crop&q=80",
    description:
      "In a cyber-dystopian metropolis, an underground racer uncovers a corporate conspiracy that threatens reality itself.",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Ana de Armas"],
    production: "A24 Pictures",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isTrending: true,
    isPopular: false,
    isLatest: true,
    isTopRated: false,
  },
  {
    id: 3,
    title: "Shadows in the Woods",
    genre: "Horror",
    rating: 4.2,
    year: 2023,
    runtime: "98 min",
    language: "English",
    country: "Canada",
    poster:
      "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&auto=format&fit=crop&q=60",
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description:
      "A weekend retreat turns into a fight for survival when old folklore monsters manifest into reality.",
    director: "Robert Eggers",
    cast: ["Anya Taylor-Joy", "Willem Dafoe"],
    production: "Blumhouse Productions",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isTrending: false,
    isPopular: true,
    isLatest: false,
    isTopRated: false,
  },
  {
    id: 4,
    title: "Chronicles of Eldoria",
    genre: "Fantasy",
    rating: 4.8,
    year: 2026,
    runtime: "142 min",
    language: "English",
    country: "New Zealand",
    poster:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=60",
    cover:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80",
    description:
      "The last remaining elven kingdom must form an uneasy alliance with humankind to suppress an ancient draconic curse.",
    director: "Peter Jackson",
    cast: ["Ian McKellen", "Viggo Mortensen"],
    production: "New Line Cinema",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isTrending: true,
    isPopular: true,
    isLatest: true,
    isTopRated: true,
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    user: "Alex Mercer",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    rating: 5,
    date: "2026-05-12",
    comment:
      "An absolute masterpiece. Visual styling and sound design are out of this world!",
    votes: 42,
  },
  {
    id: 2,
    user: "Sophia Lin",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    rating: 4,
    date: "2026-06-01",
    comment:
      "Great pacing and wonderful character development. Ending felt slightly rushed.",
    votes: 19,
  },
];

// ==========================================
// CONTEXTS & STATE PROVIDERS
// ==========================================
const AppContext = createContext();

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMovieId, setSelectedMovieId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([1]);
  const [watchlist, setWatchlist] = useState([2]);
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");

  const triggerNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fId) => fId !== id));
      triggerNotification("Removed from Favorites");
    } else {
      setFavorites([...favorites, id]);
      triggerNotification("Added to Favorites ❤️");
    }
  };

  const toggleWatchlist = (id) => {
    if (watchlist.includes(id)) {
      setWatchlist(watchlist.filter((wId) => wId !== id));
      triggerNotification("Removed from Watchlist");
    } else {
      setWatchlist([...watchlist, id]);
      triggerNotification("Added to Watchlist 📺");
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedMovieId,
        setSelectedMovieId,
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        watchlist,
        toggleWatchlist,
        theme,
        setTheme,
        triggerNotification,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
      }}
    >
      <div
        className={`${theme === "dark" ? "bg-black text-zinc-100" : "bg-zinc-50 text-zinc-900"} min-h-screen font-sans transition-colors duration-300 relative flex flex-col justify-between pb-20 md:pb-0`}
      >
        <div>
          {/* GLOBAL WEBSITE HEADER NAVBAR */}
          <Navbar />

          {/* MAIN WEB CONTENT HOUSING */}
          <div className="w-full">
            <PageRouter />
          </div>
        </div>

        {/* WEBSITE GLOBAL FOOTER */}
        <Footer />

        {/* PHONE SMART NAVIGATION MENU */}
        <MobileMenu />

        {/* NOTIFICATION HUB CONTROLLER */}
        <div className="fixed top-24 right-6 z-50 space-y-2 pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2 border border-red-500 tracking-wide transition-all pointer-events-auto"
            >
              <Info size={16} /> {n.message}
            </div>
          ))}
        </div>
      </div>
    </AppContext.Provider>
  );
}

// ==========================================
// CORE GLOBAL LAYOUT WEBSITE COMPONENTS
// ==========================================

function Navbar() {
  const {
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
  } = useContext(AppContext);
  const links = [
    { id: "home", label: "Home" },
    { id: "movies", label: "Browse Movies" },
    { id: "categories", label: "Genres" },
    { id: "trending", label: "Trending" },
    { id: "favorites", label: "My Favorites" },
    { id: "contact", label: "Support" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-zinc-900 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-8">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setCurrentPage("home")}
        >
          <Film className="text-red-600 w-7 h-7 fill-red-600" />
          <span className="text-xl font-black tracking-tighter text-white">
            FLIX<span className="text-red-600">APP</span>
          </span>
        </div>

        {/* Center Navigation Links (Website Style) */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`text-sm font-semibold tracking-wide transition-all hover:text-red-500 ${
                currentPage === link.id
                  ? "text-red-500 border-b-2 border-red-600 pb-1"
                  : "text-zinc-400"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Field Frame */}
        <div className="hidden md:flex items-center bg-zinc-900/90 border border-zinc-800 rounded-full px-4 py-1.5 w-64 focus-within:w-80 focus-within:border-zinc-700 transition-all duration-300">
          <Search className="text-zinc-400 mr-2" size={16} />
          <input
            type="text"
            placeholder="Search titles, actors..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentPage !== "movies") setCurrentPage("movies");
            }}
            className="bg-transparent text-white focus:outline-none w-full text-xs"
          />
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
          title="Toggle System Theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={() => setCurrentPage("profile")}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition"
          title="User Account"
        >
          <User size={16} />
        </button>

        <button
          onClick={() => setCurrentPage("login")}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition shadow-md shadow-red-600/10"
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}

function MobileMenu() {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  const items = [
    { id: "home", label: "Home", icon: Film },
    { id: "movies", label: "Browse", icon: Grid },
    { id: "categories", label: "Genres", icon: Clapperboard },
    { id: "favorites", label: "Saved", icon: Heart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-zinc-900 py-3 px-8 flex justify-between items-center md:hidden">
      {items.map((i) => {
        const Icon = i.icon;
        return (
          <button
            key={i.id}
            onClick={() => setCurrentPage(i.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === i.id ? "text-red-500" : "text-zinc-500"}`}
          >
            <Icon size={18} />
            <span className="text-[10px] font-bold tracking-tight">
              {i.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ==========================================
// ROUTING CONTROLLER
// ==========================================
function PageRouter() {
  const { currentPage } = useContext(AppContext);
  switch (currentPage) {
    case "home":
      return <HomePage />;
    case "movies":
      return <MoviesPage />;
    case "categories":
      return <CategoriesPage />;
    case "details":
      return <MovieDetailsPage />;
    case "favorites":
      return <FavoritesPage />;
    case "trending":
      return <TrendingPage />;
    case "profile":
      return <ProfilePage />;
    case "login":
      return <LoginPage />;
    case "register":
      return <RegisterPage />;
    case "contact":
      return <ContactPage />;
    default:
      return <HomePage />;
  }
}

// ==========================================
// CINEMATIC WEBSITE CORE VIEWS
// ==========================================

function HomePage() {
  const { setCurrentPage, setSelectedMovieId } = useContext(AppContext);

  // Isolate dynamic data slice for the Hero Slideshow (Trending selections)
  const slideMovies = useMemo(
    () => MOCK_MOVIES.filter((m) => m.isTrending),
    [],
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance loop for slideshow presentation
  useEffect(() => {
    if (slideMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideMovies.length);
    }, 5000); // Transitions slide every 5000ms
    return () => clearInterval(interval);
  }, [slideMovies]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideMovies.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideMovies.length);
  };

  const currentMovie = slideMovies[currentSlide] || MOCK_MOVIES[0];

  return (
    <div className="space-y-16 pb-12">
      {/* Immersive Cinematic Hero Slideshow Banner */}
      <div className="relative h-[550px] md:h-[650px] w-full overflow-hidden bg-black">
        {slideMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 w-full h-full flex items-center px-6 md:px-16 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%), url(${movie.cover})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-500 text-xs uppercase px-3 py-1 rounded-md font-black tracking-widest backdrop-blur-md">
                <Sparkles size={12} fill="currentColor" /> Spotlight Launch
                Selection
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-none">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-xs md:text-sm text-zinc-300 font-medium">
                <span className="text-amber-400 font-bold flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  <Star size={14} fill="currentColor" />
                  {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span>{movie.runtime}</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold">
                  {movie.genre}
                </span>
              </div>

              <p className="text-zinc-300 text-sm md:text-lg leading-relaxed max-w-xl line-clamp-3">
                {movie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setSelectedMovieId(movie.id);
                    setCurrentPage("details");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20 text-sm"
                >
                  <Play fill="white" size={16} /> Stream Official Trailer
                </button>
                <button
                  onClick={() => {
                    setSelectedMovieId(movie.id);
                    setCurrentPage("details");
                  }}
                  className="bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 border border-zinc-800 transition text-sm"
                >
                  <Info size={16} /> View Production Cast
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Interactive Navigation Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-red-600 text-white border border-zinc-800/50 hover:border-red-500 transition hidden md:block"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-red-600 text-white border border-zinc-800/50 hover:border-red-500 transition hidden md:block"
        >
          <ChevronRight size={20} />
        </button>

        {/* Carousel Pagination Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slideMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-red-600"
                  : "w-2 bg-zinc-600/70 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Website Homepage Movie Shelves */}
      <div className="px-6 md:px-16 space-y-16">
        <MovieSectionGrid
          title="🔥 Trending This Week"
          icon={<Flame className="text-red-500" size={20} />}
          movies={MOCK_MOVIES.filter((m) => m.isTrending)}
        />
        <MovieSectionGrid
          title="🎯 Most Popular Content"
          icon={<Grid className="text-red-500" size={18} />}
          movies={MOCK_MOVIES.filter((m) => m.isPopular)}
        />
        <MovieSectionGrid
          title="⭐ Top Rated Masterpieces"
          icon={
            <Star className="text-amber-500" size={18} fill="currentColor" />
          }
          movies={MOCK_MOVIES.filter((m) => m.rating >= 4.5)}
        />
      </div>
    </div>
  );
}

function MoviesPage() {
  const { searchQuery, selectedGenre, setSelectedGenre, sortBy, setSortBy } =
    useContext(AppContext);

  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((movie) => {
      const matchSearch =
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some((actor) =>
          actor.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchGenre =
        selectedGenre === "All" || movie.genre === selectedGenre;
      return matchSearch && matchGenre;
    }).sort((a, b) => {
      if (sortBy === "Highest Rated") return b.rating - a.rating;
      if (sortBy === "Oldest") return a.year - b.year;
      return b.year - a.year;
    });
  }, [searchQuery, selectedGenre, sortBy]);

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Full Media Catalog
          </h2>
          <p className="text-zinc-400 text-sm">
            Browse our comprehensive list of cinematic distributions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={16} className="text-red-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-red-600 outline-none cursor-pointer"
          >
            <option>Latest</option>
            <option>Oldest</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", ...GENRES].map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedGenre === genre
                ? "bg-red-600 text-white shadow-lg"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Grid Component Layout */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState message="No movie listings found fitting these filter parameters." />
      )}
    </div>
  );
}

function CategoriesPage() {
  const { setSelectedGenre, setCurrentPage } = useContext(AppContext);

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Browse By Genre
        </h2>
        <p className="text-zinc-400 text-sm">
          Select a category folder to isolate target cinematic genres
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {GENRES.map((genre, i) => (
          <div
            key={genre}
            onClick={() => {
              setSelectedGenre(genre);
              setCurrentPage("movies");
            }}
            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 text-center cursor-pointer transition transform hover:-translate-y-1 hover:border-red-600/40 hover:bg-zinc-900/50 group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto mb-3 font-black group-hover:bg-red-600 group-hover:text-white transition">
              {genre[0]}
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-red-500 transition">
              {genre}
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1 font-medium">
              Explore Titles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MovieDetailsPage() {
  const {
    selectedMovieId,
    toggleFavorite,
    favorites,
    toggleWatchlist,
    watchlist,
  } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("trailer");
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const movie =
    MOCK_MOVIES.find((m) => m.id === selectedMovieId) || MOCK_MOVIES[0];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviews([
      {
        id: Date.now(),
        user: "Current Active User",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        rating: userRating,
        date: new Date().toISOString().split("T")[0],
        comment: reviewText,
      },
      ...reviews,
    ]);
    setReviewText("");
  };

  return (
    <div className="px-6 md:px-16 py-12 space-y-12">
      <div
        className="relative rounded-3xl overflow-hidden min-h-[350px] md:h-[450px] flex items-end p-6 md:p-12 bg-cover bg-center shadow-2xl border border-zinc-900"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 100%), url(${movie.cover})`,
        }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end w-full relative z-10">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-36 md:w-52 rounded-2xl shadow-2xl border-4 border-black object-cover"
          />
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="bg-red-600 text-white text-[10px] uppercase px-2.5 py-0.5 rounded font-black tracking-wider">
                {movie.genre}
              </span>
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded font-medium">
                {movie.year}
              </span>
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-2.5 py-0.5 rounded font-medium">
                {movie.runtime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              {movie.description}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => toggleFavorite(movie.id)}
              className={`flex-1 md:flex-none p-3.5 rounded-xl border transition flex items-center justify-center ${favorites.includes(movie.id) ? "bg-red-600 border-red-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"}`}
            >
              <Heart
                size={18}
                fill={favorites.includes(movie.id) ? "white" : "none"}
              />
            </button>
            <button
              onClick={() => toggleWatchlist(movie.id)}
              className={`flex-1 md:flex-none p-3.5 rounded-xl border transition flex items-center justify-center ${watchlist.includes(movie.id) ? "bg-zinc-100 text-black border-white" : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"}`}
            >
              <Bookmark
                size={18}
                fill={watchlist.includes(movie.id) ? "black" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-zinc-900 flex gap-6">
            <button
              onClick={() => setActiveTab("trailer")}
              className={`pb-4 font-extrabold text-sm border-b-2 tracking-wide transition ${activeTab === "trailer" ? "border-red-600 text-red-500" : "border-transparent text-zinc-400"}`}
            >
              Official Media Trailer
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              className={`pb-4 font-extrabold text-sm border-b-2 tracking-wide transition ${activeTab === "cast" ? "border-red-600 text-red-500" : "border-transparent text-zinc-400"}`}
            >
              Cast & Specifications
            </button>
          </div>

          {activeTab === "trailer" && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-900 shadow-2xl">
              <iframe
                className="w-full h-full"
                src={movie.trailerUrl}
                title="Trailer Viewframe"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {activeTab === "cast" && (
            <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-zinc-500 font-bold block text-xs uppercase tracking-wider mb-1">
                  Director
                </span>
                <p className="text-white font-semibold text-base">
                  {movie.director}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block text-xs uppercase tracking-wider mb-1">
                  Production House
                </span>
                <p className="text-white font-semibold text-base">
                  {movie.production}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block text-xs uppercase tracking-wider mb-1">
                  Starring Members
                </span>
                <p className="text-white font-semibold text-base">
                  {movie.cast.join(", ")}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block text-xs uppercase tracking-wider mb-1">
                  Origin Country
                </span>
                <p className="text-white font-semibold text-base">
                  {movie.country} ({movie.language})
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Review Component Area */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-red-500" /> Audience
            Reviews
          </h3>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                Your Rating Score
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setUserRating(star)}
                  >
                    <Star
                      size={16}
                      className={
                        star <= userRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-700"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows="3"
              placeholder="Share your personal review regarding this presentation..."
              value={reviewText}
              onChange={(e) => text - zinc - 400(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:ring-2 focus:ring-red-600 outline-none resize-none"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-600/10"
            >
              Submit Critique Profile
            </button>
          </form>

          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white">
                      {rev.user}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400 gap-0.5 text-xs font-bold">
                    <Star size={12} fill="currentColor" /> {rev.rating}/5
                  </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FavoritesPage() {
  const { favorites } = useContext(AppContext);
  const matchedMovies = MOCK_MOVIES.filter((m) => favorites.includes(m.id));

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          My Favorite Showcase
        </h2>
        <p className="text-zinc-400 text-sm">
          Your personally cataloged collection of standout cinema titles
        </p>
      </div>
      {matchedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {matchedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState message="No titles have been designated to your favorites catalog yet." />
      )}
    </div>
  );
}

function TrendingPage() {
  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="text-red-500" /> Hot Content Indexes
        </h2>
        <p className="text-zinc-400 text-sm">
          High consumption media objects tracked across the architecture system
          over the last 24 hours
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {MOCK_MOVIES.filter((m) => m.isTrending).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { favorites, watchlist } = useContext(AppContext);
  return (
    <div className="px-6 md:px-16 py-12">
      <div className="max-w-4xl mx-auto bg-zinc-950 rounded-3xl border border-zinc-900 p-8 md:p-12 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-zinc-900 pb-8">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
            alt="Avatar"
            className="w-24 h-24 rounded-2xl border-4 border-red-600/30 object-cover shadow-2xl"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-white">Roeun Dary</h2>
            <p className="text-red-500 text-xs font-black uppercase tracking-widest">
              Premium System Access Node
            </p>
            <p className="text-zinc-400 text-sm max-w-xl pt-2 leading-relaxed">
              Full-stack software developer engineering high-fidelity digital
              interfaces. Specializes in building modern web systems with React,
              Laravel, and utility-first Tailwind architecture style.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-red-500">
              {favorites.length}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Favorites Saved
            </span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-zinc-100">
              {watchlist.length}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Watchlist Queue
            </span>
          </div>
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4">
            <span className="block text-2xl font-black text-blue-500">2</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Reviews Written
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { setCurrentPage, triggerNotification } = useContext(AppContext);
  return (
    <div className="px-6 py-16">
      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Access Your Portal
          </h2>
          <p className="text-zinc-400 text-xs">
            Provide valid profile credentials to sign in
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerNotification("User Authenticated Successfully");
            setCurrentPage("home");
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="name@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Security Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-red-600/10"
          >
            Sign In
          </button>
        </form>
        <div className="text-center text-xs text-zinc-400">
          New to FlixApp?{" "}
          <button
            onClick={() => setCurrentPage("register")}
            className="text-red-500 font-bold hover:underline"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

// ... keeping standard sub-page components integrated
function RegisterPage() {
  const { setCurrentPage, triggerNotification } = useContext(AppContext);
  return (
    <div className="px-6 py-16">
      <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Create System Profile
          </h2>
          <p className="text-zinc-400 text-xs">
            Set up a tracking profile link inside the platform node
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerNotification("Account Setup Form Dispatched");
            setCurrentPage("login");
          }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Username Handle
            </label>
            <input
              type="text"
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="dary_dev"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="name@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Password Choice
            </label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-red-600/10"
          >
            Register Account
          </button>
        </form>
        <div className="text-center text-xs text-zinc-400">
          Already verified a secure profile link?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            className="text-red-500 font-bold hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  const { triggerNotification } = useContext(AppContext);
  return (
    <div className="px-6 md:px-16 py-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Corporate Support Desks
        </h2>
        <p className="text-zinc-400 text-sm">
          Initiate secure connection requests to our physical or network help
          nodes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              triggerNotification("Support Message Dispatched");
              e.target.reset();
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Your Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Email Vector Link
              </label>
              <input
                type="email"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Message Description
              </label>
              <textarea
                rows="4"
                required
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                placeholder="Elaborate regarding system issues..."
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition tracking-wide"
            >
              Transmit Ticket Payload
            </button>
          </form>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-black text-white">
              Endpoint Routing Datapoints
            </h3>
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin size={16} className="text-red-500" />{" "}
              <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Phone size={16} className="text-red-500" />{" "}
              <span>+855 88 999 7777</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <Mail size={16} className="text-red-500" />{" "}
              <span>support@flixapp-cambodia.com</span>
            </div>
          </div>
          <div className="w-full h-44 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative flex items-center p-6 shadow-inner">
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">
                Operational Node
              </span>
              <p className="text-white font-bold text-sm">
                HQ Office Hub - Southeast Asia
              </p>
            </div>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MOLECULAR INTERFACE COMPONENTS
// ==========================================

function MovieSectionGrid({ title, icon, movies }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          {icon} {title}
        </h3>
        <ChevronRight
          size={18}
          className="text-zinc-500 hover:text-red-500 cursor-pointer transition"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

function MovieCard({ movie }) {
  const { setCurrentPage, setSelectedMovieId, toggleFavorite, favorites } =
    useContext(AppContext);
  const isFav = favorites.includes(movie.id);

  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/40 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-zinc-700/50">
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-950">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${isFav ? "bg-red-600 border-red-500 text-white" : "bg-black/60 border-zinc-800/40 text-white hover:bg-black/80"}`}
          >
            <Heart size={12} fill={isFav ? "white" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-black text-amber-400 flex items-center gap-1 border border-zinc-800/30">
          <Star size={10} fill="currentColor" /> {movie.rating}
        </div>
      </div>
      <div
        className="p-3 space-y-1 cursor-pointer"
        onClick={() => {
          setSelectedMovieId(movie.id);
          setCurrentPage("details");
        }}
      >
        <span className="text-[9px] text-red-500 font-black uppercase tracking-wider">
          {movie.genre}
        </span>
        <h4 className="text-xs font-black text-white tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors duration-200">
          {movie.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold pt-0.5">
          <span>{movie.year}</span>
          <span>{movie.runtime}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-zinc-950 border border-zinc-900 border-dashed rounded-3xl p-8 max-w-sm mx-auto space-y-3">
      <Film size={32} className="text-zinc-800 mx-auto" />
      <p className="text-xs text-zinc-500 font-bold tracking-wide leading-relaxed">
        {message}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-10 px-6 md:px-16 text-center md:text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <span className="text-lg font-black tracking-tighter text-white">
            FLIX<span className="text-red-600">APP</span>
          </span>
          <p className="text-xs text-zinc-600 font-semibold">
            © 2026 FlixApp Cinematic Media Networks. Developed by Roeun Dary.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          <a href="#privacy" className="hover:text-red-500 transition">
            Privacy Statements
          </a>
          <a href="#terms" className="hover:text-red-500 transition">
            Terms of Service
          </a>
          <a href="#licensing" className="hover:text-red-500 transition">
            Distribution Rights
          </a>
        </div>
      </div>
    </footer>
  );
}
