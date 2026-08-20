import test from 'node:test';
import assert from 'node:assert/strict';
import { jaacOpponentSchoolsForEvent, jaacSchoolByCode } from './jaacSchools';

test('matches KV from scheduled LV fixtures and keeps LV as the home identity', () => {
  assert.deepEqual(
    jaacOpponentSchoolsForEvent('KV', 'LV @ KV', 'LV @ KV').map((school) => school.code),
    ['KV'],
  );
  assert.equal(jaacSchoolByCode('LV').name, 'SPH Lippo Village');
  assert.equal(jaacSchoolByCode('LV').logo.includes('lv.jpeg'), true);
});
