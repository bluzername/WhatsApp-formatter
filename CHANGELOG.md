# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Conversion logic lives in one place, `converter.js`, injected into the page ahead of `get-selection.js` and `require()`d by the tests.
- Whitespace between inline elements is preserved (`<b>a</b> <i>b</i>` now yields `*a* _b_`).
- `package.json` cleaned up (name, description, repository URL, MIT license, version 1.0.2).
- `npm test` runs a `node:test` suite (33 cases); `npm run lint` checks syntax, manifest and version agreement; `npm run package` builds a zip.
- CI workflow and Dependabot added.

### Removed
- `test-conversion.js` (a diverged copy of the converter), the unused `content.js` and `copy-to-clipboard.js`, and the duplicate extension README.

### Planned
- Chrome Web Store publication
- Keyboard shortcut support (Cmd/Ctrl+Shift+W)
- Options page for customization

---

## [1.0.2] - 2025-12-08

### Changed
- Renamed to "WhatsApp Formatter" throughout.
- Clipboard writes go through an offscreen document; `minimum_chrome_version` set to 109.
- `activeTab` permission replaces broad host permissions.
- HTML conversion runs in page context (fixes the missing `DOMParser` in the service worker).

### Fixed
- Standalone `<li>`, nested lists, whitespace handling, nested bold/italic collapsing, formatting inside list items.
- `chrome.runtime.getContexts` guarded for Chrome 109-115; "document already exists" handled.

## [1.0.1] - 2025-12-04

### Fixed
- Service worker could not access the page DOM; selection and clipboard code moved to injected files.
- `chrome.scripting.executeScript` called with `func` instead of `function`.

---

## [1.0.0] - 2024-12-03

### Added

#### Core Features
- **Context Menu Integration**: Right-click "Copy as WhatsApp Format" on any selected text
- **HTML-to-WhatsApp Conversion Engine**: Comprehensive recursive DOM parser
- **Clipboard Integration**: Automatic copy via Clipboard API
- **Chrome Notifications**: Visual feedback for success and error states

#### Formatting Support
- **Bold**: `<b>`, `<strong>` → `*text*`
- **Italic**: `<i>`, `<em>` → `_text_`
- **Strikethrough**: `<s>`, `<strike>`, `<del>` → `~text~`
- **Inline Code**: `<code>` → `` `text` ``
- **Bullet Lists**: `<ul>` with `<li>` → `- item`
- **Numbered Lists**: `<ol>` with `<li>` → `1. item`
- **Nested Lists**: Proper indentation with 2 spaces per level
- **Blockquotes**: `<blockquote>` → `> text`
- **Links**: `<a href="url">` → `[text](url)`
- **Headings**: `<h1>` through `<h6>` → `#` through `######`
- **Line Breaks**: `<br>` → newline
- **Paragraphs**: `<p>`, `<div>` → text with newline

#### Edge Case Handling
- Empty element filtering
- Whitespace normalization (collapse multiple spaces)
- Consecutive newline limiting (max 2)
- Malformed HTML tolerance
- Links without href attribute
- Mixed nested list types
- Table content extraction (text only)

#### Technical
- Manifest V3 compliance
- Service Worker architecture (event-driven, stateless)
- Pure vanilla JavaScript (no external dependencies)
- JSDoc documentation throughout codebase

### Technical Details
- **Permissions Used**: `contextMenus`, `scripting`, `notifications`, `storage`
- **Host Permissions**: `<all_urls>` for universal website support
- **Total Size**: Under 20KB (excluding icons)
- **Browser Compatibility**: Chrome 88+ (MV3 requirement)

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.2 | 2025-12-08 | Offscreen clipboard, activeTab, list and nesting fixes |
| 1.0.1 | 2025-12-04 | Page-context injection fixes |
| 1.0.0 | 2024-12-03 | Initial release with full formatting support |

---

## Upgrade Guide

### From Pre-release to 1.0.0

If you were using a pre-release version:
1. Remove the old extension from Chrome
2. Download the new version
3. Load unpacked as usual

No data migration needed — the extension is stateless.

---

## Links

- [GitHub Repository](https://github.com/bluzername/WhatsApp-formatter)
- [Report Issues](https://github.com/bluzername/WhatsApp-formatter/issues)
- [Contributing Guide](CONTRIBUTING.md)

[Unreleased]: https://github.com/bluzername/WhatsApp-formatter/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/bluzername/WhatsApp-formatter/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/bluzername/WhatsApp-formatter/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bluzername/WhatsApp-formatter/releases/tag/v1.0.0
