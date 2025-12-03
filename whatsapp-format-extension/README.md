# WhatsApp Format - Chrome Extension

A Chrome extension that converts formatted text from any webpage into WhatsApp-compatible markdown format. Preserves bold, italic, lists, blockquotes, links, and more when pasting into WhatsApp.

## Features

- **Bold text** (`<b>`, `<strong>`) - Converts to `*text*`
- **Italic text** (`<i>`, `<em>`) - Converts to `_text_`
- **Strikethrough** (`<s>`, `<del>`) - Converts to `~text~`
- **Inline code** (`<code>`) - Converts to `` `text` ``
- **Bullet lists** (`<ul>`) - Converts to `- item`
- **Numbered lists** (`<ol>`) - Converts to `1. item`
- **Blockquotes** (`<blockquote>`) - Converts to `> text`
- **Links** (`<a href>`) - Converts to `[text](url)`
- **Headings** (`<h1>` - `<h6>`) - Converts to `# text`
- **Nested lists** - Properly indented

## Installation

### From Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store in the future.

### Manual Installation (Developer Mode)

1. **Download the extension**
   - Clone or download this repository to your computer
   - Extract if downloaded as a ZIP file

2. **Open Chrome Extensions**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Or click Menu (three dots) > More Tools > Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Navigate to and select the `whatsapp-format-extension` folder
   - The extension should now appear in your extensions list

5. **Pin the extension (optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Click the pin icon next to "WhatsApp Format"

## Usage

1. **Navigate** to any webpage with formatted text (Google Docs, Notion, Medium, Wikipedia, etc.)

2. **Select** the text you want to copy (including any formatting like bold, italic, lists)

3. **Right-click** on the selected text

4. **Click** "Copy as WhatsApp Format" from the context menu

5. **Open** WhatsApp Web (web.whatsapp.com) or WhatsApp Desktop

6. **Paste** (Ctrl+V or Cmd+V) into a chat

7. The text will appear with WhatsApp's native formatting!

## Examples

### Input (HTML from webpage)
```html
<p><strong>Important:</strong> This is a <em>formatted</em> message.</p>
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>
```

### Output (WhatsApp Markdown)
```
*Important:* This is a _formatted_ message.

- First item
- Second item
```

## Supported Websites

The extension works on any website! Tested on:

- Google Docs
- Notion
- Medium
- Wikipedia
- Reddit
- Stack Overflow
- GitHub
- Microsoft Word Online
- Confluence
- And many more...

## WhatsApp Markdown Reference

| Syntax | Result |
|--------|--------|
| `*bold*` | **bold** |
| `_italic_` | *italic* |
| `~strikethrough~` | ~~strikethrough~~ |
| `` `monospace` `` | `monospace` |
| `- item` | Bullet list |
| `1. item` | Numbered list |
| `> quote` | Blockquote |
| `[text](url)` | Clickable link |

## Known Limitations

- **Nested formatting**: Combining bold and italic (`*_text_*`) may not render consistently in all WhatsApp versions
- **Tables**: WhatsApp doesn't support tables; content is extracted as plain text
- **Code blocks**: Multi-line code blocks are converted to inline code (WhatsApp limitation)
- **Images**: Images are not supported; only text content is copied
- **Complex formatting**: Some complex HTML structures may lose formatting

## Troubleshooting

### "No text selected" error
- Make sure you have selected some text before right-clicking
- Try selecting more text or a larger section

### "Failed to copy" error
- The page may be blocking clipboard access
- Try refreshing the page and attempting again
- Some PDF viewers and protected pages may not allow clipboard access

### Formatting not appearing in WhatsApp
- Ensure you're pasting into WhatsApp Web or Desktop
- WhatsApp mobile app has limited markdown support
- Some formatting may appear differently on different devices

## Development

### File Structure

```
whatsapp-format-extension/
├── manifest.json        # Extension configuration (MV3)
├── background.js        # Service worker with conversion logic
├── content.js           # Content script (minimal)
├── icons/
│   ├── icon-16.png     # Favicon size
│   ├── icon-48.png     # Extension management page
│   └── icon-128.png    # Chrome Web Store
└── README.md           # This file
```

### Building from Source

No build step required! The extension uses vanilla JavaScript and can be loaded directly.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Privacy

This extension:
- Does NOT collect any user data
- Does NOT send any data to external servers
- Does NOT track your browsing activity
- Only accesses the clipboard when you explicitly use the "Copy as WhatsApp Format" feature
- Requires `<all_urls>` permission solely to work on any webpage you visit

## License

MIT License - feel free to use, modify, and distribute.

## Changelog

### Version 1.0.0
- Initial release
- Support for bold, italic, strikethrough, code
- Support for bullet and numbered lists
- Support for blockquotes and links
- Support for headings (H1-H6)
- Nested list support with proper indentation
- Chrome notification feedback
