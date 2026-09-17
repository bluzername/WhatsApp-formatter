#!/usr/bin/env node
// Zips the extension folder into dist/whatsapp-formatter-<version>.zip for
// "Load unpacked" sharing or a Chrome Web Store upload.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const ext = path.join(root, 'whatsapp-format-extension');
const manifest = JSON.parse(fs.readFileSync(path.join(ext, 'manifest.json'), 'utf8'));
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });

const out = path.join(dist, `whatsapp-formatter-${manifest.version}.zip`);
if (fs.existsSync(out)) fs.unlinkSync(out);
execFileSync('zip', ['-qr', out, '.', '-x', 'test.html'], { cwd: ext, stdio: 'inherit' });
console.log(`wrote ${path.relative(root, out)}`);
