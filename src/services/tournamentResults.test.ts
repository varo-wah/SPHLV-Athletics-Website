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

test('team standings pass the team identity to the shared tournament cards', () => {
  const source = readFileSync(new URL('../screens/TeamPageScreen.tsx', import.meta.url), 'utf8');

  assert.match(source, /\{activeSection === 'standings' && <TournamentResultsSection teamId=\{team\?\.id\} \/>\}/);
  assert.doesNotMatch(source, /varsityBoysSoccerTournamentResults/);
});

test('SMP teams show Cup and JAAC without ACSC in the cards or heading', () => {
  for (const teamId of ['basketball-smp-boys', 'basketball-smp-girls']) {
    const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId }));
    assert.equal((html.match(/<article\b/g) || []).length, 2);
    assert.match(html, />SPH Cup<\/p>/);
    assert.match(html, />JAAC<\/p>/);
    assert.doesNotMatch(html, /ACSC/);
  }
});

test('shows only the confirmed boys soccer cup placement', () => {
  const html = renderToStaticMarkup(createElement(TournamentResultsSection, { teamId: 'soccer-sma-boys' }));
  assert.match(html, /Runner-up/);
  assert.match(html, /September 19, 2026/);
  assert.equal((html.match(/>Pending</g) || []).length, 2);
});
