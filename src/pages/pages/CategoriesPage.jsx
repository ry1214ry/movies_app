import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function CategoriesPage() {
  const { genres } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedGenre = id
    ? genres.find((g) => String(g.id) === id)
    : null;

  return (
    <div className="px-6 md:px-16 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          {selectedGenre ? selectedGenre.name : "Browse By Genre"}
        </h2>
        <p className="text-zinc-400 text-sm">
          {selectedGenre
            ? `Movies in the ${selectedGenre.name} category`
            : "Select a category folder to isolate target cinematic genres"}
        </p>
      </div>

      {!selectedGenre && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => navigate(`/movies?genre=${encodeURIComponent(genre.name)}`)}
              className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 text-center cursor-pointer transition transform hover:-translate-y-1 hover:border-red-600/40 hover:bg-zinc-900/50 group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto mb-3 font-black group-hover:bg-red-600 group-hover:text-white transition">
                {genre.name[0]}
              </div>
              <h3 className="font-bold text-sm text-white group-hover:text-red-500 transition">
                {genre.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                Explore Titles
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
