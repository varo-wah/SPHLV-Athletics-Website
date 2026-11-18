import { ArrowUpRight, FileText } from 'lucide-react';
import { SCHOOL_MASTER_SCHEDULE_URL, SENIOR_BASKETBALL_WORKBOOK_URL, JUNIOR_VOLLEYBALL_WORKBOOK_URL } from '../config/sheets';
import { OFFICIAL_STANDINGS_SOURCES } from '../data/officialStandings';

const groups = [
  { title: 'School athletics', links: [
    { label: 'Master sports schedule 2026–27', href: SCHOOL_MASTER_SCHEDULE_URL },
    { label: 'Sports Seasons 2026–27', href: 'https://sphacid-my.sharepoint.com/:x:/g/personal/pe-lv_sph_ac_id/IQAaWkY6EQF5TLE1rNpLxXhWAbyXQ8pljpe8S8_S_zy4zmg?e=XEvp9v' },
    { label: 'Sports Handbook 2026–27', href: 'https://sphacid-my.sharepoint.com/personal/pe-lv_sph_ac_id/_layouts/15/Doc.aspx?sourcedoc=%7BF101382F-91A9-4D8C-9A69-10D761A6DBCD%7D&file=SPHLV+Sports+Handbook+26-27.docx&action=default&mobileredirect=true&CT=1786708516306&OR=ItemsView' },
  ] },
  { title: 'Season 2 · League fixtures, results and standings', links: [
    { label: 'Senior Basketball 26/27', href: SENIOR_BASKETBALL_WORKBOOK_URL },
    { label: 'Junior Volleyball 26/27', href: JUNIOR_VOLLEYBALL_WORKBOOK_URL },
  ] },
  { title: 'Season 1 · League fixtures, results and standings', links: [
    { label: 'Senior Volleyball 26/27', href: OFFICIAL_STANDINGS_SOURCES.Volleyball },
    { label: 'Senior Football 26/27', href: OFFICIAL_STANDINGS_SOURCES.Soccer },
    { label: 'Junior Basketball 26/27', href: OFFICIAL_STANDINGS_SOURCES.Basketball },
  ] },
];

export default function ResourcesScreen() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <a href="#/home" className="text-sm font-bold text-foreground/65 underline underline-offset-4">← Home</a>
      <div>
        <h1 className="text-2xl font-black uppercase text-foreground">Documents & spreadsheets</h1>
        <p className="mt-2 text-sm text-foreground/60">Schedules, handbooks and official league workbooks. Links open in a new tab; school documents may require your SPH account.</p>
      </div>
      {groups.map(group => (
        <section key={group.title} aria-label={group.title}>
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide">{group.title}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
            {group.links.map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/15 bg-subcard p-4 text-sm font-bold hover:border-brand-maroon/40 focus-visible:outline-2 focus-visible:outline-brand-red">
                <FileText size={20} className="shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1">{link.label}</span>
                <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
