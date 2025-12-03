<p align="center">
  <img src="whatsapp-format-extension/icons/icon-128.png" alt="WhatsApp Format Logo" width="128" height="128">
</p>

<h1 align="center">WhatsApp Format</h1>

<p align="center">
  <strong>Copy formatted text from any webpage and paste it into WhatsApp with formatting preserved.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#supported-formatting">Formatting</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/manifest-v3-blue?style=flat-square" alt="Manifest V3">
  <img src="https://img.shields.io/badge/chrome-extension-green?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/badge/version-1.0.0-purple?style=flat-square" alt="Version 1.0.0">
</p>

---

## The Problem

You're reading an article, documentation, or notes with beautifully formatted text — **bold headings**, _emphasized points_, bullet lists, and code snippets. You want to share it on WhatsApp, but when you copy and paste... all the formatting disappears.

## The Solution

**WhatsApp Format** is a lightweight Chrome extension that converts HTML formatting into WhatsApp-compatible markdown. Simply select text, right-click, and choose "Copy as WhatsApp Format". Paste into WhatsApp and watch your formatting come alive.

---

## Features

| Feature | Description |
|---------|-------------|
| **One-Click Conversion** | Right-click context menu for instant formatting |
| **Universal Compatibility** | Works on any website — Google Docs, Notion, Medium, Wikipedia, and more |
| **Comprehensive Formatting** | Supports bold, italic, strikethrough, code, lists, blockquotes, links, and headings |
| **Nested Lists** | Properly handles multi-level bullet and numbered lists with indentation |
| **Smart Processing** | Handles edge cases like empty elements, malformed HTML, and whitespace |
| **Privacy-First** | No data collection, no external servers, no tracking |
| **Lightweight** | Under 20KB total size, zero external dependencies |
| **Modern Architecture** | Built on Manifest V3 for security and performance |

---

## Installation

### Option 1: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store in a future release.

### Option 2: Manual Installation

<details>
<summary><strong>Click to expand installation steps</strong></summary>

1. **Download the extension**
   ```bash
   git clone https://github.com/bluzername/WhatsApp-formatter.git
   cd WhatsApp-formatter
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/` in your browser
   - Or: Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `whatsapp-format-extension` folder
   - The extension icon should appear in your toolbar

5. **Pin for easy access** (optional)
   - Click the puzzle piece icon (🧩) in Chrome's toolbar
   - Click the pin icon next to "WhatsApp Format"

</details>

---

## Usage

<table>
<tr>
<td width="60">
<h3>1</h3>
</td>
<td>
<strong>Select</strong> formatted text on any webpage
</td>
</tr>
<tr>
<td>
<h3>2</h3>
</td>
<td>
<strong>Right-click</strong> to open the context menu
</td>
</tr>
<tr>
<td>
<h3>3</h3>
</td>
<td>
<strong>Click</strong> "Copy as WhatsApp Format"
</td>
</tr>
<tr>
<td>
<h3>4</h3>
</td>
<td>
<strong>Paste</strong> into WhatsApp Web or Desktop
</td>
</tr>
</table>

**That's it!** Your text will appear with WhatsApp's native formatting.

---

## Supported Formatting

### Input → Output Examples

<table>
<tr>
<th>HTML Element</th>
<th>WhatsApp Markdown</th>
<th>Rendered As</th>
</tr>
<tr>
<td><code>&lt;b&gt;bold&lt;/b&gt;</code></td>
<td><code>*bold*</code></td>
<td><strong>bold</strong></td>
</tr>
<tr>
<td><code>&lt;i&gt;italic&lt;/i&gt;</code></td>
<td><code>_italic_</code></td>
<td><em>italic</em></td>
</tr>
<tr>
<td><code>&lt;s&gt;strike&lt;/s&gt;</code></td>
<td><code>~strike~</code></td>
<td><del>strike</del></td>
</tr>
<tr>
<td><code>&lt;code&gt;code&lt;/code&gt;</code></td>
<td><code>`code`</code></td>
<td><code>code</code></td>
</tr>
<tr>
<td><code>&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</code></td>
<td><code>- item</code></td>
<td>• item</td>
</tr>
<tr>
<td><code>&lt;ol&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ol&gt;</code></td>
<td><code>1. item</code></td>
<td>1. item</td>
</tr>
<tr>
<td><code>&lt;blockquote&gt;quote&lt;/blockquote&gt;</code></td>
<td><code>&gt; quote</code></td>
<td>┃ quote</td>
</tr>
<tr>
<td><code>&lt;a href="url"&gt;link&lt;/a&gt;</code></td>
<td><code>[link](url)</code></td>
<td><a href="#">link</a></td>
</tr>
<tr>
<td><code>&lt;h1&gt;heading&lt;/h1&gt;</code></td>
<td><code># heading</code></td>
<td><strong>heading</strong></td>
</tr>
</table>

