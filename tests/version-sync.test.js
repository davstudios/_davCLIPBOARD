import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const packageJson=JSON.parse(fs.readFileSync('package.json','utf8'));
const tauri=JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json','utf8'));
const cargo=fs.readFileSync('src-tauri/Cargo.toml','utf8');
const main=fs.readFileSync('src/main.js','utf8');
const vite=fs.readFileSync('vite.config.js','utf8');
const rustVersion=cargo.match(/^version\s*=\s*"([^"]+)"/m)?.[1];

test('versioni tecniche sincronizzate',()=>{
  assert.equal(packageJson.version,'1.1.0');
  assert.equal(tauri.version,packageJson.version);
  assert.equal(rustVersion,packageJson.version);
});

test('interfaccia legge versione da Tauri',()=>assert.match(main,/getVersion/));
test('Vite usa Oxc e ignora src-tauri',()=>{assert.match(vite,/minify:'oxc'/);assert.match(vite,/src-tauri/);});
