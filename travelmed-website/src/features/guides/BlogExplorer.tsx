'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight } from 'lucide-react';

export interface BlogCard {
  href: string;
  title: string;
  description: string;
  category: string;
  image: string;
  readingMinutes: number;
  date: string;
}

interface BlogExplorerProps {
  posts: BlogCard[];
  categories: readonly string[];
}

/** Client-side search + category filter over server-provided post cards. */
export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
  }, [posts, query, category]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: posts.length };
    posts.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [posts]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {['All', ...categories].map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                  active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border border-border bg-white text-slate-600 hover:border-primary/30 hover:text-heading'
                }`}
              >
                {c}
                <span className={`rounded-full px-1.5 text-[11px] tabular-nums ${active ? 'bg-white/20' : 'bg-background text-slate-400'}`}>{counts[c] ?? 0}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-10 text-sm text-heading placeholder:text-slate-400 transition focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-background hover:text-heading cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-border bg-white px-6 py-16 text-center">
          <p className="font-heading text-lg font-bold">No articles found</p>
          <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
            className="mt-5 rounded-[12px] bg-primary px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            Show all articles
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.href}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href={p.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-white transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_30px_70px_rgba(15,23,42,0.10)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-bold leading-snug text-heading transition-colors group-hover:text-primary">{p.title}</h3>
                    <p className="mt-2.5 text-sm text-slate-500 leading-relaxed line-clamp-3">{p.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-5 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {p.readingMinutes} min read
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-primary">
                        Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
