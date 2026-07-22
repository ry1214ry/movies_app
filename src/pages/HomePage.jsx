import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Flame,
  Grid,
  Sparkles,
} from "lucide-react";
import AppContext from "../context/AppContext";
import MovieSectionGrid from "../components/MovieSectionGrid";
import { SkeletonHero, SkeletonSection } from "../components/Skeleton";

export default function HomePage() {
  const { movies, loading, trendingMovies, popularMovies } =
    useContext(AppContext);
  const navigate = useNavigate();

  const slideMovies = useMemo(
    () =>
      trendingMovies.length > 0
        ? trendingMovies
        : movies.filter((m) => m.is_trending),
    [movies, trendingMovies],
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideMovies]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideMovies.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideMovies.length);
  };

  if (loading) {
    return (
      <div className="space-y-16 pb-12">
        <SkeletonHero />
        <div className="px-6 md:px-16 space-y-16">
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </div>
      </div>
    );
  }

  const trending = trendingMovies.length > 0
    ? trendingMovies
    : movies.filter((m) => m.is_trending);

  const popular = popularMovies.length > 0
    ? popularMovies
    : movies.filter((m) => m.is_popular);

  const topRated = movies.filter((m) => m.rating >= 4.5);

  return (
    <div className="space-y-16 pb-12">
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
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20 text-sm"
                >
                  <Play fill="white" size={16} /> Stream Official Trailer
                </button>
                <button
                  onClick={() => navigate(`/movies/${movie.id}`)}
                  className="bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 border border-zinc-800 transition text-sm"
                >
                  <Info size={16} /> View Production Cast
                </button>
              </div>
            </div>
          </div>
        ))}

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

      <div className="px-6 md:px-16 space-y-16">
        <MovieSectionGrid
          title="Trending This Week"
          icon={<Flame className="text-red-500" size={20} />}
          movies={trending}
        />
        <MovieSectionGrid
          title="Most Popular Content"
          icon={<Grid className="text-red-500" size={18} />}
          movies={popular}
        />
        <MovieSectionGrid
          title="Top Rated Masterpieces"
          icon={
            <Star className="text-amber-500" size={18} fill="currentColor" />
          }
          movies={topRated}
        />
      </div>
    </div>
  );
}
