import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/SandboxUI.jsx', import.meta.url), 'utf8');

test('editor toolbar exposes undo, redo and delete actions', () => {
  assert.match(source, /Undo \(Ctrl\+Z\)/);
  assert.match(source, /Redo \(Ctrl\+Y\)/);
  assert.match(source, /deleteSelection/);
});

test('wire appearance supports colour and solid, dashed, dotted styles', () => {
  assert.match(source, /type="color"/);
  assert.match(source, /value="solid"/);
  assert.match(source, /value="dashed"/);
  assert.match(source, /value="dotted"/);
  assert.match(source, /strokeDasharray=\{wire\.style/);
});

test('component and whole-circuit transforms are present', () => {
  assert.match(source, /transformSelected/);
  assert.match(source, /mirrorWholeCircuit/);
  assert.match(source, /rotateWholeCircuit/);
  assert.match(source, /comp\.rotation/);
});

test('workspace provides circuit, schematic and code views', () => {
  assert.match(source, /setWorkspaceTab\('circuit'\)/);
  assert.match(source, /setWorkspaceTab\('schematic'\)/);
  assert.match(source, /setWorkspaceTab\('code'\)/);
  assert.match(source, /Code Editor/);
});

test('named design profiles persist components, wires and code in browser storage', () => {
  assert.match(source, /circuitweb-design-profiles/);
  assert.match(source, /saveNamedDesign/);
  assert.match(source, /loadNamedDesign/);
  assert.match(source, /deleteNamedDesign/);
  assert.match(source, /codeText/);
});
