import React, { useState } from "react";
import { NewsArticle } from "../types";
import { EDITORIAL_ARTICLES } from "../data/cricketData";
import { Search, Trophy, Calendar, User, Clock, ChevronRight, X } from "lucide-react";

export default function NewsSection() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Filter articles list
  const filteredArticles = EDITORIAL_ARTICLES.filter((art) => {
    const matchesQuery = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "ALL" || art.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const categories = ["ALL", "Analysis", "Editorial", "Interview"];

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-display font-bold text-sm flex items-center gap-1.5">
            <Trophy className="text-emerald-400 h-4.5 w-4.5" />
            Cricket Analytics & Newsstand
          </h3>
          <p className="text-xs text-slate-400">Read peerless in-depth breakdowns and structural sports reporting papers.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          {/* Categories Toggle */}
          <div className="flex bg-[#0B0E14] p-0.5 border border-slate-800 rounded-xl overflow-x-auto shrink-0 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat ? "bg-[#161B22] text-emerald-400 border border-slate-800/60" : "text-slate-500 hover:text-white"
                }`}
                id={`news-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-52">
            <Search className="h-4.5 w-4.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E14] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-slate-700"
              id="news-search-input"
            />
          </div>
        </div>
      </div>

      {/* Main Articles Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-[#161B22] border border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-slate-700 hover:-translate-y-0.5 group flex flex-col h-full shadow-lg"
          >
            {/* Thumbnail */}
            <div className="h-44 overflow-hidden bg-[#0B0E14] relative">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-400/50">
                {art.category}
              </span>
            </div>

            {/* Read Stats Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-slate-505 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {art.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {art.readTime}
                  </span>
                </div>
                <h4 className="text-white font-display font-medium text-xs leading-snug group-hover:text-emerald-400 transition-all">
                  {art.title}
                </h4>
                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2 font-sans font-light">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/50 pt-3 text-[10px] font-mono">
                <span className="text-slate-400 font-semibold truncate max-w-[130px]" title={art.author}>
                  BY: {art.author.toUpperCase()}
                </span>
                <span className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                  READ ANALYSIS <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl text-xs">
            No editorial columns found matching current criteria.
          </div>
        )}
      </div>

      {/* Fuller Dedicated Reader Overlay Modal Panel */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-[#0B0E14]/93 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#161B22] border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp">
            {/* Cover graphic */}
            <div className="h-56 relative bg-[#0B0E14]">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/20 to-transparent" />
              {/* Close pin */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-[#0B0E14]/70 border border-slate-800/40 text-slate-400 hover:text-white p-1.5 rounded-full backdrop-blur transition-all cursor-pointer"
                id="close-reader-modal-btn"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Overlay Categories */}
              <span className="absolute bottom-4 left-6 bg-emerald-500 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-400">
                {selectedArticle.category}
              </span>
            </div>

            {/* Reader Sheet Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-slate-505 font-mono pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {selectedArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedArticle.readTime}
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
              </div>

              <h3 className="text-white font-display font-medium text-sm leading-snug">
                {selectedArticle.title}
              </h3>

              {/* Formatted Text Content */}
              <div className="whitespace-pre-line text-slate-300 text-xs font-sans leading-relaxed tracking-normal space-y-4 font-light pt-2 select-text font-sans">
                {selectedArticle.content}
              </div>
            </div>

            {/* Footer control panel close */}
            <div className="p-4 bg-[#0B0E14]/50 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-[#161B22] hover:bg-slate-800 text-slate-300 font-sans font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Dismiss Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
