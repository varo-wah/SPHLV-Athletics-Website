import assert from 'node:assert/strict';
import test from 'node:test';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { getHomeTournamentRecap, HOME_RECAP_END, HOME_RECAP_START, isHomeRecapVisible } from '../data/homeTournamentRecap';
import { mergeGameDayResults } from './gamedayResults';

test('Home recap appears October 26 and expires after November 16 in Jakarta', () => {
  assert.equal(HOME_RECAP_START, Date.parse('2026-10-25T17:00:00Z'));
  assert.equal(HOME_RECAP_END, Date.parse('2026-11-16T17:00:00Z'));
  assert.equal(isHomeRecapVisible(HOME_RECAP_START - 1), false);
  assert.equal(isHomeRecapVisible(HOME_RECAP_START), true);
  assert.equal(isHomeRecapVisible(Date.parse('2026-11-16T23:59:59+07:00')), true);
  assert.equal(isHomeRecapVisible(HOME_RECAP_END), false);
  assert.equal(isHomeRecapVisible(Number.NaN), false);
});

test('Home recap uses final tournament outcomes and SPH awards without inventing match dates', () => {
  const { jaac, acsc } = getHomeTournamentRecap();
  assert.deepEqual(jaac.map(entry => [entry.teamId, entry.outcome, entry.detail]), [
    ['basketball-smp-boys', 'Champions', 'Final: SPH 69–27 BSJ'],
    ['basketball-smp-girls', 'Champions', 'Final: SPH 47–22 Santa Laurensia'],
  ]);
  assert.deepEqual(acsc.map(entry => [entry.teamId, entry.outcome]), [
    ['soccer-sma-boys', '7th place'],
    ['volleyball-sma-girls', '6th place'],
    ['volleyball-sma-boys', '7th place'],
  ]);
  assert.match(acsc[0].detail, /Solomon Schleper/);
  assert.match(acsc[1].detail, /Sportsmanship Award/);
  assert.match(acsc[1].detail, /Samantha Chai/);
  assert.match(acsc[2].detail, /Paul Schleper/);
  assert.equal(jaac[0].label, 'SMP Boys Basketball A');
  assert.equal(acsc[0].label, 'Varsity Boys Soccer');
  assert.doesNotMatch(JSON.stringify({ jaac, acsc }), /October 24|2026-10-24|69–25/);
});

test('a completed reviewed final correction supersedes the fallback but older and unfinished fixtures do not', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const final = matches.find(match => match.reviewedFixtureId === '2026-boys-basketball-jaac-final')!;
  const corrected = { ...final, scoreFor: 25, scoreAgainst: 30 };
  const recap = getHomeTournamentRecap([corrected, ...matches]);
  assert.equal(recap.jaac[0].outcome, 'Runner-up');
  assert.equal(recap.jaac[0].detail, 'Final: SPH 25–30 BSJ');
  assert.equal(getHomeTournamentRecap([{ ...corrected, status: 'Upcoming' }]).jaac[0].detail, 'Final: SPH 69–27 BSJ');
  assert.equal(getHomeTournamentRecap([{ ...corrected, scoreFor: null }]).jaac[0].detail, 'Final: SPH 69–27 BSJ');
  const previousBsj = matches.filter(match => match.opponent === 'BSJ' && match.date === '2026-09-26');
  assert.equal(getHomeTournamentRecap(previousBsj).jaac[0].detail, 'Final: SPH 69–27 BSJ');
});
