/**
 * WhatsApp Format - Chrome Extension Background Service Worker
 * Converts formatted HTML text to WhatsApp-compatible markdown format
 *
 * @author WhatsApp Format Extension
 * @version 1.0.0
 */

// ============================================================================
// CONTEXT MENU SETUP
// ============================================================================

/**
 * Creates the context menu item when the extension is installed
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copy-whatsapp-format',
    title: 'Copy as WhatsApp Format',
    contexts: ['selection']
  });
});

// ============================================================================
// CONTEXT MENU CLICK HANDLER
// ============================================================================

/**
 * Handles context menu click events
 * Orchestrates the full workflow: get selection -> convert -> copy -> notify
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'copy-whatsapp-format') {
    return;
  }

  try {
    // Step 1: Get the selected HTML from the page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedHTML
    });

    if (!results || !results[0] || !results[0].result) {
      showNotification('Error', 'No text selected. Please select some text and try again.');
      return;
    }

    const html = results[0].result;

    // Step 2: Convert HTML to WhatsApp markdown
    const whatsappText = convertHTMLToWhatsApp(html);

    if (!whatsappText || whatsappText.trim() === '') {
      showNotification('Error', 'Could not convert the selection. Try selecting different text.');
      return;
    }

    // Step 3: Copy to clipboard via injected script
    const copyResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToClipboard,
      args: [whatsappText]
    });

    if (copyResults && copyResults[0] && copyResults[0].result === true) {
      showNotification('WhatsApp Format', 'Copied to clipboard!');
    } else {
      showNotification('Error', 'Failed to copy. Try again.');
    }

  } catch (error) {
    console.error('WhatsApp Format Extension Error:', error);
    showNotification('Error', 'An error occurred. Please try again.');
  }
});

// ============================================================================
// INJECTED FUNCTIONS (Run in page context)
// ============================================================================

/**
 * Gets the HTML content of the current selection
 * This function is injected into the page context
 * @returns {string|null} The HTML string of the selection, or null if none
 */
function getSelectedHTML() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());

  return container.innerHTML;
}

/**
 * Copies text to the clipboard using the Clipboard API
 * This function is injected into the page context
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
  }
}

// ============================================================================
// HTML TO WHATSAPP CONVERSION ENGINE
// ============================================================================

/**
 * Converts HTML string to WhatsApp-compatible markdown format
 * @param {string} html - The HTML string to convert
 * @returns {string} WhatsApp-compatible markdown text
 */
function convertHTMLToWhatsApp(html) {
  // Validate input
  if (!html || html.trim() === '') {
    return '';
  }

  // Parse HTML using DOMParser (available in service worker)
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstChild;

  // Process the DOM tree
  const result = processNode(root, 0);

  // Final cleanup: normalize whitespace and limit consecutive newlines
  return result
    .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
    .replace(/[ \t]+$/gm, '')     // Remove trailing spaces on each line
    .trim();
}

/**
 * Recursively processes a DOM node and converts it to WhatsApp markdown
 * @param {Node} node - The DOM node to process
 * @param {number} depth - Current nesting depth (for list indentation)
 * @returns {string} WhatsApp-compatible markdown text
 */
