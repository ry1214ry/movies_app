import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import AppContext, { AppProvider } from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import MobileMenu from "./components/MobileMenu";
import Footer from "./components/Footer";
import NotificationToast from "./components/NotificationToast";

import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import CategoriesPage from "./pages/CategoriesPage";
import TrendingPage from "./pages/TrendingPage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchlistPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

function ScrollToTop() {
  return null;
}

function AppLayout() {
  const { theme } = useContext(AppContext);

  return (
    <div
      className={`${theme === "dark" ? "bg-black text-zinc-100" : "bg-zinc-50 text-zinc-900"} min-h-screen font-sans transition-colors duration-300 relative flex flex-col justify-between pb-20 md:pb-0`}
    >
      <div>
        <Navbar />
        <ScrollToTop />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/genres" element={<CategoriesPage />} />
            <Route path="/genres/:id" element={<CategoriesPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>

      <Footer />
      <MobileMenu />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