### Complex Example

**Before (HTML):**
```html
<h2>Meeting Notes</h2>
<p><strong>Date:</strong> December 3, 2024</p>
<p>Key points discussed:</p>
<ul>
  <li>Project timeline review</li>
  <li>Budget allocation
    <ul>
      <li>Q1: $50,000</li>
      <li>Q2: $75,000</li>
    </ul>
  </li>
  <li>Next steps</li>
</ul>
<blockquote>Action item: Send proposal by Friday</blockquote>
```

**After (WhatsApp Markdown):**
```
## Meeting Notes

*Date:* December 3, 2024

Key points discussed:

- Project timeline review
- Budget allocation
  - Q1: $50,000
  - Q2: $75,000
- Next steps

> Action item: Send proposal by Friday
```

---

## Tested Websites

WhatsApp Format works on any website. It has been tested on:

| Category | Websites |
|----------|----------|
| **Docs & Notes** | Google Docs, Notion, Confluence, Obsidian Web |
| **Blogs & Articles** | Medium, Substack, WordPress, Ghost |
| **Knowledge Bases** | Wikipedia, Stack Overflow, MDN Web Docs |
| **Social & Forums** | Reddit, Hacker News, Discourse |
| **Code Platforms** | GitHub, GitLab, Bitbucket |
| **Email** | Gmail, Outlook Web |

---

## Project Structure

```
WhatsApp-formatter/
├── whatsapp-format-extension/
│   ├── manifest.json      # Chrome extension manifest (MV3)
│   ├── background.js      # Service worker with conversion logic
│   ├── content.js         # Content script (minimal)
│   └── icons/
│       ├── icon-16.png    # Favicon
│       ├── icon-48.png    # Extension manager
│       └── icon-128.png   # Chrome Web Store
├── README.md              # This file
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # Contribution guidelines
├── CODE_OF_CONDUCT.md     # Community standards
└── CHANGELOG.md           # Version history
```

---

## Technical Details

### Architecture

- **Manifest Version:** 3 (latest Chrome extension standard)
- **Background:** Service Worker (event-driven, stateless)
- **Permissions:** `contextMenus`, `scripting`, `notifications`, `storage`
- **Host Permissions:** `<all_urls>` (required to work on any webpage)

### How It Works

1. User selects text and right-clicks
2. Service worker receives context menu click event
3. Script injected to extract selected HTML via `window.getSelection()`
4. HTML parsed using `DOMParser` in service worker
5. DOM tree recursively traversed, converting elements to WhatsApp markdown
6. Result copied to clipboard via `navigator.clipboard.writeText()`
7. Success notification displayed to user

### Security & Privacy

- **No data collection:** The extension processes everything locally
- **No network requests:** All conversion happens in your browser
- **No external dependencies:** Pure vanilla JavaScript
- **Open source:** Full code available for review

---

## Known Limitations

| Limitation | Reason |
|------------|--------|
| **Tables** | WhatsApp doesn't support table markdown; content extracted as text |
| **Images** | Only text is copied; images are not included |
| **Nested bold+italic** | `*_text_*` may render inconsistently on some WhatsApp versions |
| **Code blocks** | WhatsApp only supports inline code; multi-line blocks use backticks |
| **Some PDF viewers** | Protected documents may block clipboard access |

---

## Troubleshooting

<details>
<summary><strong>"No text selected" error</strong></summary>

- Ensure you've selected text before right-clicking
- Try selecting a larger portion of text
- Some interactive elements may not allow text selection

</details>

<details>
<summary><strong>"Failed to copy" error</strong></summary>

- The webpage may be blocking clipboard access
- Refresh the page and try again
- Some secure pages restrict clipboard operations

</details>

<details>
<summary><strong>Formatting not appearing in WhatsApp</strong></summary>

- Ensure you're using WhatsApp Web or Desktop
- WhatsApp mobile has limited markdown rendering
- Some markdown may appear differently across platforms

</details>

---

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Quick Start for Contributors

```bash
# Clone the repository
git clone https://github.com/bluzername/WhatsApp-formatter.git

# Load in Chrome
# 1. Go to chrome://extensions
# 2. Enable Developer Mode
# 3. Click "Load unpacked"
# 4. Select the whatsapp-format-extension folder

# Make changes and test
# The extension will auto-reload on changes
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- WhatsApp for their markdown rendering engine
- The Chrome Extensions team for Manifest V3
- The open-source community for inspiration and feedback

---

<p align="center">
  <sub>Built with care for better communication.</sub>
</p>

<p align="center">
  <a href="https://github.com/bluzername/WhatsApp-formatter/issues">Report Bug</a> •
  <a href="https://github.com/bluzername/WhatsApp-formatter/issues">Request Feature</a>
</p>
