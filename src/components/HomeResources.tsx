import { ArrowUpRight, BookOpen, CalendarDays, CalendarRange } from 'lucide-react';
import { SCHOOL_MASTER_SCHEDULE_URL } from '../config/sheets';

const resources = [
  {
    title: 'Master Schedule',
    description: 'Full games and practice schedule',
    href: SCHOOL_MASTER_SCHEDULE_URL,
    icon: CalendarDays,
  },
  {
    title: 'Sports Seasons',
    description: '2026–27 sports and season dates',
    href: 'https://sphacid-my.sharepoint.com/:x:/g/personal/pe-lv_sph_ac_id/IQAaWkY6EQF5TLE1rNpLxXhWAbyXQ8pljpe8S8_S_zy4zmg?e=XEvp9v',
    icon: CalendarRange,
  },
  {
    title: 'Sports Handbook',
    description: '2026–27 athletics information',
    href: 'https://sphacid-my.sharepoint.com/personal/pe-lv_sph_ac_id/_layouts/15/Doc.aspx?sourcedoc=%7BF101382F-91A9-4D8C-9A69-10D761A6DBCD%7D&file=SPHLV+Sports+Handbook+26-27.docx&action=default&mobileredirect=true&CT=1786708516306&OR=ItemsView',
    icon: BookOpen,
  },
];

export default function HomeResources() {
  return (
    <section aria-labelledby="home-resources-heading" className="home-resources space-y-3">
      <div className="px-1">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand-red">School documents</p>
        <h2 id="home-resources-heading" className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-foreground">
          Athletics Resources
        </h2>
      </div>
      <div className="home-resource-links grid gap-2">
        {resources.map(({ title, description, href, icon: Icon }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border/10 bg-subcard p-4 shadow-[0_2px_7px_rgba(0,0,0,0.055)] transition-colors hover:border-brand-maroon/30 hover:bg-brand-maroon/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red dark:text-red-300">
              <Icon size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black uppercase leading-relaxed tracking-[0.06em]">{title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-foreground/65">{description}</span>
            </span>
            <ArrowUpRight size={17} className="shrink-0 text-foreground/45 group-hover:text-brand-red" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </div>
      <p className="px-1 text-xs text-foreground/60">A school Microsoft account may be required to open these documents.</p>
    </section>
  );
}
