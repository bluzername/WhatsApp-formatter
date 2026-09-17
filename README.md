<p align="center">
  <img src="whatsapp-format-extension/icons/icon-128.png" alt="WhatsApp Formatter logo" width="128" height="128">
</p>

<h1 align="center">WhatsApp Formatter</h1>

<p align="center">
  <strong>Copy formatted text from any webpage and paste it into WhatsApp with the formatting preserved.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/manifest-v3-blue?style=flat-square" alt="Manifest V3">
  <img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/version-1.0.2-purple?style=flat-square" alt="Version 1.0.2">
</p>

## What it does

Select text on a page, right-click, choose **Copy as WhatsApp Formatter**. The selection's HTML is converted to WhatsApp markup and placed on the clipboard. Paste into WhatsApp Web, Desktop or mobile.

- Bold, italic, strikethrough and inline code
- Bullet and numbered lists, including nested lists (2-space indent per level)
- Headings (rendered bold, since WhatsApp has no heading syntax)
- Blockquotes, paragraphs, line breaks, horizontal rules
- Tables flattened to `cell | cell |` rows
- Links keep their text only (WhatsApp has no link markup)
- No data collection, no network requests, no external dependencies

## Install

Not on the Chrome Web Store. Load it unpacked:

1. `git clone https://github.com/bluzername/WhatsApp-formatter.git` (or download a release zip from the CI artifacts)
2. Open `chrome://extensions/` and enable **Developer mode**
3. **Load unpacked** and pick the `whatsapp-format-extension` folder

Requires Chrome 109 or newer (offscreen documents).

## Conversion reference

| HTML | WhatsApp |
|------|----------|
| `<b>`, `<strong>` | `*bold*` |
| `<i>`, `<em>` | `_italic_` |
| `<s>`, `<strike>`, `<del>` | `~strike~` |
| `<code>` | `` `code` `` |
| `<pre>` | `` `block` `` on its own line |
| `<ul><li>` | `- item` |
| `<ol><li>` | `1. item` |
| nested lists | indented two spaces per level |
| `<h1>` to `<h6>` | `*heading*` followed by a blank line |
| `<blockquote>` | `> line` per line |
| `<a href>` | link text only |
| `<p>` | text plus blank line |
| `<div>`, `<tr>` | text plus newline |
| `<td>`, `<th>` | `text | ` |
| `<br>` | newline |
| `<hr>` | `---` |
| `<script>`, `<style>`, `<noscript>` | dropped |

Whitespace is collapsed, runs of three or more newlines become two, and nested markers of the same kind are merged (`**x**` becomes `*x*`).

## How it is built

```
whatsapp-format-extension/
  manifest.json      MV3 manifest (permissions: contextMenus, scripting, notifications, clipboardWrite, offscreen, activeTab)
  background.js      service worker: context menu, injects the converter into the page, copies via offscreen doc
  converter.js       the HTML to WhatsApp converter (shared with the tests)
  get-selection.js   runs in the page: serialises the selection and calls the converter
  offscreen.html/js  offscreen document that writes to the clipboard
  test.html          manual test page with sample content
  icons/
```

`converter.js` is a small UMD-style module: in the page it registers `globalThis.WhatsAppConverter`; in Node it is `require()`d by the test suite. There is exactly one copy of the conversion logic.

## Development

```bash
npm ci
npm run lint      # syntax-check scripts, validate manifest, check versions agree
npm test          # node:test suite against converter.js (jsdom provides DOMParser)
npm run package   # dist/whatsapp-formatter-<version>.zip
```

CI runs all three on every push and pull request and uploads the zip as an artifact.

### Releasing

Bump `version` in `whatsapp-format-extension/manifest.json` and `package.json`, update the badge above and `CHANGELOG.md`, then tag. `npm run lint` fails if the three versions disagree.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
