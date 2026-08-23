import test from 'node:test';
import assert from 'node:assert/strict';
import { jaacOpponentSchoolsForEvent, jaacSchoolByCode, jaacSchoolForName } from './jaacSchools';

test('matches KV from scheduled LV fixtures and keeps LV as the home identity', () => {
  assert.deepEqual(
    jaacOpponentSchoolsForEvent('KV', 'LV @ KV', 'LV @ KV').map((school) => school.code),
    ['KV'],
  );
  assert.equal(jaacSchoolByCode('LV').name, 'SPH Lippo Village');
  assert.equal(jaacSchoolByCode('LV').logo.includes('lv-circle.png'), true);
});

test('resolves result-team aliases without guessing unknown schools', () => {
  assert.equal(jaacSchoolForName('SPH-LV')?.code, 'LV');
  assert.equal(jaacSchoolForName('KV')?.code, 'KV');
  assert.equal(jaacSchoolForName('STL')?.code, 'SSL');
  assert.equal(jaacSchoolForName('SMK 31'), null);
});
