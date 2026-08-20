const kvLogo = new URL('../assets/jaac/kv.jpeg', import.meta.url).href;
const lvLogo = new URL('../assets/jaac/lv.jpeg', import.meta.url).href;

export type JaacSchoolCode = 'KV' | 'LV';

export interface JaacSchool {
  code: JaacSchoolCode;
  name: string;
  mascot: string;
  logo: string;
  aliases: readonly string[];
}

const JAAC_SCHOOLS = [
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

export function jaacOpponentSchoolsForEvent(
  ...values: (string | null | undefined)[]
): readonly JaacSchool[] {
  const searchableText = ` ${normalize(values.filter(Boolean).join(' '))} `;

  return JAAC_SCHOOLS.filter((school) => (
    school.code !== 'LV'
    && school.aliases.some((alias) => searchableText.includes(` ${normalize(alias)} `))
  ));
}
