import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FALLBACK_TEAM_VISUAL_THEME,
  TEAM_VISUAL_THEMES,
  teamVisualThemeForCode,
  teamVisualThemeForName,
  teamVisualThemesForName,
} from '../config/teamVisualThemes';

test('defines the approved accent for every production team', () => {
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(TEAM_VISUAL_THEMES).map(([code, theme]) => [code, theme.accent]),
    ),
    {
      VBS: '#C1121F',
      VGS: '#603090',
      VBV: '#1050A0',
      VGV: '#C02060',
      SMPBB: '#C2410C',
      SMPGB: '#008080',
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
