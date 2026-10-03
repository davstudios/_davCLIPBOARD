import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const packageJson=JSON.parse(fs.readFileSync('package.json','utf8'));
const tauri=JSON.parse(fs.readFileSync('src-tauri/tauri.conf.json','utf8'));
const cargo=fs.readFileSync('src-tauri/Cargo.toml','utf8');
const launcher=fs.readFileSync('RUN-WINDOWS.bat','utf8');
const vite=fs.readFileSync('vite.config.js','utf8');
const rust=fs.readFileSync('src-tauri/src/lib.rs','utf8');
const capability=fs.readFileSync('src-tauri/capabilities/default.json','utf8');

test('Windows launcher always refreshes dependencies before desktop start',()=>{const install=launcher.search(/npm install --no-audit --no-fund/i);const desktop=launcher.search(/npm run desktop/i);assert.ok(install>=0);assert.ok(desktop>install);assert.doesNotMatch(launcher,/if not exist [^\n]*node_modules/i);});
test('Vite development configuration preserves Tauri isolation',()=>{assert.match(vite,/const host = process\.env\.TAURI_DEV_HOST/);assert.match(vite,/src-tauri/);assert.match(vite,/strictPort:true/);});
test('frontend and Tauri dependency versions match the proven base',()=>{assert.equal(packageJson.dependencies['@tauri-apps/api'],'2.11.1');assert.equal(packageJson.devDependencies['@tauri-apps/cli'],'2.11.4');assert.equal(packageJson.devDependencies.vite,'8.2.2');});
test('stable metadata and required files are coherent',()=>{const rustVersion=cargo.match(/^version\s*=\s*"([^"]+)"/m)?.[1];assert.equal(packageJson.version,'26.10.1');assert.equal(tauri.version,packageJson.version);assert.equal(rustVersion,packageJson.version);for(const path of ['README.md','CHANGELOG.md','src-tauri/icons/icon.ico'])assert.equal(fs.existsSync(path),true);});
test('official package metadata follows _davstudios standard',()=>{assert.equal(packageJson.author,'_davstudios');assert.equal(packageJson.license,'MIT');assert.equal(packageJson.homepage,'https://davstudios.it');assert.equal(tauri.identifier,'studio.dav.clipboard');assert.equal(tauri.bundle.publisher,'_davstudios');assert.equal(tauri.bundle.homepage,'https://davstudios.it');assert.equal(tauri.bundle.license,'MIT');assert.equal(tauri.bundle.licenseFile,'../LICENSE');assert.equal(tauri.bundle.copyright,'© 2026 _davstudios');assert.equal(tauri.bundle.linux.deb.section,'utils');assert.equal(tauri.bundle.linux.deb.priority,'optional');for(const path of ['LICENSE','PACKAGE-METADATA.md'])assert.equal(fs.existsSync(path),true);});
test('clipboard persistence is local file storage',()=>{assert.match(rust,/app_data_dir/);assert.match(rust,/clipboard-history\.json/);assert.match(rust,/fs::write/);});
test('clipboard permissions are limited to text read and write',()=>{assert.match(capability,/clipboard-manager:allow-read-text/);assert.match(capability,/clipboard-manager:allow-write-text/);});


test('suite visual contract matches _davSPACE controls',()=>{
  const source=fs.readFileSync('src/main.js','utf8');
  const styles=fs.readFileSync('src/styles.css','utf8');
  assert.match(source,/Comprami Un Caffè/);
  assert.doesNotMatch(source,/Offrimi un caffè/i);
  assert.match(source,/nav-settings-gear/);
  assert.match(source,/nav-favorites-star/);
  assert.match(source,/viewBox=\"0 0 390 390\"/);
  assert.match(styles,/\.coffee-button svg\{width:17px;height:17px;flex:0 0 17px;fill:currentColor;stroke:none\}/);
  assert.match(styles,/\.website-button svg\{width:16px;height:16px;fill:currentColor;stroke:none\}/);
});


test('suite motion contract follows _davSPACE behavior',()=>{
  const source=fs.readFileSync('src/main.js','utf8');
  const motion=fs.readFileSync('src/motion.css','utf8');
  assert.match(source,/render\('startup'\)/);
  assert.match(source,/render\('content'\)/);
  assert.match(source,/runUiTransition\('theme'/);
  assert.match(source,/data-motion-mode="\$\{motion\}"/);
  assert.match(motion,/--motion-reveal-duration:680ms/);
  assert.match(motion,/--motion-page-in:420ms/);
  assert.match(motion,/\.clip-row/);
  assert.match(motion,/prefers-reduced-motion:reduce/);
});

test('stable desktop helpers are configured',()=>{const source=fs.readFileSync('src/main.js','utf8');assert.equal(packageJson.dependencies['@tauri-apps/plugin-global-shortcut'],'2');assert.equal(packageJson.dependencies['@tauri-apps/plugin-autostart'],'2');assert.match(cargo,/tauri-plugin-global-shortcut = "2"/);assert.match(cargo,/tauri-plugin-autostart = "2"/);assert.match(capability,/global-shortcut:allow-register/);assert.match(capability,/autostart:allow-enable/);assert.match(source,/CommandOrControl\+Shift\+V/);assert.match(source,/pruneExpiredEntries/);});

test('stable release workflow is included',()=>{const workflow=fs.readFileSync('.github/workflows/release.yml','utf8');assert.match(workflow,/tags:/);assert.match(workflow,/prerelease: false/);assert.ok(workflow.includes("tagName: ${{ github.event_name == 'workflow_dispatch' && inputs.tag || github.ref_name }}"));assert.match(workflow,/git log -1 --pretty=%b/);assert.match(workflow,/releaseBody: \$\{\{ steps\.release_description\.outputs\.body \}\}/);assert.match(workflow,/🇮🇹/);assert.match(workflow,/🇺🇸/);assert.doesNotMatch(workflow,/Stable release of _davCLIPBOARD/);});

test('bundle PNG icons are truecolor RGBA for Tauri on macOS and Linux',()=>{
  for(const path of ['src-tauri/icons/32x32.png','src-tauri/icons/128x128.png','src-tauri/icons/128x128@2x.png','src-tauri/icons/app-icon.png']){
    const png=fs.readFileSync(path);
    const signature=png.subarray(0,8).toString('hex');
    assert.equal(signature,'89504e470d0a1a0a',`${path} must be a PNG`);
    assert.equal(png.subarray(12,16).toString('ascii'),'IHDR',`${path} must start with IHDR`);
    assert.equal(png[25],6,`${path} must use PNG color type 6 (RGBA)`);
  }
});
