import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TournamentResultsSection from '../components/TournamentResultsSection';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { mergeGameDayResults } from './gamedayResults';

test('all three tournament placements start pending without stale scores or sport-specific links', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection));

  assert.equal((html.match(/<article\b/g) || []).length, 3);
  assert.equal((html.match(/>Pending</g) || []).length, 3);
  for (const name of ['SPH Cup', 'JAAC', 'ACSC']) {
    assert.ok(html.includes(`>${name}</p>`));
  }
  assert.doesNotMatch(html, /Runner-up|0–2|BSJ|href=/);
});

test('SMP basketball shows Cup and JAAC cards without an ACSC card or heading', () => {
  for (const teamId of ['basketball-smp-boys', 'basketball-smp-girls']) {
    const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId }));
    assert.equal((html.match(/<article\b/g) || []).length, 2);
    assert.equal((html.match(/>Pending</g) || []).length, 2);
    assert.match(html, />SPH Cup<\/p>/);
    assert.match(html, />JAAC<\/p>/);
    assert.doesNotMatch(html, /ACSC/);
  }
});

test('shows only the confirmed boys soccer cup placement', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId: 'soccer-sma-boys' }));
  assert.match(html, /Runner-up/);
  assert.match(html, /September 19, 2026/);
  assert.match(html, />ACSC<\/p>/);
  assert.equal((html.match(/>Pending</g) || []).length, 2);
});

test('renders reviewed basketball finals through the matches prop without inventing the girls match date', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const boys = renderToStaticMarkup(createElement(TournamentResultsSection, {
    teamId: 'basketball-smp-boys', matches,
  }));
  assert.match(boys, />Champions</);
  assert.match(boys, /October 17, 2026 · Final: SPH-LV 43–30 Citra Berkat/);
  assert.equal((boys.match(/>Pending</g) || []).length, 1);
  assert.doesNotMatch(boys, /ACSC/);

  const girls = renderToStaticMarkup(createElement(TournamentResultsSection, {
    teamId: 'basketball-smp-girls', matches,
  }));
  assert.match(girls, />Runner-up</);
  assert.match(girls, /Match date to be confirmed · Final: SPH-LV 20–30 Tunas Muda/);
  assert.equal((girls.match(/>Pending</g) || []).length, 1);
  assert.doesNotMatch(girls, /October 18|ACSC/);
});
