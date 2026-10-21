export const ACSC_LOGO = new URL('../assets/acsc/acsc.png', import.meta.url).href;
export const ACSC_LOGO_SOURCE_URL = 'https://acscconference.com/wp-content/uploads/2022/12/logo-acsc-small.png';
export const ACSC_MEMBER_SCHOOLS_SOURCE_URL = 'https://acscconference.com/';

export type AcscSchoolCode = 'SPH' | 'MORRISON' | 'ICS-HK' | 'ICS-BKK' | 'GIS' | 'FAITH' | 'DALAT' | 'YISS';

export interface AcscSchool {
  code: AcscSchoolCode;
  name: string;
  shortName: string;
  logo: string;
  logoSourceUrl: string;
  aliases: readonly string[];
}

/** Logos supplied by the conference's current member-school directory. */
export const ACSC_SCHOOLS = [
  {
    code: 'SPH', name: 'Sekolah Pelita Harapan', shortName: 'SPH',
    logo: new URL('../assets/acsc/sph.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2024/03/logo-sph-v03.png',
    aliases: ['SPH', 'SPH LV', 'SPH-LV', 'SPH Lippo Village', 'Sekolah Pelita Harapan', 'Sekolah Pelita Harapan Lippo Village'],
  },
  {
    code: 'MORRISON', name: 'Morrison Academy', shortName: 'Morrison',
    logo: new URL('../assets/acsc/morrison.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2022/12/logo-morrison.png',
    aliases: ['Morrison', 'Morrison Academy', 'Morrison Academy Taichung', 'MAC'],
  },
  {
    code: 'ICS-HK', name: 'International Christian School, Hong Kong', shortName: 'ICS Hong Kong',
    logo: new URL('../assets/acsc/ics-hk.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2022/12/logo-ics-hongkong.png',
    aliases: ['ICS-HK', 'ICS HK', 'ICS Hong Kong', 'International Christian School Hong Kong', 'International Christian School, Hong Kong'],
  },
  {
    code: 'ICS-BKK', name: 'International Community School, Bangkok', shortName: 'ICS Bangkok',
    logo: new URL('../assets/acsc/ics-bkk.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2024/03/logo-ics-bkk-03.png',
    aliases: ['ICS-BKK', 'ICS BKK', 'ICS Bangkok', 'International Community School', 'International Community School Bangkok', 'International Community School, Bangkok'],
  },
  {
    code: 'GIS', name: 'Grace International School', shortName: 'Grace',
    logo: new URL('../assets/acsc/grace.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2026/10/logo-gis-2026-1028x1028-1.png',
    aliases: ['GIS', 'Grace', 'Grace International School'],
  },
  {
    code: 'FAITH', name: 'Faith Academy', shortName: 'Faith',
    logo: new URL('../assets/acsc/faith.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2022/12/logo-faith-academy.png',
    aliases: ['FA', 'Faith', 'Faith Academy'],
  },
  {
    code: 'DALAT', name: 'Dalat International School', shortName: 'Dalat',
    logo: new URL('../assets/acsc/dalat.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2022/12/logo-dalat-02.png',
    aliases: ['DIS', 'Dalat', 'Dalat International School'],
  },
  {
    code: 'YISS', name: 'Yongsan International School of Seoul', shortName: 'YISS',
    logo: new URL('../assets/acsc/yiss.png', import.meta.url).href,
    logoSourceUrl: 'https://acscconference.com/wp-content/uploads/2025/08/2025-logo-yiss-guardians-v01.png',
    aliases: ['YISS', 'Yongsan', 'Yongsan International School', 'Yongsan International School of Seoul'],
  },
] as const satisfies readonly AcscSchool[];

function normalize(value: string): string {
  return value.normalize('NFKD').replace(/[^A-Za-z0-9]+/g, ' ').trim().toUpperCase();
}

export function acscSchoolByCode(code: AcscSchoolCode): AcscSchool {
  return ACSC_SCHOOLS.find(school => school.code === code) as AcscSchool;
}

export function acscSchoolForName(value: string | null | undefined): AcscSchool | null {
  if (!value) return null;
  const normalizedValue = normalize(value);
  return ACSC_SCHOOLS.find(school => school.aliases.some(alias => normalize(alias) === normalizedValue)) ?? null;
}

/** Extract named opponents; bare “ICS” intentionally cannot identify either school. */
export function acscOpponentSchoolsForEvent(...values: (string | null | undefined)[]): readonly AcscSchool[] {
  const searchableText = ` ${normalize(values.filter(Boolean).join(' '))} `;
  return ACSC_SCHOOLS.filter(school => school.code !== 'SPH'
    && school.aliases.some(alias => searchableText.includes(` ${normalize(alias)} `)));
}
