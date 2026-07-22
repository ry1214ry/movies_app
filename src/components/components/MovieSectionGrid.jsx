import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieSectionGrid({ title, icon, movies }) {
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
