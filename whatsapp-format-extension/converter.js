/**
 * WhatsApp Formatter - HTML to WhatsApp markdown converter.
 *
 * Single source of truth for the conversion logic. It is loaded in two ways:
 *  - in the page, injected by background.js before get-selection.js, where it
 *    registers globalThis.WhatsAppConverter;
 *  - in Node (tests), via require(), where it is exported as a CommonJS module.
 *
 * The converter takes a DOMParser constructor so it works in both environments.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.WhatsAppConverter = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var TEXT_NODE = 3;
  var ELEMENT_NODE = 1;
  var INDENT = '  ';
  var SKIPPED_TAGS = { script: true, style: true, noscript: true };

  var INLINE_WRAPPERS = {
    b: '*', strong: '*',
    i: '_', em: '_',
    s: '~', strike: '~', del: '~',
    code: '`'
  };

  /**
   * Convert an HTML fragment to WhatsApp markdown.
   * @param {string} html
   * @param {Function} [Parser] DOMParser constructor (defaults to the global one)
   * @returns {string}
   */
  function convertHTMLToWhatsApp(html, Parser) {
    if (!html || html.trim() === '') return '';
    var ParserImpl = Parser || (typeof DOMParser !== 'undefined' ? DOMParser : null);
    if (!ParserImpl) throw new Error('No DOMParser available');

    var doc = new ParserImpl().parseFromString('<div>' + html + '</div>', 'text/html');
    var root = doc.body.firstChild;

    return processNode(root, 0)
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+$/gm, '')
      .replace(/\*\*+/g, '*')   // collapse nested bold
      .replace(/__+/g, '_')     // collapse nested italic
      .replace(/~~+/g, '~')     // collapse nested strikethrough
      .trim();
  }

  function normalizeText(text) {
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
  }

  function wrapInline(marker, content) {
    var trimmed = content.trim();
    return trimmed ? marker + trimmed + marker : '';
  }

  function processNode(node, depth) {
    var result = '';
    if (!node || !node.childNodes) return result;

    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];

      if (child.nodeType === TEXT_NODE) {
        var normalized = normalizeText(child.textContent);
        if (normalized.trim() !== '') {
          result += normalized;
        } else if (result.length > 0 && !/\s$/.test(result)) {
          // Whitespace between inline elements ("<b>a</b> <i>b</i>") is a
          // real separator; whitespace after a block (already ends with \n) is not.
          result += ' ';
        }
        continue;
      }

      if (child.nodeType !== ELEMENT_NODE) continue;

      var tag = child.tagName.toLowerCase();
      if (SKIPPED_TAGS[tag]) continue;

      if (tag === 'ul' || tag === 'ol') {
        if (result.length > 0 && !result.endsWith('\n')) result += '\n';
        result += formatList(child, depth, tag === 'ol');
      } else if (tag === 'li') {
        // Standalone li (selection without the parent list)
        var liText = formatListItemText(child, depth).text;
        if (liText.trim()) result += '- ' + liText.trim() + '\n';
      } else if (tag === 'br') {
        result += '\n';
      } else if (tag === 'hr') {
        result += '\n---\n';
      } else {
        result += formatElement(tag, processNode(child, depth));
      }
    }

    return result;
  }

  function formatElement(tag, content) {
    var trimmed = content.trim();

    if (INLINE_WRAPPERS[tag]) return wrapInline(INLINE_WRAPPERS[tag], content);

    switch (tag) {
      case 'pre':
        return trimmed ? '\n`' + trimmed + '`\n' : '';
      case 'blockquote':
        return '\n' + formatBlockquote(content) + '\n';
      case 'a':
        return content; // link text only; WhatsApp has no link markup
      case 'p':
        return trimmed ? trimmed + '\n\n' : '';
      case 'div':
      case 'tr':
        return trimmed ? trimmed + '\n' : '';
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        return trimmed ? '*' + trimmed + '*\n\n' : '';
      case 'td':
      case 'th':
        return trimmed ? trimmed + ' | ' : '';
      default:
        return content;
    }
  }

  /**
   * Text of one list item plus any nested lists rendered one level deeper.
   */
  function formatListItemText(li, depth) {
    var text = '';
    var nested = '';

    for (var j = 0; j < li.childNodes.length; j++) {
      var child = li.childNodes[j];
      if (child.nodeType === TEXT_NODE) {
        text += child.textContent.replace(/\s+/g, ' ');
      } else if (child.nodeType === ELEMENT_NODE) {
        var tag = child.tagName.toLowerCase();
        if (tag === 'ul' || tag === 'ol') {
          nested += formatList(child, depth + 1, tag === 'ol');
        } else if (INLINE_WRAPPERS[tag]) {
          text += wrapInline(INLINE_WRAPPERS[tag], child.textContent.replace(/\s+/g, ' '));
        } else {
          text += processNode(child, depth + 1);
        }
      }
    }

    return { text: text, nested: nested };
  }

  function formatList(listNode, depth, ordered) {
    var result = '';
    var indent = new Array(depth + 1).join(INDENT);
    var index = 1;

    for (var i = 0; i < listNode.children.length; i++) {
      var li = listNode.children[i];
      if (li.tagName.toLowerCase() !== 'li') continue;

      var item = formatListItemText(li, depth);
      var text = item.text.trim();
      if (text) {
        result += indent + (ordered ? index + '. ' : '- ') + text + '\n';
        if (ordered) index++;
      }
      if (item.nested) result += item.nested;
    }

    return result;
  }

  function formatBlockquote(content) {
    if (!content || !content.trim()) return '';
    var lines = content.trim().split('\n');
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var line = '> ' + lines[i].trim();
      if (line !== '> ') out.push(line);
    }
    return out.join('\n');
  }

  return { convertHTMLToWhatsApp: convertHTMLToWhatsApp };
});
