import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const packageLock = JSON.parse(readFileSync(resolve(root, 'package-lock.json'), 'utf8'));
const tauri = JSON.parse(readFileSync(resolve(root, 'src-tauri/tauri.conf.json'), 'utf8'));
const cargoText = readFileSync(resolve(root, 'src-tauri/Cargo.toml'), 'utf8');
const cargoVersion = cargoText.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
const cargoLockText = readFileSync(resolve(root, 'src-tauri/Cargo.lock'), 'utf8');
const cargoLockVersion = cargoLockText.match(/\[\[package\]\]\r?\nname = "davclipboard"\r?\nversion = "([^"]+)"/)?.[1];
const mainSource = readFileSync(resolve(root, 'src/main.js'), 'utf8');
const vite = readFileSync(resolve(root, 'vite.config.js'), 'utf8');

test('versioni tecniche sincronizzate',()=>{
  assert.equal(packageJson.version,'26.10.1');
  assert.equal(packageLock.version,packageJson.version);
  assert.equal(packageLock.packages[''].version,packageJson.version);
  assert.equal(tauri.version,packageJson.version);
  assert.equal(cargoVersion,packageJson.version);
  assert.equal(cargoLockVersion,packageJson.version);
});

test('Cargo.lock resta leggibile con terminatori Windows CRLF',()=>{
  const windowsCargoLock=cargoLockText.replace(/(?<!\r)\n/g,'\r\n');
  const windowsVersion=windowsCargoLock.match(/\[\[package\]\]\r?\nname = "davclipboard"\r?\nversion = "([^"]+)"/)?.[1];
  assert.equal(windowsVersion,packageJson.version);
});

test('interfaccia legge versione da Tauri',()=>{
  assert.match(mainSource,/getVersion/);
  assert.doesNotMatch(mainSource,/version:'\d+\.\d+\.\d+'/);
});
test('Vite usa Oxc e ignora src-tauri',()=>{assert.match(vite,/minify:'oxc'/);assert.match(vite,/src-tauri/);});
