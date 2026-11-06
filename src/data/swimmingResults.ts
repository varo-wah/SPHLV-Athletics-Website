// SPH-LV Eagles Sports Media meet report shared by Mark Heil on 3 November.
export const SWIM_TEAM_FINISH = 7;
export const SWIM_DELEGATION = { girls: 9, boys: 10 } as const;
export const SWIM_MEDAL_HIGHLIGHT = 'Elisabeth Roberts won two golds, two silvers and one bronze.';

export interface SwimPerformance {
  name: string;
  races: string[];
}

// The poster highlights selected finishes. These names are not a full roster.
export const SWIM_HIGHLIGHTS: { division: 'Girls' | 'Boys'; swimmers: SwimPerformance[] }[] = [
  { division: 'Girls', swimmers: [
    { name: 'Elisabeth Roberts', races: ['1st · 200 backstroke · 2:34.67', '1st · 400 freestyle · 5:03.20', '2nd · 400 individual medley · 5:48.48'] },
    { name: 'Eizabeth Holmgren', races: ['7th · 50 freestyle · 32.21', '7th · 50 butterfly · 37.69'] },
    { name: 'Seraphina Kartawijaya', races: ['7th · 50 backstroke · 42.21'] },
    { name: 'Tokyo Suratman', races: ['10th · 200 breaststroke · 4:11.81'] },
    { name: 'Anwyn Iles', races: ['Tied 10th · 50 backstroke · 49.44'] },
    { name: 'Hannah Vrmeer', races: ['12th · 200 breaststroke · 4:19.25'] },
    { name: 'Michella Jatiman', races: ['15th · 100 freestyle · 1:58.61'] },
  ] },
  { division: 'Boys', swimmers: [
    { name: 'Mingze Lee', races: ['8th · 200 individual medley · 3:05.08', '9th · 50 freestyle · 30.52', '10th · 100 freestyle · 1:07.38'] },
    { name: 'Dylan Dharmawan', races: ['11th · 50 breaststroke · 43.31'] },
    { name: 'Eugene Legawa', races: ['11th · 100 breaststroke · 1:40.94'] },
    { name: 'Nathan Halim', races: ['12th · 100 breaststroke · 1:41.33'] },
    { name: 'Samuel Salim', races: ['12th · 100 butterfly · 2:01.80', '12th · 200 individual medley · 3:58.42'] },
    { name: 'Joseph Vrmeer', races: ['12th · 200 breaststroke · 3:41.03'] },
    { name: 'Dietrich Iles', races: ['13th · 50 freestyle · 33.16', '13th · 50 backstroke · 47.18'] },
  ] },
];