function processNode(node, depth = 0) {
  let result = '';

  if (!node || !node.childNodes) {
    return result;
  }

  for (const child of node.childNodes) {
    // Handle text nodes
    if (child.nodeType === 3) { // Node.TEXT_NODE
      const text = child.textContent;
      // Normalize whitespace but preserve single spaces
      const normalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      result += normalized;
      continue;
    }

    // Handle element nodes
    if (child.nodeType === 1) { // Node.ELEMENT_NODE
      const tagName = child.tagName.toLowerCase();

      // Skip script, style, and comment nodes
      if (['script', 'style', 'noscript'].includes(tagName)) {
        continue;
      }

      // Get child content recursively
      const childContent = processNode(child, depth);

      // Apply formatting based on tag type
      switch (tagName) {
        // Bold formatting
        case 'b':
        case 'strong':
          if (childContent.trim()) {
            result += '*' + childContent.trim() + '*';
          }
          break;

        // Italic formatting
        case 'i':
        case 'em':
          if (childContent.trim()) {
            result += '_' + childContent.trim() + '_';
          }
          break;

        // Strikethrough formatting
        case 's':
        case 'strike':
        case 'del':
          if (childContent.trim()) {
            result += '~' + childContent.trim() + '~';
          }
          break;

        // Code/monospace formatting
        case 'code':
          if (childContent.trim()) {
            result += '`' + childContent.trim() + '`';
          }
          break;

        // Preformatted text (code blocks)
        case 'pre':
          if (childContent.trim()) {
            // WhatsApp only supports inline code, so we use backticks
            result += '\n`' + childContent.trim() + '`\n';
          }
          break;

        // Unordered lists
        case 'ul':
          result += '\n' + formatBulletList(child, depth) + '\n';
          break;

        // Ordered lists
        case 'ol':
          result += '\n' + formatNumberedList(child, depth) + '\n';
          break;

        // List items (when not processed by list formatters)
        case 'li':
          // This case handles orphan li elements
          result += '- ' + childContent.trim() + '\n';
          break;

        // Blockquotes
        case 'blockquote':
          result += '\n' + formatBlockquote(childContent) + '\n';
          break;

        // Links
        case 'a':
          const href = child.getAttribute('href');
          if (href && href.trim() && childContent.trim()) {
            result += '[' + childContent.trim() + '](' + href.trim() + ')';
          } else {
            // No valid href, just output the text
            result += childContent;
          }
          break;

        // Line breaks
        case 'br':
          result += '\n';
          break;

        // Paragraphs
        case 'p':
          if (childContent.trim()) {
            result += childContent.trim() + '\n\n';
          }
          break;

        // Divs (block elements)
        case 'div':
          if (childContent.trim()) {
            result += childContent + '\n';
          }
          break;

        // Headings (H1-H6)
        case 'h1':
          if (childContent.trim()) {
            result += '\n# ' + childContent.trim() + '\n\n';
          }
          break;

        case 'h2':
          if (childContent.trim()) {
            result += '\n## ' + childContent.trim() + '\n\n';
          }
          break;

        case 'h3':
          if (childContent.trim()) {
            result += '\n### ' + childContent.trim() + '\n\n';
          }
          break;

        case 'h4':
          if (childContent.trim()) {
            result += '\n#### ' + childContent.trim() + '\n\n';
          }
          break;

        case 'h5':
          if (childContent.trim()) {
            result += '\n##### ' + childContent.trim() + '\n\n';
          }
          break;

        case 'h6':
          if (childContent.trim()) {
            result += '\n###### ' + childContent.trim() + '\n\n';
          }
          break;

        // Horizontal rule
        case 'hr':
          result += '\n---\n';
          break;

        // Table elements - extract text only (WhatsApp doesn't support tables)
        case 'table':
        case 'thead':
        case 'tbody':
        case 'tfoot':
          result += childContent;
          break;

        case 'tr':
          if (childContent.trim()) {
            result += childContent.trim() + '\n';
          }
          break;

        case 'td':
        case 'th':
          if (childContent.trim()) {
            result += childContent.trim() + ' | ';
          }
          break;

        // Span and other inline elements - pass through
        case 'span':
        case 'font':
        case 'mark':
        case 'ins':
        case 'u':
        case 'small':
        case 'big':
        case 'sub':
        case 'sup':
        case 'abbr':
        case 'acronym':
        case 'cite':
        case 'dfn':
        case 'kbd':
        case 'samp':
        case 'var':
        case 'time':
        case 'label':
          result += childContent;
          break;

        // Default: pass through content for unknown tags
        default:
          result += childContent;
          break;
      }
    }
  }

  return result;
}

/**
 * Formats an unordered list (<ul>) to WhatsApp bullet list format
 * @param {Element} listNode - The <ul> element
 * @param {number} depth - Current nesting depth
 * @returns {string} Formatted bullet list
 */
function formatBulletList(listNode, depth = 0) {
  let result = '';
  const indent = '  '.repeat(depth); // 2 spaces per depth level

  for (const child of listNode.children) {
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    // Process the li content, but handle nested lists separately
    let itemText = '';
    let nestedListContent = '';

    for (const liChild of child.childNodes) {
      if (liChild.nodeType === 3) { // Text node
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) { // Element node
        const liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1);
        } else {
          itemText += processNode(liChild, depth + 1);
        }
      }
    }

    // Add the list item
    const trimmedText = itemText.trim();
    if (trimmedText) {
      result += indent + '- ' + trimmedText + '\n';
    }

    // Add nested list content after the parent item
    if (nestedListContent) {
      result += nestedListContent;
    }
  }

  return result;
}

/**
 * Formats an ordered list (<ol>) to WhatsApp numbered list format
 * @param {Element} listNode - The <ol> element
 * @param {number} depth - Current nesting depth
 * @returns {string} Formatted numbered list
 */
function formatNumberedList(listNode, depth = 0) {
  let result = '';
  const indent = '  '.repeat(depth);
  let itemIndex = 1;

  for (const child of listNode.children) {
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    // Process the li content, but handle nested lists separately
    let itemText = '';
    let nestedListContent = '';

    for (const liChild of child.childNodes) {
      if (liChild.nodeType === 3) { // Text node
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) { // Element node
        const liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1);
        } else {
          itemText += processNode(liChild, depth + 1);
        }
      }
    }

    // Add the list item
    const trimmedText = itemText.trim();
    if (trimmedText) {
      result += indent + itemIndex + '. ' + trimmedText + '\n';
      itemIndex++;
    }

    // Add nested list content after the parent item
    if (nestedListContent) {
      result += nestedListContent;
    }
  }

  return result;
}

/**
 * Formats text as a blockquote by prefixing each line with '> '
 * @param {string} content - The content to format as blockquote
 * @returns {string} Blockquote-formatted text
 */
function formatBlockquote(content) {
  if (!content || !content.trim()) {
    return '';
  }

  return content
    .trim()
    .split('\n')
    .map(line => '> ' + line.trim())
    .filter(line => line !== '> ') // Remove empty quote lines
    .join('\n');
}

// ============================================================================
// NOTIFICATION HELPER
// ============================================================================

/**
 * Shows a Chrome notification to the user
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: title,
    message: message,
    priority: 0
  });
}
