/**
 * WhatsApp Format - Chrome Extension Background Service Worker
 * Converts formatted HTML text to WhatsApp-compatible markdown format
 */

// Create context menu on install
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'copy-whatsapp-format',
    title: 'Copy as WhatsApp Format',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId !== 'copy-whatsapp-format') {
    return;
  }

  try {
    // Step 1: Get selected HTML by injecting a script file
    var htmlResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['get-selection.js']
    });

    console.log('[WA Format] HTML results:', htmlResults);

    if (!htmlResults || !htmlResults[0] || !htmlResults[0].result) {
      showNotification('Error', 'No text selected.');
      return;
    }

    var html = htmlResults[0].result;
    console.log('[WA Format] Extracted HTML:', html);

    // Step 2: Convert to WhatsApp format (runs in service worker)
    var whatsappText = convertHTMLToWhatsApp(html);
    console.log('[WA Format] Converted:', whatsappText);

    if (!whatsappText || whatsappText.trim() === '') {
      showNotification('Error', 'Could not convert selection.');
      return;
    }

    // Step 3: Copy to clipboard by injecting a script file
    // We store the text in a global variable first, then inject the copy script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: function(text) {
        window.__whatsappFormatText = text;
      },
      args: [whatsappText]
    });

    var copyResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['copy-to-clipboard.js']
    });

    console.log('[WA Format] Copy results:', copyResults);

    var success = copyResults && copyResults[0] && copyResults[0].result === true;
    if (success) {
      showNotification('WhatsApp Format', 'Copied to clipboard!');
    } else {
      showNotification('Error', 'Failed to copy.');
    }

  } catch (error) {
    console.error('[WA Format] Error:', error);
    showNotification('Error', 'An error occurred: ' + error.message);
  }
});

// === CONVERSION ENGINE (runs in service worker context) ===

function convertHTMLToWhatsApp(html) {
  if (!html || html.trim() === '') {
    return '';
  }

  var parser = new DOMParser();
  var doc = parser.parseFromString('<div>' + html + '</div>', 'text/html');
  var root = doc.body.firstChild;

  var result = processNode(root, 0);

  return result
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function processNode(node, depth) {
  var result = '';

  if (!node || !node.childNodes) {
    return result;
  }

  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];

    // Text node
    if (child.nodeType === 3) {
      var text = child.textContent;
      var normalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      result += normalized;
      continue;
    }

    // Element node
    if (child.nodeType === 1) {
      var tagName = child.tagName.toLowerCase();

      if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
        continue;
      }

      var childContent = processNode(child, depth);

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
        var href = child.getAttribute('href');
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
  var result = '';
  var indent = '';
  for (var d = 0; d < depth; d++) {
    indent += '  ';
  }

  for (var i = 0; i < listNode.children.length; i++) {
    var child = listNode.children[i];
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    var itemText = '';
    var nestedListContent = '';

    for (var j = 0; j < child.childNodes.length; j++) {
      var liChild = child.childNodes[j];
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
        var liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1);
        } else {
          itemText += processNode(liChild, depth + 1);
        }
      }
    }

    var trimmedText = itemText.trim();
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
  var result = '';
  var indent = '';
  for (var d = 0; d < depth; d++) {
    indent += '  ';
  }
  var itemIndex = 1;

  for (var i = 0; i < listNode.children.length; i++) {
    var child = listNode.children[i];
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    var itemText = '';
    var nestedListContent = '';

    for (var j = 0; j < child.childNodes.length; j++) {
      var liChild = child.childNodes[j];
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
        var liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1);
        } else {
          itemText += processNode(liChild, depth + 1);
        }
      }
    }

    var trimmedText = itemText.trim();
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
  var lines = content.trim().split('\n');
  var result = [];
  for (var i = 0; i < lines.length; i++) {
    var line = '> ' + lines[i].trim();
    if (line !== '> ') {
      result.push(line);
    }
  }
  return result.join('\n');
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
