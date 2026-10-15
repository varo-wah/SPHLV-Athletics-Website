import assert from 'node:assert/strict';
import test from 'node:test';
import type { SheetMatch } from '../services/parsers';
import { reportsForPlayer, resolveReportedPlayer } from './playerReports';

const roster = ['Kenzo Stanley', 'Kenzo Tjokrokusumo', 'Jared Lim', 'Isabelle Chendra'];
const match = (overrides: Partial<SheetMatch> = {}): SheetMatch => ({
  id: '1', sourceId: 'source', teamId: 'volleyball-sma-boys', pageId: 'page',
  sport: 'Volleyball', sportKey: 'Volleyball', level: 'SMA', genderGroup: 'Boys', tournament: 'Season',
  date: '2026-10-02', time: '', homeTeam: 'SPH LV', awayTeam: 'BSJ', opponent: 'BSJ',
  locationType: 'Home', venue: '', status: 'Finished', result: 'W', homeScore: 2, awayScore: 0,
  scoreFor: 2, scoreAgainst: 0, notes: '', set1For: null, set1Against: null,
  set2For: null, set2Against: null, set3For: null, set3Against: null, ...overrides,
});

test('matches exact names and unique first names without guessing ambiguous names', () => {
  assert.equal(resolveReportedPlayer('Jared (S)', roster, 'volleyball-sma-boys'), 'Jared Lim');
  assert.equal(resolveReportedPlayer('Kenzo Stanley (#8)', roster, 'soccer-sma-boys'), 'Kenzo Stanley');
  assert.equal(resolveReportedPlayer('Kenzo', roster, 'soccer-sma-boys'), undefined);
  assert.equal(resolveReportedPlayer('Jared and Kenzo', roster, 'soccer-sma-boys'), undefined);
  assert.equal(resolveReportedPlayer('Ja', roster, 'soccer-sma-boys'), undefined);
  assert.equal(resolveReportedPlayer('Isa', roster, 'soccer-sma-girls'), 'Isabelle Chendra');
  assert.equal(resolveReportedPlayer('Isa', roster, 'volleyball-sma-boys'), undefined);
});

test('keeps reported wording and filters other teams and unnamed team stats', () => {
  const reports = reportsForPlayer('Jared Lim', roster, 'volleyball-sma-boys', [
    match({ statLeaders: ['Jared Lim (S): 5 aces in one set', 'Jared — 3 kills', 'Team — 8 aces', 'Kenzo — 1 goal'] }),
    match({ teamId: 'other-team', statLeaders: ['Jared — 99 aces'] }),
  ]);
  assert.equal(reports.length, 1);
  assert.deepEqual(reports[0].stats, ['5 aces in one set', '3 kills']);
  assert.deepEqual(reportsForPlayer('Kenzo Stanley', roster, 'volleyball-sma-boys', [match({ statLeaders: ['Kenzo — 1 goal'] })]), []);
});

test('deduplicates shared doubleheader stats and preserves their scope', () => {
  const stats = ['Doubleheader ace highlights:', 'Jared — 5 aces in one set'];
  const reports = reportsForPlayer('Jared Lim', roster, 'volleyball-sma-boys', [
    match({ opponent: 'ACS', statLeaders: stats }),
    match({ id: '2', opponent: 'GJS', statLeaders: stats }),
  ]);
  assert.equal(reports.length, 1);
  assert.equal(reports[0].sharedReport, true);
  assert.deepEqual(reports[0].opponents, ['ACS', 'GJS']);
  assert.deepEqual(reports[0].stats, ['5 aces in one set']);
});

test('keeps identical numbers from distinct games separate and sorts newest first', () => {
  const stats = ['Jared — 3 aces'];
  const reports = reportsForPlayer('Jared Lim', roster, 'volleyball-sma-boys', [
    match({ date: '2026-09-26', statLeaders: stats }),
    match({ opponent: 'ACS', statLeaders: stats }),
    match({ opponent: 'GJS', statLeaders: stats }),
  ]);
  assert.equal(reports.length, 3);
  assert.equal(reports[0].date, '2026-10-02');
  assert.equal(reports[2].date, '2026-09-26');
});
