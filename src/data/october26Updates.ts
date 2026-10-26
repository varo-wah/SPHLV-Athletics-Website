import type { GameDayUpdate } from './gamedayUpdates';

// Mark's Teams GameDay reports reviewed October 26; girls' match dates remain unconfirmed.
// See docs/gameday-updates-20261026.md for provenance and date limitations.
export const OCTOBER_26_UPDATES: GameDayUpdate[] = [
  {
    fixtureId: '2026-boys-basketball-jaac-semifinal',
    teamId: 'basketball-smp-boys', date: '2026-10-24', reportedDate: '2026-10-24',
    opponent: 'Santa Laurensia', scoreFor: 49, scoreAgainst: 29,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC semifinal',
      statLeaders: [
        'Denzel — 13 points, 7 steals, 5/9 FG, 3/6 three-pointers',
        'Coby — 11 points, 6 rebounds, 4 steals, 2 assists, 4/7 FG, 2/4 three-pointers',
        'Danson — 10 points, 4 assists, 5 rebounds, 1/3 three-pointers, 1/2 FT',
        'Jacob — 3 assists, 3 rebounds, 2/4 FT',
        'Rainer — 3 steals, 2 assists, 2/4 FG, 1/2 FT',
      ],
      highlights: ['The boys advanced to the JAAC final with a 49–29 win over Santa Laurensia.'],
    },
  },
  {
    fixtureId: '2026-boys-basketball-jaac-final',
    teamId: 'basketball-smp-boys', date: '2026-10-24', reportedDate: '2026-10-24',
    opponent: 'BSJ', scoreFor: 69, scoreAgainst: 27,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC final',
      statLeaders: [
        'Coby — 25 points, 9 assists, 6 rebounds, 3 steals, 10/17 FG, 5/8 three-pointers',
        'Denzel — 21 points, 7/12 FG, 7/10 three-pointers, 1 block',
        'Rainer — 15 points, 3 steals, 7/10 FG',
        'Jacob — 10 rebounds, 1 steal, 2/3 FG, 2/2 FT',
        'Danson — 2 blocks, 4 assists, 5 rebounds',
        'Shane — 5 assists, 1 block',
      ],
      highlights: ['The boys won the JAAC championship with a 69–27 victory over BSJ.'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-jaac-semifinal',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-24',
    opponent: 'ACS', scoreFor: 36, scoreAgainst: 15,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC semifinal',
      statLeaders: [
        'Hillary — 10 points, 4/7 FG, 2/2 FT, 1 block',
        'Chloe — 8 rebounds, 1 assist',
        'Samantha — 4 steals, 1 assist',
        'Hope — 2/2 FG, 1/1 FT, 1 assist, 1 block',
        'Aurel — 1 assist', 'Lenka — 1 assist, 1 block',
      ],
      highlights: ['The girls advanced to the JAAC final with a 36–15 win over ACS.'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-jaac-final',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-24',
    opponent: 'Santa Laurensia', scoreFor: 47, scoreAgainst: 22,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      tournament: 'JAAC', matchType: 'JAAC final',
      statLeaders: ['Hillary — 18 points, 6/11 FG, 4/4 FT', 'London — 5 assists', 'Samantha — 8 steals, 4 rebounds', 'Hillary & London — 2/3 three-pointers (67%)'],
      highlights: ['The girls won the JAAC championship with a 47–22 victory over Santa Laurensia.'],
    },
  },
];
