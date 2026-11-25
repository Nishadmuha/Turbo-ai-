import test from 'node:test';
import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import { createBuildController } from './rebuild.mjs';

test('local build is disabled unless explicitly enabled', () => {
  let called = false;
  const controller = createBuildController({ run: () => { called = true; } });
  assert.equal(controller.getStatus().enabled, false);
  assert.throws(() => controller.start(), error => error.status === 403);
  assert.equal(called, false);
});

test('single build, successful status, timestamps, and safe state snapshots', async () => {
  let complete;
  let calls = 0;
  const controller = createBuildController({ enabled: true, run: () => { calls++; return new Promise(resolve => { complete = resolve; }); } });
  const started = controller.start();
  assert.equal(started.state, 'running');
  assert.ok(started.started_at);
  assert.throws(() => controller.start(), error => error.status === 409);
  started.state = 'failed';
  assert.equal(controller.getStatus().state, 'running');
  await setImmediate();
  assert.equal(calls, 1);
  complete();
  await setImmediate();
  assert.equal(controller.getStatus().state, 'succeeded');
  assert.ok(controller.getStatus().finished_at);
});

test('build failures expose only a fixed sanitized message', async () => {
  const controller = createBuildController({ enabled: true, run: () => { throw new Error('SECRET_DATABASE_URI'); } });
  controller.start();
  await setImmediate();
  const result = controller.getStatus();
  assert.equal(result.state, 'failed');
  assert.ok(result.finished_at);
  assert.equal(JSON.stringify(result).includes('SECRET_DATABASE_URI'), false);
  assert.ok(result.message.length < 200);
});
