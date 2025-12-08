/**
 * Get selected HTML and convert to WhatsApp format
 * This runs in page context where DOMParser is available
 */
(function() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var range = selection.getRangeAt(0);
  var container = document.createElement('div');
  container.appendChild(range.cloneContents());
  var html = container.innerHTML;

  if (!html || html.trim() === '') {
    return null;
  }

  // Convert HTML to WhatsApp format right here in page context
  return convertHTMLToWhatsApp(html);

  function convertHTMLToWhatsApp(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString('<div>' + html + '</div>', 'text/html');
    var root = doc.body.firstChild;

    var result = processNode(root, 0);

    return result
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+$/gm, '')
      .replace(/\*\*+/g, '*')   // Collapse multiple asterisks (nested bold)
      .replace(/__+/g, '_')     // Collapse multiple underscores (nested italic)
      .replace(/~~+/g, '~')     // Collapse multiple tildes (nested strikethrough)
      .trim();
  }

  function processNode(node, depth) {
    var result = '';

    if (!node || !node.childNodes) {
      return result;
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];

      if (child.nodeType === 3) {
        var text = child.textContent;
        var normalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
        // Skip whitespace-only text nodes (they're just formatting in HTML)
        if (normalized.trim() === '') continue;
        result += normalized;
        continue;
      }

      if (child.nodeType === 1) {
        var tagName = child.tagName.toLowerCase();

        if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
          continue;
        }

        // Handle lists specially - don't call processNode first
        if (tagName === 'ul') {
          // Ensure list starts on new line
          if (result.length > 0 && !result.endsWith('\n')) result += '\n';
          result += formatBulletList(child, depth);
        } else if (tagName === 'ol') {
          // Ensure list starts on new line
          if (result.length > 0 && !result.endsWith('\n')) result += '\n';
          result += formatNumberedList(child, depth);
        } else if (tagName === 'li') {
          // Handle standalone li (when user selects list items without parent ul/ol)
          var liText = '';
          for (var j = 0; j < child.childNodes.length; j++) {
            var liChild = child.childNodes[j];
            if (liChild.nodeType === 3) {
              liText += liChild.textContent.replace(/\s+/g, ' ');
            } else if (liChild.nodeType === 1) {
              liText += processNode(liChild, depth);
            }
          }
          if (liText.trim()) result += '- ' + liText.trim() + '\n';
        } else if (tagName === 'br') {
          result += '\n';
        } else if (tagName === 'hr') {
          result += '\n---\n';
        } else {
          // For all other tags, get child content first
          var childContent = processNode(child, depth);

          if (tagName === 'b' || tagName === 'strong') {
            if (childContent.trim()) result += '*' + childContent.trim() + '*';
          } else if (tagName === 'i' || tagName === 'em') {
            if (childContent.trim()) result += '_' + childContent.trim() + '_';
          } else if (tagName === 's' || tagName === 'strike' || tagName === 'del') {
            if (childContent.trim()) result += '~' + childContent.trim() + '~';
          } else if (tagName === 'code') {
            if (childContent.trim()) result += '`' + childContent.trim() + '`';
          } else if (tagName === 'pre') {
            if (childContent.trim()) result += '\n`' + childContent.trim() + '`\n';
          } else if (tagName === 'blockquote') {
            result += '\n' + formatBlockquote(childContent) + '\n';
          } else if (tagName === 'a') {
            result += childContent; // Just use text, skip link formatting
          } else if (tagName === 'p') {
            if (childContent.trim()) result += childContent.trim() + '\n\n';
          } else if (tagName === 'div') {
            if (childContent.trim()) result += childContent.trim() + '\n';
          } else if (tagName === 'h1') {
            if (childContent.trim()) result += '*' + childContent.trim() + '*\n\n';
          } else if (tagName === 'h2') {
            if (childContent.trim()) result += '*' + childContent.trim() + '*\n\n';
          } else if (tagName === 'h3') {
            if (childContent.trim()) result += '*' + childContent.trim() + '*\n\n';
          } else if (tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
            if (childContent.trim()) result += '*' + childContent.trim() + '*\n\n';
          } else if (tagName === 'tr') {
            if (childContent.trim()) result += childContent.trim() + '\n';
          } else if (tagName === 'td' || tagName === 'th') {
            if (childContent.trim()) result += childContent.trim() + ' | ';
          } else {
            result += childContent;
          }
        }
      }
    }

    return result;
  }

  function formatBulletList(listNode, depth) {
    var result = '';
    var indent = '';
    for (var d = 0; d < depth; d++) indent += '  ';

    for (var i = 0; i < listNode.children.length; i++) {
      var child = listNode.children[i];
      if (child.tagName.toLowerCase() !== 'li') continue;

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
            // Handle inline formatting tags directly
            var liChildText = liChild.textContent.replace(/\s+/g, ' ');
            if (liChildTag === 'b' || liChildTag === 'strong') {
              if (liChildText.trim()) itemText += '*' + liChildText.trim() + '*';
            } else if (liChildTag === 'i' || liChildTag === 'em') {
              if (liChildText.trim()) itemText += '_' + liChildText.trim() + '_';
            } else if (liChildTag === 's' || liChildTag === 'strike' || liChildTag === 'del') {
              if (liChildText.trim()) itemText += '~' + liChildText.trim() + '~';
            } else if (liChildTag === 'code') {
              if (liChildText.trim()) itemText += '`' + liChildText.trim() + '`';
            } else {
              itemText += processNode(liChild, depth + 1);
            }
          }
        }
      }

      if (itemText.trim()) result += indent + '- ' + itemText.trim() + '\n';
      if (nestedListContent) result += nestedListContent;
    }

    return result;
  }

  function formatNumberedList(listNode, depth) {
    var result = '';
    var indent = '';
    for (var d = 0; d < depth; d++) indent += '  ';
    var itemIndex = 1;

    for (var i = 0; i < listNode.children.length; i++) {
      var child = listNode.children[i];
      if (child.tagName.toLowerCase() !== 'li') continue;

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
            // Handle inline formatting tags directly
            var liChildText = liChild.textContent.replace(/\s+/g, ' ');
            if (liChildTag === 'b' || liChildTag === 'strong') {
              if (liChildText.trim()) itemText += '*' + liChildText.trim() + '*';
            } else if (liChildTag === 'i' || liChildTag === 'em') {
              if (liChildText.trim()) itemText += '_' + liChildText.trim() + '_';
            } else if (liChildTag === 's' || liChildTag === 'strike' || liChildTag === 'del') {
              if (liChildText.trim()) itemText += '~' + liChildText.trim() + '~';
            } else if (liChildTag === 'code') {
              if (liChildText.trim()) itemText += '`' + liChildText.trim() + '`';
            } else {
              itemText += processNode(liChild, depth + 1);
            }
          }
        }
      }

      if (itemText.trim()) {
        result += indent + itemIndex + '. ' + itemText.trim() + '\n';
        itemIndex++;
      }
      if (nestedListContent) result += nestedListContent;
    }

    return result;
  }

  function formatBlockquote(content) {
    if (!content || !content.trim()) return '';
    var lines = content.trim().split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
      var line = '> ' + lines[i].trim();
      if (line !== '> ') result.push(line);
    }
    return result.join('\n');
  }
})();
