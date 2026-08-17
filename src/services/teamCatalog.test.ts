import assert from 'node:assert/strict';
import test from 'node:test';
import { findTeam } from '../config/teamCatalog';

test('uses the A designation for both SMP basketball team titles', () => {
  assert.equal(
    findTeam('Basketball', 'SMP', 'Boys')?.displayName,
    'SMP Boys Basketball A',
  );
  assert.equal(
    findTeam('Basketball', 'SMP', 'Girls')?.displayName,
    'SMP Girls Basketball A',
  );
});
