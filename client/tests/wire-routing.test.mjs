import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWirePath, findNearestWireInsertion } from '../src/electrical/wireRouting.js';

test('builds a path through every user-placed bend node', () => {
  assert.equal(
    buildWirePath({ x: 0, y: 0 }, { x: 30, y: 20 }, [{ x: 10, y: 0 }, { x: 10, y: 20 }]),
    'M 0 0 L 10 0 L 10 20 L 30 20'
  );
});

test('projects a click onto the closest horizontal segment', () => {
  const result = findNearestWireInsertion({ x: 0, y: 0 }, [], { x: 100, y: 0 }, { x: 40, y: 6 });
  assert.equal(result.segmentIndex, 0);
  assert.deepEqual(result.point, { x: 40, y: 0 });
  assert.equal(result.distance, 6);
});

test('returns insertion index after existing bend nodes', () => {
  const result = findNearestWireInsertion(
    { x: 0, y: 0 },
    [{ x: 20, y: 0 }, { x: 20, y: 40 }],
    { x: 80, y: 40 },
    { x: 50, y: 43 }
  );
  assert.equal(result.segmentIndex, 2);
  assert.deepEqual(result.point, { x: 50, y: 40 });
});

test('clamps projections to the segment endpoints', () => {
  const result = findNearestWireInsertion({ x: 0, y: 0 }, [], { x: 10, y: 0 }, { x: -5, y: 4 });
  assert.deepEqual(result.point, { x: 0, y: 0 });
  assert.equal(result.distance, Math.sqrt(41));
});
