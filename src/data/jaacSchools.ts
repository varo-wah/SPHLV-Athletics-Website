const acgLogo = new URL('../assets/jaac/acg.jpeg', import.meta.url).href;
const acsLogo = new URL('../assets/jaac/acs.jpeg', import.meta.url).href;
const aisLogo = new URL('../assets/jaac/ais.jpeg', import.meta.url).href;
const bsjLogo = new URL('../assets/jaac/bsj.jpeg', import.meta.url).href;
const gjsLogo = new URL('../assets/jaac/gjs.jpeg', import.meta.url).href;
const kvLogo = new URL('../assets/jaac/kv.jpeg', import.meta.url).href;
const lvLogo = new URL('../assets/jaac/lv-circle.png', import.meta.url).href;
const sslLogo = new URL('../assets/jaac/ssl.jpeg', import.meta.url).href;

export type JaacSchoolCode = 'ACG' | 'ACS' | 'AIS' | 'BSJ' | 'GJS' | 'KV' | 'LV' | 'SSL';

export interface JaacSchool {
  code: JaacSchoolCode;
  name: string;
  mascot: string;
  logo: string;
  aliases: readonly string[];
}

const JAAC_SCHOOLS = [
  {
    code: 'ACG',
    name: 'ACG School Jakarta',
    mascot: 'Wolves',
    logo: acgLogo,
    aliases: ['ACG', 'ACG School', 'ACG School Jakarta'],
  },
  {
    code: 'ACS',
    name: 'Anglo-Chinese School Jakarta',
    mascot: 'Knights',
    logo: acsLogo,
    aliases: ['ACS', 'ACS Jakarta', 'Anglo-Chinese School', 'Anglo-Chinese School Jakarta'],
  },
  {
    code: 'AIS',
    name: 'Australian Independent School',
    mascot: 'Kangaroos',
    logo: aisLogo,
    aliases: ['AIS', 'AIS Indonesia', 'Australian Independent School'],
  },
  {
    code: 'BSJ',
    name: 'British School Jakarta',
    mascot: 'Bulldogs',
    logo: bsjLogo,
    aliases: ['BSJ', 'British School Jakarta'],
  },
  {
    code: 'GJS',
    name: 'Global Jaya School',
    mascot: 'Hawks',
    logo: gjsLogo,
    aliases: ['GJS', 'Global Jaya', 'Global Jaya School'],
  },
  {
    code: 'KV',
    name: 'SPH Kemang Village',
    mascot: 'Eagles',
    logo: kvLogo,
    aliases: ['KV', 'SPH KV', 'SPH Kemang Village', 'Kemang Village'],
  },
  {
    code: 'LV',
    name: 'SPH Lippo Village',
    mascot: 'Eagles',
    logo: lvLogo,
    aliases: ['LV', 'SPH LV', 'SPH Lippo Village', 'Lippo Village'],
  },
  {
    code: 'SSL',
    name: 'Sekolah Santa Laurensia',
    mascot: 'Tigers',
    logo: sslLogo,
    aliases: ['SSL', 'STL', 'Santa Laurensia', 'St Laurensia', 'Sekolah Santa Laurensia'],
  },
] as const satisfies readonly JaacSchool[];

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .toUpperCase();
}

export function jaacSchoolByCode(code: JaacSchoolCode): JaacSchool {
  return JAAC_SCHOOLS.find((school) => school.code === code) as JaacSchool;
}

export function jaacSchoolForName(value: string | null | undefined): JaacSchool | null {
  if (!value) return null;
  const normalizedValue = normalize(value);

  return JAAC_SCHOOLS.find((school) => (
    school.aliases.some((alias) => normalize(alias) === normalizedValue)
  )) ?? null;
}

export function jaacOpponentSchoolsForEvent(
  ...values: (string | null | undefined)[]
): readonly JaacSchool[] {
  const searchableText = ` ${normalize(values.filter(Boolean).join(' '))} `;

  return JAAC_SCHOOLS.filter((school) => (
    school.code !== 'LV'
    && school.aliases.some((alias) => searchableText.includes(` ${normalize(alias)} `))
  ));
}
