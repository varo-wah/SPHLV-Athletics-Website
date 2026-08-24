import assert from 'node:assert/strict';
import test from 'node:test';
import {
  APPLE_EASE,
  LIST_STAGGER_SECONDS,
  PAGE_TRANSITION,
  PRESS_SCALE,
  SOFT_SPRING,
  STANDARD_SPRING,
  staggerDelay,
} from '../config/motion';

test('motion presets stay restrained and consistent', () => {
  assert.deepEqual(APPLE_EASE, [0.22, 1, 0.36, 1]);
  assert.equal(PAGE_TRANSITION.duration, 0.28);
  assert.equal(PRESS_SCALE, 0.98);
  assert.equal(STANDARD_SPRING.stiffness, 420);
  assert.equal(STANDARD_SPRING.damping, 36);
  assert.equal(SOFT_SPRING.stiffness, 300);
  assert.equal(SOFT_SPRING.damping, 32);
});

test('list staggering stops increasing after six items', () => {
  assert.equal(staggerDelay(0), 0);
  assert.equal(staggerDelay(5), LIST_STAGGER_SECONDS * 5);
  assert.equal(staggerDelay(12), LIST_STAGGER_SECONDS * 5);
});
