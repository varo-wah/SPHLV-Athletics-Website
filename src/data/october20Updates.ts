import type { GameDayUpdate } from './gamedayUpdates';

// Reviewed October 20: official JAAC football workbook plus Teams GameDay Summaries.
// Empty dates are intentional: report dates do not establish match dates.
// See docs/gameday-updates-20261020.md for sources and unresolved details.
export const OCTOBER_20_UPDATES: GameDayUpdate[] = [
  {
    teamId: 'soccer-sma-boys', date: '2026-10-02', opponent: 'BSJ', scoreFor: 1, scoreAgainst: 1,
    newFixture: { time: '16:00', venue: 'BSJ', locationType: 'Away' },
    details: { matchType: 'JAAC' },
  },
  {
    teamId: 'soccer-sma-boys', date: '2026-10-17', reportedDate: '2026-10-18', opponent: 'ACS', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '08:00', venue: 'SPH LV', locationType: 'Home' },
    details: {
      matchType: 'JAAC', statLeaders: ['Solomon Schleper — 1 goal', 'Troy Biantoro — 1 goal'],
      highlights: ['Solomon and Troy scored in the 2–1 win over ACS.'],
    },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-09-05', opponent: 'GJS', scoreFor: 6, scoreAgainst: 0,
    newFixture: { time: '11:00', venue: 'SPH LV', locationType: 'Home' },
    details: { matchType: 'JAAC' },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-10-02', opponent: 'BSJ', scoreFor: 0, scoreAgainst: 2,
    newFixture: { time: '16:00', venue: 'BSJ', locationType: 'Away' },
    details: { matchType: 'JAAC' },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-10-13', opponent: 'ACS', scoreFor: 1, scoreAgainst: 0,
    newFixture: { time: '16:00', venue: 'SPH LV', locationType: 'Home' },
    details: { matchType: 'JAAC' },
  },
  {
    teamId: 'soccer-sma-girls', date: '2026-10-19', opponent: 'STL', scoreFor: 1, scoreAgainst: 2,
    // The workbook lists STL as home, but SPH-LV as venue. Preserve both fields.
    newFixture: { time: '16:00', venue: 'SPH LV', locationType: 'Away' },
    details: { matchType: 'JAAC' },
  },
  {
    fixtureId: '2026-boys-basketball-cup-smp6',
    teamId: 'basketball-smp-boys', date: '2026-10-15', reportedDate: '2026-10-15', opponent: 'SMP Negeri 6', scoreFor: 69, scoreAgainst: 10,
    newFixture: { time: '', venue: 'SPH LV', locationType: 'Home' },
    details: {
      matchType: 'SPH Cup',
      statLeaders: [
        'Denzel — 18 points, 7/9 FG (77.8%), 2/3 three-pointers (66.7%), 2/2 FT',
        'Matthew — 6 rebounds', 'Jacob — 6 rebounds', 'Coby — 7 assists', 'Rainer — 7 steals',
        'Danson — 1 block', 'Jacob — 1 block', 'Denzel — 1 block',
      ],
      highlights: ['SMP LV A opened the Cup with a 69–10 win over SMP Negeri 6.', 'LV shot 33.3% from three-point range and held SMP Negeri 6 scoreless in the fourth quarter.'],
    },
  },
  {
    fixtureId: '2026-boys-basketball-cup-sdhdm',
    teamId: 'basketball-smp-boys', date: '2026-10-15', reportedDate: '2026-10-15', opponent: 'SDH DM', scoreFor: 51, scoreAgainst: 24,
    newFixture: { time: '', venue: 'SPH LV', locationType: 'Home' },
    details: {
      matchType: 'SPH Cup',
      statLeaders: [
        'Coby — 19 points, 4 assists, 5 rebounds, 9/13 FG (69.2%), 1/2 three-pointers',
        'Denzel — 5 steals', 'Danson — 10 points, 5/6 FG (83.3%)', 'Jacob — 7 rebounds, 2/2 FT',
        'Eduardo (name as reported) — 2/2 FT', 'Shane — 1 block', 'Coby — 1 block',
      ],
      highlights: ['The second win of the evening sent SMP LV A into Saturday’s semifinals.', 'LV made all four free throws.'],
    },
  },
  {
    fixtureId: '2026-boys-basketball-cup-semifinal',
    teamId: 'basketball-smp-boys', date: '2026-10-17', reportedDate: '2026-10-17', opponent: 'Tunas Muda', scoreFor: 50, scoreAgainst: 7,
    newFixture: { time: '', venue: 'SPH LV', locationType: 'Home' },
    details: {
      matchType: 'SPH Cup semifinal',
      statLeaders: [
        'Coby — 17 points, 4 rebounds, 6/11 FG (54.5%), 2/3 three-pointers (66.7%), 3/4 FT',
        'Denzel — 5 steals, 4 assists', 'Danson — 3 blocks', 'Shane — 1/2 three-pointers', 'Matthew — 3/4 FG',
      ],
      highlights: ['LV led 25–2 after the first quarter and advanced to the Cup final.', 'The team recorded 20 steals, committed five turnovers, and shot 35.7% from three-point range.'],
    },
  },
  {
    fixtureId: '2026-boys-basketball-cup-final',
    teamId: 'basketball-smp-boys', date: '2026-10-17', reportedDate: '2026-10-17', opponent: 'Citra Berkat', scoreFor: 43, scoreAgainst: 30,
    newFixture: { time: '', venue: 'SPH LV', locationType: 'Home' },
    details: {
      matchType: 'SPH Cup final',
      statLeaders: [
        'Coby — 26 points, 7 rebounds, 3 assists, 10/16 FG (62.5%), 6/8 FT',
        'Rainer — 6 points, 3/4 FG', 'Eduardo (name as reported) — 2 steals', 'Shane — 2/2 three-pointers, 3/3 FG',
      ],
      highlights: ['SMP LV A won the SPH Cup with a 43–30 victory over Citra Berkat.', 'A 13–1 third quarter helped LV take control despite 12.5% team shooting from three-point range.'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-cup-atisa',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-16', opponent: 'Atisa', scoreFor: 40, scoreAgainst: 5,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'SPH Cup',
      statLeaders: [
        'Samantha — 13 points, 6/11 FG (55%), 1/2 three-pointers, 6 steals',
        'Lenka — 4 rebounds, 1 block', 'Hope — 4/7 FG (57%), 1/1 three-pointers',
        'Chloe — 1/2 FT', 'Marianne — 1/2 FT', 'Hillary — 2 assists',
      ],
      highlights: ['The girls won their opening SPH Cup game 40–5 against Atisa.'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-cup-smp6',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-16', opponent: 'SMP 6', scoreFor: 51, scoreAgainst: 4,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'SPH Cup',
      statLeaders: [
        'Hillary — 12 points, 5/6 FG (83%), 2/2 FT, 3 rebounds', 'London — 2/2 three-pointers',
        'Marianne — 5 rebounds', 'Lindsay — 2 assists', 'Chloe — 1/1 FG, 2 blocks',
      ],
      highlights: ['The 51–4 win secured a place in the semifinals.', 'LV shot 23/60 from the field (38%) and 3/4 from three-point range (75%).'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-cup-semifinal',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-18', opponent: 'Citra Berkat', scoreFor: 31, scoreAgainst: 12,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'SPH Cup semifinal',
      statLeaders: [
        'Hillary — 15 points, 6/13 FG (46%), 1/3 three-pointers (33%), 2/2 FT, 4 rebounds, 8 steals',
        'Hope — 10 points, 4 rebounds, 1 assist, 3 steals, 1 block', 'London — 2/2 FT, 2 assists',
        'Samantha — 4 rebounds, 2 assists',
      ],
      highlights: ['A 31–12 semifinal win over Citra Berkat sent the girls to the SPH Cup final.'],
    },
  },
  {
    fixtureId: '2026-girls-basketball-cup-final',
    teamId: 'basketball-smp-girls', date: '', reportedDate: '2026-10-18', opponent: 'Tunas Muda', scoreFor: 20, scoreAgainst: 30,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'SPH Cup final',
      statLeaders: [
        'Samantha — 5 points, 4 rebounds, 1 assist, 2/2 FT', 'Maggie — 4 rebounds, 1/2 FG',
        'Lenka — 1/2 FG', 'London — 1/1 three-pointers', 'Hope — 5 rebounds, 2 steals', 'Hillary — 2 assists, 2 blocks',
      ],
      highlights: ['The girls finished SPH Cup runner-up after a 20–30 final against Tunas Muda.', 'LV made two of five three-point attempts (40%).'],
    },
  },
  {
    fixtureId: '2026-girls-volleyball-oct-jis-jv',
    teamId: 'volleyball-sma-girls', date: '', reportedDate: '2026-10-17', opponent: 'JIS JV', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      setScores: ['20–25', '26–24', '17–16'], statLeaders: ['Karin — 3 kills', 'Sammy — 4 setter dumps'],
      highlights: ['LV won the deciding set 17–16 under a 17-point cap.', 'Competition to be confirmed.'],
    },
  },
  {
    fixtureId: '2026-girls-volleyball-oct-cubic',
    teamId: 'volleyball-sma-girls', date: '', reportedDate: '2026-10-17', opponent: 'Cubic', scoreFor: 0, scoreAgainst: 2,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      setScores: ['15–25', '20–25'], statLeaders: ['Christa — 2 blocks', 'Evie — 5 kills in one set'],
      highlights: ['Liberos Shana and Louisa contributed key saves.', 'Competition to be confirmed.'],
    },
  },
  {
    fixtureId: '2026-girls-volleyball-oct-popb',
    teamId: 'volleyball-sma-girls', date: '', reportedDate: '2026-10-17', opponent: 'POPB', scoreFor: 1, scoreAgainst: 2,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      setScores: ['19–25', '25–15', '8–15'],
      statLeaders: ['Sam Chai — 4 kills', 'Trisha — 4 aces in one set', 'Abbie — 1 block', 'Christa — 1 block'],
      highlights: ['LV took the second set 25–15 before losing the deciding set.', 'Competition to be confirmed.'],
    },
  },
  {
    fixtureId: '2026-girls-volleyball-oct-third-place',
    teamId: 'volleyball-sma-girls', date: '', reportedDate: '2026-10-17', opponent: 'JIS', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'Third-place match', setScores: ['25–21', '23–25', '15–13'],
      statLeaders: ['Trisha — 5 kills', 'Sam Chai — 5 kills', 'Christa — 4 aces, 2 “dunks” (as reported)', 'Sammy — 4 setter dumps'],
      highlights: ['The girls secured third place with a 2–1 win over JIS.', 'Competition to be confirmed.'],
    },
  },
  {
    fixtureId: '2026-boys-volleyball-oct-jis-jv',
    teamId: 'volleyball-sma-boys', date: '', reportedDate: '2026-10-16', opponent: 'JIS JV', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: { setScores: ['24–26', '25–20', '15–10'], highlights: ['LV recovered from a first-set loss to win 2–1.', 'Competition to be confirmed.'] },
  },
  {
    fixtureId: '2026-boys-volleyball-oct-cubic',
    teamId: 'volleyball-sma-boys', date: '', reportedDate: '2026-10-16', opponent: 'Cubic', scoreFor: 0, scoreAgainst: 2,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: { setScores: ['13–25', '17–25'], highlights: ['Competition to be confirmed.'] },
  },
  {
    fixtureId: '2026-boys-volleyball-oct-popb',
    teamId: 'volleyball-sma-boys', date: '', reportedDate: '2026-10-18', opponent: 'POPB', scoreFor: 2, scoreAgainst: 1,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: { setScores: ['25–14', '17–25', '15–5'], highlights: ['LV won the deciding set 15–5 against POPB.', 'Competition to be confirmed.'] },
  },
  {
    fixtureId: '2026-boys-volleyball-oct-third-place',
    teamId: 'volleyball-sma-boys', date: '', reportedDate: '2026-10-18', opponent: 'POPB', scoreFor: 2, scoreAgainst: 0,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      matchType: 'Third-place match', setScores: ['25–23', '25–17'],
      highlights: ['The boys secured third place with a straight-set win over POPB.', 'Competition to be confirmed.'],
    },
  },
  {
    fixtureId: '2026-boys-basketball-st-john',
    teamId: 'basketball-smp-boys', date: '', reportedDate: '2026-09-29', opponent: 'St John', scoreFor: 52, scoreAgainst: 43,
    newFixture: { time: '', venue: '', locationType: 'TBD' },
    details: {
      statLeaders: [
        'Coby — 17 points, 14 rebounds, 5 assists', 'Rainer — 11 points, 5/6 FG (83.3%)',
        'Denzel — 11 points, 6 steals, 1/4 three-pointers', 'Matthew — 1 block', 'Jacob — 1 block',
      ],
      highlights: ['A strong second-quarter defense helped SMP LV A beat St John 52–43 after a close first quarter.'],
    },
  },
];
