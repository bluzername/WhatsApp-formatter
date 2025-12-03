# Contributing to WhatsApp Format

First off, thank you for considering contributing to WhatsApp Format! It's people like you that make this extension better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Google Chrome browser (latest version recommended)
- Basic knowledge of JavaScript and Chrome Extension APIs
- Git for version control

### Quick Start

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/WhatsApp-formatter.git
   cd WhatsApp-formatter
   ```

3. **Load the extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `whatsapp-format-extension` folder

4. **Make your changes**

   Edit the files in `whatsapp-format-extension/`

5. **Test your changes**
   - Click the refresh icon on the extension card in `chrome://extensions/`
   - Test on various websites

## How Can I Contribute?

### Types of Contributions

| Type | Description |
|------|-------------|
| **Bug Fixes** | Fix issues reported in GitHub Issues |
| **New Features** | Add new formatting support or UI improvements |
| **Documentation** | Improve README, add code comments, write tutorials |
| **Testing** | Test on different websites and report compatibility |
| **Code Review** | Review pull requests from other contributors |
| **Translations** | Help translate the extension (future feature) |

### Good First Issues

Look for issues labeled `good first issue` — these are great for newcomers!

## Development Setup

### Project Structure

```
whatsapp-format-extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker (main logic)
├── content.js         # Content script (minimal)
└── icons/            # Extension icons
```

### Key Files

| File | Purpose |
|------|---------|
| `manifest.json` | Defines permissions, scripts, and metadata |
| `background.js` | Contains the HTML-to-WhatsApp conversion engine |
| `content.js` | Placeholder for future content script features |

### Testing Your Changes

1. **Manual Testing**
   - Select formatted text on various websites
   - Right-click → "Copy as WhatsApp Format"
   - Paste into WhatsApp Web and verify formatting

2. **Test Cases to Cover**
   - Bold, italic, strikethrough, code
   - Bullet lists (single and nested)
   - Numbered lists (single and nested)
   - Blockquotes
   - Links with and without URLs
   - Headings (H1-H6)
   - Mixed formatting
   - Edge cases (empty elements, whitespace)

3. **Websites to Test On**
   - Google Docs
   - Notion
   - Medium
   - Wikipedia
   - Stack Overflow
   - Reddit

### Debugging

- Open `chrome://extensions/`
- Click "Service Worker" link on the extension card
- This opens DevTools for the background script
- Use `console.log()` statements for debugging

## Style Guidelines

### JavaScript

- Use ES6+ syntax (const/let, arrow functions, template literals)
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions focused and under 50 lines when possible

```javascript
/**
 * Converts an HTML element to WhatsApp markdown format
 * @param {Element} element - The DOM element to convert
 * @param {number} depth - Current nesting depth for lists
 * @returns {string} WhatsApp-compatible markdown
 */
function convertElement(element, depth = 0) {
  // Implementation
}
```

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at end of statements
- Keep lines under 100 characters

### Comments

- Write comments for complex logic
- Don't comment obvious code
- Use `// TODO:` for planned improvements
- Use `// FIXME:` for known issues

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(converter): add support for definition lists

fix(lists): handle empty list items correctly

docs(readme): add troubleshooting section

refactor(background): simplify whitespace normalization
```

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Test thoroughly**
   - Test on at least 5 different websites
   - Test all formatting types affected by your changes
   - Verify no regressions in existing functionality

4. **Update documentation**
   - Update README if adding features
   - Add JSDoc comments for new functions
   - Update CHANGELOG.md

### Submitting

1. Push your branch to your fork
2. Open a Pull Request against `main`
3. Fill out the PR template completely
4. Link any related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested on Google Docs
- [ ] Tested on Notion
- [ ] Tested on Medium
- [ ] Tested nested lists
- [ ] Tested edge cases

## Screenshots (if applicable)
Add screenshots showing the feature/fix

## Related Issues
Fixes #123
```

### After Submitting

- Respond to review feedback promptly
- Make requested changes in new commits
- Squash commits if requested before merge

## Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Try the latest version
3. Test in an incognito window (to rule out other extensions)

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to [website]
2. Select [text]
3. Right-click → "Copy as WhatsApp Format"
4. Paste into WhatsApp

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Chrome version:
- Extension version:
- Operating system:

## Screenshots
If applicable

## Sample HTML
```html
<paste the HTML that causes the issue>
```
```

## Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Use Case
Why would this be useful?

## Proposed Solution
How might this work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Screenshots, mockups, examples
```

---

## Questions?

Feel free to open an issue with the `question` label if you need help getting started.

Thank you for contributing! 🎉
