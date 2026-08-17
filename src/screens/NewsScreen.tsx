import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Newspaper } from 'lucide-react';
import { IS_PROTOTYPE } from '../config/launchSports';
import { visibleNewsArticles } from '../data/news';
import type { NewsArticle } from '../data/news';

function scrollToPageTop() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

export default function NewsScreen() {
  const articles = useMemo(() => visibleNewsArticles(IS_PROTOTYPE), []);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const selectedArticle = articles.find((article) => article.id === selectedArticleId) || null;

  const openArticle = (article: NewsArticle) => {
    setSelectedArticleId(article.id);
    scrollToPageTop();
  };

  const closeArticle = () => {
    setSelectedArticleId(null);
    scrollToPageTop();
  };

  if (selectedArticle) {
    const isSample = selectedArticle.publicationChannel === 'prototype';

    return (
      <article className="animate-in fade-in duration-500 mt-4 space-y-5 px-4 pb-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={closeArticle}
          className="inline-flex items-center gap-2 rounded-full border border-border/10 bg-subcard px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:border-[#B5413F]/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5413F]"
        >
          <ArrowLeft size={15} />
          Back to News
        </button>

        <div className="overflow-hidden rounded-[2rem] border border-border/10 bg-subcard shadow-[0_5px_14px_rgba(0,0,0,0.12)]">
          <div className="relative h-64 overflow-hidden sm:h-96">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <img
              src={selectedArticle.image}
              alt={selectedArticle.imageAlt}
              className="h-full w-full object-cover grayscale opacity-85"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#5A1C2C] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">
                  {selectedArticle.category}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/60">
                  {selectedArticle.dateLabel}
                </span>
              </div>
              <h2 className="mt-4 max-w-4xl text-2xl font-black uppercase leading-tight tracking-wide text-white sm:text-4xl">
                {selectedArticle.title}
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            {isSample && (
              <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs font-bold leading-relaxed text-amber-700 dark:text-amber-200">
                Prototype sample — this is not published school news and will not appear on the production website.
              </div>
            )}

            <p className="max-w-3xl text-lg font-bold leading-relaxed text-foreground/72">
              {selectedArticle.excerpt}
            </p>

            <div className="max-w-3xl space-y-4 text-sm font-medium leading-7 text-foreground/58 sm:text-base">
              {selectedArticle.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {selectedArticle.sections?.map((section) => (
                <section key={section.heading} className="space-y-4 pt-3">
                  <h3 className="text-xl font-black leading-tight tracking-wide text-foreground sm:text-2xl">
                    {section.heading}
                  </h3>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {section.highlights && (
                    <ul className="space-y-3 pl-5 marker:text-[#B5413F]">
                      {section.highlights.map((highlight) => (
                        <li key={highlight.label} className="pl-1">
                          <strong className="font-black text-foreground/78">{highlight.label}:</strong>{' '}
                          {highlight.text}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 mt-4 space-y-6 px-4 pb-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A1C2C]/20">
          <Newspaper className="text-foreground/80" size={20} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-foreground">EAGLES NEWS</h2>
      </div>

      {articles.length === 0 ? (
        <section className="rounded-[2rem] border border-border/10 bg-subcard px-6 py-14 text-center shadow-[0_4px_12px_rgba(0,0,0,0.09)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border/10 bg-foreground/[0.035] text-[#B5413F]">
            <Newspaper size={25} />
          </div>
          <h3 className="mt-5 text-xl font-black uppercase tracking-[0.12em] text-foreground">
            No news published yet
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-foreground/48">
            Approved Eagles Athletics stories will appear here when they are ready.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          {articles.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-border/5 bg-subcard transition-all hover:border-border/20"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-overlay transition-colors group-hover:bg-transparent" />
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  className="h-full w-full object-cover grayscale mix-blend-luminosity opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                />
                <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                  <span className="rounded bg-[#5A1C2C] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                    {post.category}
                  </span>
                  {post.publicationChannel === 'prototype' && (
                    <span className="rounded border border-amber-300/25 bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
                      Prototype sample
                    </span>
                  )}
                </div>
              </div>

              <div className="relative p-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                  {post.dateLabel}
                </p>
                <h3 className="mb-2 text-lg font-black uppercase leading-tight tracking-wide text-foreground transition-colors group-hover:text-foreground/70">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm font-medium leading-relaxed text-foreground/50">
                  {post.excerpt}
                </p>

                <button
                  type="button"
                  onClick={() => openArticle(post)}
                  aria-label={`Read more: ${post.title}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-foreground/45 transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5413F]"
                >
                  Read more <ChevronRight size={14} className="ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
