import assert from 'node:assert/strict';
import test from 'node:test';
import { LAYOUT_PREFERENCE_KEY, readLayoutPreference, saveLayoutPreference } from './layoutPreference';

test('new visitors and unsupported stored values use wide view', () => {
  for (const value of [null, '', 'desktop', 'true']) {
    assert.equal(readLayoutPreference({ getItem: () => value }), 'wide');
  }
});

test('a chosen layout survives reload and can be switched back', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
  };
  saveLayoutPreference('phone', storage);
  assert.equal(values.get(LAYOUT_PREFERENCE_KEY), 'phone');
  assert.equal(readLayoutPreference(storage), 'phone');
  saveLayoutPreference('wide', storage);
  assert.equal(readLayoutPreference(storage), 'wide');
});

test('restricted storage does not prevent the website from opening or switching views', () => {
  assert.equal(readLayoutPreference({ getItem() { throw new Error('Storage disabled'); } }), 'wide');
  assert.doesNotThrow(() => saveLayoutPreference('phone', { setItem() { throw new Error('Storage disabled'); } }));
});
