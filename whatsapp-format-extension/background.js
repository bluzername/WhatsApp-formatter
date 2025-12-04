/**
 * WhatsApp Format - Chrome Extension Background Service Worker
 * Converts formatted HTML text to WhatsApp-compatible markdown format
 */

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copy-whatsapp-format',
    title: 'Copy as WhatsApp Format',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'copy-whatsapp-format') {
    return;
  }

  try {
    // Step 1: Get selected HTML
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSelectedHTML
    });

    console.log('[WA Format] HTML results:', results);

    if (!results || !results[0] || !results[0].result) {
      showNotification('Error', 'No text selected.');
      return;
    }

    const html = results[0].result;
    console.log('[WA Format] Extracted HTML:', html);

    // Step 2: Convert to WhatsApp format
    const whatsappText = convertHTMLToWhatsApp(html);
    console.log('[WA Format] Converted:', whatsappText);

    if (!whatsappText || whatsappText.trim() === '') {
      showNotification('Error', 'Could not convert selection.');
      return;
    }

    // Step 3: Copy to clipboard
    const copyResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: copyToClipboard,
      args: [whatsappText]
    });

    console.log('[WA Format] Copy results:', copyResults);

    const success = copyResults && copyResults[0] && copyResults[0].result === true;
    if (success) {
      showNotification('WhatsApp Format', 'Copied to clipboard!');
    } else {
      showNotification('Error', 'Failed to copy.');
    }

  } catch (error) {
    console.error('[WA Format] Error:', error);
    showNotification('Error', 'An error occurred.');
  }
});

// === INJECTED FUNCTIONS ===

function getSelectedHTML() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  console.log('[WA Format] getSelectedHTML:', container.innerHTML);
  return container.innerHTML;
}

function copyToClipboard(text) {
  console.log('[WA Format] copyToClipboard:', text);
  return navigator.clipboard.writeText(text)
    .then(() => {
      console.log('[WA Format] Copy success');
      return true;
    })
    .catch((err) => {
      console.error('[WA Format] Copy failed:', err);
      return false;
    });
}

// === CONVERSION ENGINE ===

function convertHTMLToWhatsApp(html) {
  if (!html || html.trim() === '') {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString('<div>' + html + '</div>', 'text/html');
  const root = doc.body.firstChild;

  const result = processNode(root, 0);

  return result
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function processNode(node, depth) {
  let result = '';

  if (!node || !node.childNodes) {
    return result;
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i];

    // Text node
    if (child.nodeType === 3) {
      const text = child.textContent;
      const normalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      result += normalized;
      continue;
    }

    // Element node
    if (child.nodeType === 1) {
      const tagName = child.tagName.toLowerCase();

      if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
        continue;
      }

      const childContent = processNode(child, depth);

      if (tagName === 'b' || tagName === 'strong') {
        if (childContent.trim()) {
          result += '*' + childContent.trim() + '*';
        }
      } else if (tagName === 'i' || tagName === 'em') {
        if (childContent.trim()) {
          result += '_' + childContent.trim() + '_';
        }
      } else if (tagName === 's' || tagName === 'strike' || tagName === 'del') {
        if (childContent.trim()) {
          result += '~' + childContent.trim() + '~';
        }
      } else if (tagName === 'code') {
        if (childContent.trim()) {
          result += '`' + childContent.trim() + '`';
        }
      } else if (tagName === 'pre') {
        if (childContent.trim()) {
          result += '\n`' + childContent.trim() + '`\n';
        }
      } else if (tagName === 'ul') {
        result += '\n' + formatBulletList(child, depth) + '\n';
      } else if (tagName === 'ol') {
        result += '\n' + formatNumberedList(child, depth) + '\n';
      } else if (tagName === 'li') {
        result += '- ' + childContent.trim() + '\n';
      } else if (tagName === 'blockquote') {
        result += '\n' + formatBlockquote(childContent) + '\n';
      } else if (tagName === 'a') {
        const href = child.getAttribute('href');
        if (href && href.trim() && childContent.trim()) {
          result += '[' + childContent.trim() + '](' + href.trim() + ')';
        } else {
          result += childContent;
        }
      } else if (tagName === 'br') {
        result += '\n';
      } else if (tagName === 'p') {
        if (childContent.trim()) {
          result += childContent.trim() + '\n\n';
        }
      } else if (tagName === 'div') {
        if (childContent.trim()) {
          result += childContent + '\n';
        }
      } else if (tagName === 'h1') {
        if (childContent.trim()) {
          result += '\n# ' + childContent.trim() + '\n\n';
        }
      } else if (tagName === 'h2') {
        if (childContent.trim()) {
          result += '\n## ' + childContent.trim() + '\n\n';
        }
      } else if (tagName === 'h3') {
        if (childContent.trim()) {
          result += '\n### ' + childContent.trim() + '\n\n';
        }
      } else if (tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
        if (childContent.trim()) {
          result += '\n#### ' + childContent.trim() + '\n\n';
        }
      } else if (tagName === 'hr') {
        result += '\n---\n';
      } else if (tagName === 'tr') {
        if (childContent.trim()) {
          result += childContent.trim() + '\n';
        }
      } else if (tagName === 'td' || tagName === 'th') {
        if (childContent.trim()) {
          result += childContent.trim() + ' | ';
        }
      } else {
        result += childContent;
      }
    }
  }

  return result;
}

function formatBulletList(listNode, depth) {
  let result = '';
  const indent = '  '.repeat(depth);

  for (let i = 0; i < listNode.children.length; i++) {
    const child = listNode.children[i];
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    let itemText = '';
    let nestedListContent = '';

    for (let j = 0; j < child.childNodes.length; j++) {
      const liChild = child.childNodes[j];
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
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

    const trimmedText = itemText.trim();
    if (trimmedText) {
      result += indent + '- ' + trimmedText + '\n';
    }
    if (nestedListContent) {
      result += nestedListContent;
    }
  }

  return result;
}

function formatNumberedList(listNode, depth) {
  let result = '';
  const indent = '  '.repeat(depth);
  let itemIndex = 1;

  for (let i = 0; i < listNode.children.length; i++) {
    const child = listNode.children[i];
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    let itemText = '';
    let nestedListContent = '';

    for (let j = 0; j < child.childNodes.length; j++) {
      const liChild = child.childNodes[j];
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
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

    const trimmedText = itemText.trim();
    if (trimmedText) {
      result += indent + itemIndex + '. ' + trimmedText + '\n';
      itemIndex++;
    }
    if (nestedListContent) {
      result += nestedListContent;
    }
  }

  return result;
}

function formatBlockquote(content) {
  if (!content || !content.trim()) {
    return '';
  }
  return content
    .trim()
    .split('\n')
    .map(function(line) { return '> ' + line.trim(); })
    .filter(function(line) { return line !== '> '; })
    .join('\n');
}

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: title,
    message: message,
    priority: 0
  });
}
