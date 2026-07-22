import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Star,
  MessageSquare,
  Trash2,
  ArrowLeft,
  Pencil,
  Check,
  X,
} from "lucide-react";
import AppContext from "../context/AppContext";
import {
  getMovieById,
  getMovieReviews,
  submitReview,
  updateReview,
  deleteReview,
} from "../services/api";
import { SkeletonDetail } from "../components/Skeleton";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    toggleFavorite,
    favorites,
    toggleWatchlist,
    watchlist,
    user,
    isAuthenticated,
    triggerNotification,
    setReviewsCount,
  } = useContext(AppContext);

  const [movie, setMovie] = useState(null);
  const [activeTab, setActiveTab] = useState("trailer");
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(true);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMovie() {
      setLoadingMovie(true);
      try {
        const res = await getMovieById(id);
        if (!cancelled) setMovie(res.data);
      } catch {
        if (!cancelled) setMovie(null);
      } finally {
        if (!cancelled) setLoadingMovie(false);
      }
    }
    loadMovie();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    async function loadReviews() {
      try {
        const res = await getMovieReviews(id);
        setReviews(res.data || []);
      } catch {
        setReviews([]);
      }
    }
    loadReviews();
  }, [id]);

  if (loadingMovie) {
    return <SkeletonDetail />;
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-zinc-400 text-sm">Movie not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    );
  }

  const movieReviews =
    reviews.length > 0 ? reviews : movie.reviews || [];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    if (!isAuthenticated) {
      triggerNotification("Please sign in to submit a review");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitReview(movie.id, userRating, reviewText);
      setReviews((prev) => [res.data, ...prev]);
      setReviewsCount((prev) => prev + 1);
      setReviewText("");
      setUserRating(5);
      triggerNotification("Review submitted successfully");
    } catch (err) {
      triggerNotification(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditingReview = (rev) => {
    setEditingReviewId(rev.id);
    setEditingText(rev.comment);
    setEditingRating(rev.rating);
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditingText("");
    setEditingRating(5);
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editingText.trim()) return;
    setSavingEdit(true);
    try {
      const res = await updateReview(reviewId, editingRating, editingText);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, ...res.data } : r)),
      );
      cancelEditingReview();
      triggerNotification("Review updated successfully");
    } catch (err) {
      triggerNotification(err.message || "Failed to update review");
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDeleteReview = (reviewId) => {
    setDeletingReviewId(reviewId);
  };

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return;
    try {
      await deleteReview(deletingReviewId);
      setReviews((prev) => prev.filter((r) => r.id !== deletingReviewId));
      setReviewsCount((prev) => Math.max(0, prev - 1));
      triggerNotification("Review deleted");
    } catch (err) {
      triggerNotification(err.message || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="px-6 md:px-16 py-12 space-y-12">
      <button
        onClick={() => navigate(-1)}
        className="text-zinc-400 hover:text-white text-sm font-bold flex items-center gap-1 transition"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero Banner */}
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

      {/* Content Grid */}
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
                src={movie.trailer_url}
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

        {/* Reviews Column */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-red-500" /> Audience
            Reviews
          </h3>

          {/* Submit Review Form */}
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
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:ring-2 focus:ring-red-600 outline-none resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-red-600/10 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Critique Profile"}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
            {movieReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-2"
              >
                {/* Review Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {rev.avatar && (
                      <img
                        src={rev.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-xs font-bold text-white">
                      {rev.user}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400 gap-0.5 text-xs font-bold">
                      <Star size={12} fill="currentColor" /> {rev.rating}/5
                    </div>
                    {isAuthenticated && user && rev.user === user.name && (
                      <>
                        {editingReviewId !== rev.id && (
                          <button
                            onClick={() => startEditingReview(rev)}
                            className="text-zinc-600 hover:text-amber-400 transition p-1 rounded"
                            title="Edit review"
                          >
                            <Pencil size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => confirmDeleteReview(rev.id)}
                          className="text-zinc-600 hover:text-red-500 transition p-1 rounded"
                          title="Delete review"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Mode */}
                {editingReviewId === rev.id ? (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setEditingRating(star)}
                        >
                          <Star
                            size={14}
                            className={
                              star <= editingRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-700"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows="2"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-red-600 outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateReview(rev.id)}
                        disabled={savingEdit || !editingText.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <Check size={10} />{" "}
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEditingReview}
                        className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold px-3 py-1.5 rounded-lg text-[10px] transition flex items-center gap-1"
                      >
                        <X size={10} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Review Body */}
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-600 font-semibold">
                      <span>{rev.date}</span>
                      {rev.votes > 0 && <span>{rev.votes} helpful</span>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {deletingReviewId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setDeletingReviewId(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-white">Delete Review</h3>
            <p className="text-zinc-400 text-sm">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeleteReview}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingReviewId(null)}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-bold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
