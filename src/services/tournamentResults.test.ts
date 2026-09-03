import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TournamentResultsSection from '../components/TournamentResultsSection';

test('all three tournament placements start pending without stale scores or sport-specific links', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection));

  assert.equal((html.match(/<article\b/g) || []).length, 3);
  assert.equal((html.match(/>Pending</g) || []).length, 3);
  for (const name of ['SPH Cup', 'JAAC', 'ACSC']) {
    assert.ok(html.includes(`>${name}</p>`));
  }
  assert.doesNotMatch(html, /Runner-up|0–2|BSJ|href=/);
});

test('team standings include the shared cards without sport, division, or gender restrictions', () => {
  const source = readFileSync(new URL('../screens/TeamPageScreen.tsx', import.meta.url), 'utf8');

  assert.match(source, /\{activeSection === 'standings' && <TournamentResultsSection \/>\}/);
  assert.doesNotMatch(source, /varsityBoysSoccerTournamentResults/);
});
