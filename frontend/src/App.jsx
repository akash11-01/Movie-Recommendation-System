import { useState } from "react";
import { motion } from "framer-motion";

const API = "https://movie-recommendation-system-5qzn.onrender.com";

export default function App() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [posters, setPosters] = useState({});

  const fetchPoster = async (title) => {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${title}&apikey=d80a9b00`,
    );

    const data = await res.json();

    if (data.Poster && data.Poster !== "N/A") {
      return data.Poster;
    }

    return "https://via.placeholder.com/500x750?text=No+Poster";
  };

  const fetchRecommendations = async (movie) => {
    const res = await fetch(`${API}/recommend/${movie}`);
    const data = await res.json();

    setRecommendations(data.recommendations);

    const posterMap = {};

    for (const m of data.recommendations) {
      posterMap[m] = await fetchPoster(m);
    }

    setPosters(posterMap);
  };

  const searchMovies = async (text) => {
    setQuery(text);

    if (!text) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`${API}/search/${text}`);
    const data = await res.json();

    setSuggestions(data);
  };

  const hasRecommendations = recommendations.length > 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_60%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.65 }}
            className="relative overflow-visible rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-6 lg:p-8"
          >
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                    CineMatch
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Movie recommender
                  </span>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
                >
                  Search a movie and get similar recommendations instantly.
                </motion.h1>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Query
                  </p>
                  <p className="mt-2 truncate text-lg font-semibold text-white">
                    {query || "None"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Suggestions
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {suggestions.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-100/80">
                    Results
                  </p>
                  <p className="mt-2 text-lg font-semibold text-cyan-100">
                    {recommendations.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/95 p-2 shadow-2xl shadow-slate-950/20">
                <div className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg text-white">
                    🎥
                  </div>
                  <input
                    type="text"
                    placeholder="Search a movie..."
                    value={query}
                    onChange={(e) => searchMovies(e.target.value)}
                    className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-2 shadow-[0_28px_70px_rgba(2,6,23,0.75)] backdrop-blur-xl">
                  <div className="max-h-72 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          fetchRecommendations(s);
                          setSuggestions([]);
                          setQuery(s);
                        }}
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/8"
                      >
                        <span className="text-sm font-medium text-white">
                          {s}
                        </span>
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.section>

        <section className="mt-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                Recommended for you
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                {hasRecommendations
                  ? `Because you searched for ${query}`
                  : "Pick a movie to unlock tailored suggestions"}
              </h2>
            </div>
            {hasRecommendations && (
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                Your recommendation list is shown first so the useful content
                stays immediately visible after selection.
              </p>
            )}
          </div>

          {hasRecommendations ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {recommendations.map((movie, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 shadow-[0_18px_45px_rgba(2,6,23,0.35)] backdrop-blur-sm"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={posters[movie]}
                      alt={movie}
                      className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white backdrop-blur-md">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-white">
                      {movie}
                    </p>
                    {/* <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Recommended match</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                        Watchlist
                      </span>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.45)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-orange-200/80">
                    Ready when you are
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                    Search for a title and your recommendations will appear
                    here.
                  </h3>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
                  Start typing above to see suggestions.
                </div>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
