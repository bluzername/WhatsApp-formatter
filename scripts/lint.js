#!/usr/bin/env node
// Syntax-checks every extension script, validates manifest.json, and makes
// sure the version is the same in manifest.json, package.json and README.md.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const ext = path.join(root, 'whatsapp-format-extension');
let failed = false;

function fail(msg) {
  console.error('lint: ' + msg);
  failed = true;
}

for (const file of fs.readdirSync(ext).filter((f) => f.endsWith('.js'))) {
  try {
    new vm.Script(fs.readFileSync(path.join(ext, file), 'utf8'), { filename: file });
  } catch (err) {
    fail(`${file}: ${err.message}`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.json'), 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

if (manifest.manifest_version !== 3) fail('manifest_version must be 3');
if (manifest.version !== pkg.version) {
  fail(`version mismatch: manifest ${manifest.version} vs package.json ${pkg.version}`);
}
if (!readme.includes(`version-${manifest.version}-`)) {
  fail(`README badge does not mention version ${manifest.version}`);
}

for (const file of ['converter.js', 'get-selection.js', 'offscreen.html', 'offscreen.js']) {
  if (!fs.existsSync(path.join(ext, file))) fail(`missing ${file}`);
}

if (failed) process.exit(1);
console.log(`lint ok (v${manifest.version})`);
