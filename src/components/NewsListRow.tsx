import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { PRESS_SCALE, PRESS_TRANSITION } from '../config/motion';
import type { NewsArticle } from '../data/news';

interface NewsListRowProps {
  key?: string;
  article: NewsArticle;
  onOpen: (article: NewsArticle) => void;
  showExcerpt?: boolean;
}

export default function NewsListRow({
  article,
  onOpen,
  showExcerpt = false,
}: NewsListRowProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(article)}
      aria-label={`Read news: ${article.title}`}
      whileTap={{ scale: PRESS_SCALE }}
      transition={PRESS_TRANSITION}
      className="group grid w-full grid-cols-[72px_minmax(0,1fr)] items-start gap-3 overflow-hidden rounded-2xl border border-border/10 bg-subcard p-2.5 text-left shadow-[0_2px_7px_rgba(0,0,0,0.055)] transition-all hover:-translate-y-0.5 hover:border-brand-maroon/25 sm:grid-cols-[88px_minmax(0,1fr)] sm:p-3"
    >
      <img
        src={article.image}
        alt=""
        className="h-16 w-[72px] self-start rounded-xl object-cover object-top sm:h-[72px] sm:w-[88px]"
      />

      <span className="min-w-0 self-start">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[8px] font-black uppercase tracking-[0.13em] text-foreground/48">
          <span className="text-brand-red">{article.category}</span>
          <span>{article.dateLabel}</span>
          {article.publicationChannel === 'prototype' && (
            <span className="rounded-full bg-foreground/[0.06] px-1.5 py-0.5 text-foreground/55">
              Prototype sample
            </span>
          )}
        </span>

        <span className="mt-1 line-clamp-2 block text-[12px] font-black uppercase leading-[1.25] tracking-[0.035em] text-foreground sm:text-[13px]">
          {article.title}
          <ChevronRight
            size={13}
            aria-hidden="true"
            className="ml-1 inline-block align-[-0.16em] text-brand-red transition-transform group-hover:translate-x-0.5"
          />
        </span>

        {showExcerpt && (
          <span className="mt-1 line-clamp-1 block text-[10px] font-semibold leading-relaxed text-foreground/48 sm:text-[11px]">
            {article.excerpt}
          </span>
        )}
      </span>
    </motion.button>
  );
}
