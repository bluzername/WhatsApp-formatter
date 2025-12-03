# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Chrome Web Store publication
- Keyboard shortcut support (Cmd/Ctrl+Shift+W)
- Options page for customization
- Format preview tooltip
- Dark mode support

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

[Unreleased]: https://github.com/bluzername/WhatsApp-formatter/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/bluzername/WhatsApp-formatter/releases/tag/v1.0.0
