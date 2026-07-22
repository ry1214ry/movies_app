import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, Play } from "lucide-react";
import AppContext from "../context/AppContext";
import SafeImage from "./SafeImage";

export default function MovieCard({ movie }) {
  const { toggleFavorite, favorites } = useContext(AppContext);
  const navigate = useNavigate();
  const isFav = favorites.includes(movie.id);

  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/40 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:border-zinc-700/50">
      <div className="aspect-[2/3] relative overflow-hidden bg-zinc-950">
        <SafeImage
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/movies/${movie.id}`);
            }}
            className="p-3 rounded-full bg-red-600 text-white shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300"
            aria-label={`Watch trailer for ${movie.title}`}
          >
            <Play size={18} fill="white" />
          </button>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(movie.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${isFav ? "bg-red-600 border-red-500 text-white" : "bg-black/60 border-zinc-800/40 text-white hover:bg-black/80"}`}
            aria-label={
              isFav ? "Remove from favorites" : "Add to favorites"
            }
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
        onClick={() => navigate(`/movies/${movie.id}`)}
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
