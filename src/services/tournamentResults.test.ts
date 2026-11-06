import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TournamentResultsSection from '../components/TournamentResultsSection';
import AcscCompetitionPanel from '../components/AcscCompetitionPanel';
import { RESULT_SHEET_SOURCES } from '../config/sheets';
import { mergeGameDayResults } from './gamedayResults';

test('teams without an ACSC tournament have only domestic tournament cards', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection));

  assert.equal((html.match(/<article\b/g) || []).length, 2);
  assert.equal((html.match(/>Pending</g) || []).length, 2);
  for (const name of ['SPH Cup', 'JAAC']) {
    assert.ok(html.includes(`>${name}</p>`));
  }
  assert.doesNotMatch(html, /ACSC|Runner-up|0–2|BSJ|href=/);
});

test('JAAC cards distinguish completed finals from the last verified semifinal', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const cases = [
    ['soccer-sma-girls', 'Champions', 'Final: SPH-LV 2–1 STL'],
    ['volleyball-sma-boys', 'Runner-up', 'Final: SPH-LV 0–3 GJS'],
    ['volleyball-sma-girls', 'Finalist', 'Semifinal: SPH-LV 3–0 BSJ'],
    ['soccer-sma-boys', 'Semifinalist', 'Semifinal: SPH-LV 1–3 BSJ'],
  ];
  for (const [teamId, placement, score] of cases) {
    const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId, matches }));
    const jaac = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)]
      .map(match => match[0]).find(article => article.includes('>JAAC</p>'));
    assert.ok(jaac?.includes(`>${placement}<`) && jaac.includes(score));
  }
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

test('shows the confirmed soccer Cup and ACSC final placements', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId: 'soccer-sma-boys' }));
  assert.match(html, /Runner-up/);
  assert.match(html, /September 19, 2026/);
  assert.match(html, />ACSC<\/p>/);
  assert.equal((html.match(/>Pending</g) || []).length, 1);
  assert.match(html, />7th place</);
  assert.doesNotMatch(html, />In progress</);
});

test('boys volleyball Cup placement is explicitly provisional without an invented final or stale tournament notice', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId: 'volleyball-sma-boys' }));
  const cup = [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)]
    .map(match => match[0]).find(article => article.includes('>SPH Cup</p>'))!;
  assert.ok(cup);
  assert.equal(cup.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    'SPH Cup 3rd place · provisional September 2026 · Reported placement; awaiting confirmation.');
  assert.doesNotMatch(cup, /Final placement will be posted after the tournament|Final:|September \d{1,2},/);
});

test('renders reviewed basketball finals through the matches prop without inventing the girls match date', () => {
  const matches = mergeGameDayResults([], RESULT_SHEET_SOURCES);
  const boys = renderToStaticMarkup(createElement(TournamentResultsSection, {
    teamId: 'basketball-smp-boys', matches,
  }));
  assert.match(boys, />Champions</);
  assert.match(boys, /October 17, 2026 · Final: SPH-LV 43–30 Citra Berkat/);
  assert.equal((boys.match(/>Champions</g) || []).length, 2);
  assert.match(boys, /October 24, 2026 · Final: SPH-LV 69–27 BSJ/);
  assert.doesNotMatch(boys, /ACSC/);

  const girls = renderToStaticMarkup(createElement(TournamentResultsSection, {
    teamId: 'basketball-smp-girls', matches,
  }));
  assert.match(girls, />Runner-up</);
  assert.match(girls, /Match date to be confirmed · Final: SPH-LV 20–30 Tunas Muda/);
  assert.match(girls, />Champions</);
  assert.match(girls, /Match date to be confirmed · Final: SPH-LV 47–22 Santa Laurensia/);
  assert.doesNotMatch(girls, /October 18|ACSC/);
});


test('completed ACSC panels show final placements and SPH awards without stale upcoming fixtures', () => {
  const cases = [
    ['soccer-sma-boys', 'Solomon Schleper'],
    ['volleyball-sma-girls', 'Samantha Chai'],
    ['volleyball-sma-boys', 'Paul Schleper'],
  ];
  for (const [teamId, recipient] of cases) {
    const html = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId }));
    assert.match(html, /Final tournament standings/);
    assert.ok(html.includes(recipient));
    assert.doesNotMatch(html, /Confirmed SPH fixtures|Winner and loser labels are conditional/);
  }
  const boys = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId: 'volleyball-sma-boys' }));
  assert.match(boys, /Score unreported/);
  const girls = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId: 'volleyball-sma-girls' }));
  assert.match(girls, /Sportsmanship/);
  const soccer = renderToStaticMarkup(createElement(AcscCompetitionPanel, { teamId: 'soccer-sma-boys' }));
  assert.match(soccer, /Penalties: 1–3/);
});
