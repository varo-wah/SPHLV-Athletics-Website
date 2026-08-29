import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FALLBACK_TEAM_VISUAL_THEME,
  TEAM_VISUAL_THEMES,
  teamVisualThemeForCode,
  teamVisualThemeForName,
  teamVisualThemesForName,
} from '../config/teamVisualThemes';

test('uses blue for boys and maroon-red for girls across production teams', () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(TEAM_VISUAL_THEMES).map(([code, theme]) => [code, theme.accent]),
    ),
    {
      VBS: '#1050A0',
      VGS: '#C1121F',
      VBV: '#1050A0',
      VGV: '#C1121F',
      SMPBB: '#1050A0',
      SMPGB: '#C1121F',
    },
  );
});

test('resolves team codes and schedule aliases to the same themes', () => {
  assert.equal(teamVisualThemeForCode('vbv'), TEAM_VISUAL_THEMES.VBV);
  assert.equal(
    teamVisualThemeForName('SMA Girls Soccer').code,
    'VGS',
  );
  assert.equal(
    teamVisualThemeForName('SMP Boys Basketball A').code,
    'SMPBB',
  );
});

test('returns both gender themes for consolidated schedule rows', () => {
  assert.deepEqual(
    teamVisualThemesForName('Varsity Boys & Girls Volleyball').map(({ code }) => code),
    ['VBV', 'VGV'],
  );
  assert.deepEqual(
    teamVisualThemesForName('SMP Boys and Girls Basketball').map(({ code }) => code),
    ['SMPBB', 'SMPGB'],
  );
});

test('uses a neutral fallback for unknown and prototype teams', () => {
  assert.equal(teamVisualThemeForCode('VTF'), FALLBACK_TEAM_VISUAL_THEME);
  assert.equal(teamVisualThemeForName('JS 5-6 Mixed Basketball'), FALLBACK_TEAM_VISUAL_THEME);
  assert.deepEqual(teamVisualThemesForName('Unknown Team'), []);
});
