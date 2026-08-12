import assert from 'node:assert/strict';
import test from 'node:test';
import { isColorTheme } from './theme';

test('accepts only supported persisted theme values', () => {
  assert.equal(isColorTheme('light'), true);
  assert.equal(isColorTheme('dark'), true);
  assert.equal(isColorTheme('system'), false);
  assert.equal(isColorTheme(null), false);
});
