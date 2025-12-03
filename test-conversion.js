#!/usr/bin/env node
/**
 * Standalone test script for the WhatsApp Format conversion logic
 * Run with: node test-conversion.js
 *
 * This extracts the conversion logic from background.js and tests it
 * using jsdom to simulate the DOM environment.
 */

// We'll use a simple approach - parse HTML and convert
// This mimics what the extension does

const { JSDOM } = require('jsdom');

// ============================================================================
// CONVERSION LOGIC (copied from background.js)
// ============================================================================

function convertHTMLToWhatsApp(html) {
  if (!html || html.trim() === '') {
    return '';
  }

  const dom = new JSDOM(`<div>${html}</div>`);
  const root = dom.window.document.body.firstChild;

  const result = processNode(root, 0, dom.window.document);

  return result
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function processNode(node, depth = 0, document) {
  let result = '';

  if (!node || !node.childNodes) {
    return result;
  }

  for (const child of node.childNodes) {
    if (child.nodeType === 3) { // TEXT_NODE
      const text = child.textContent;
      const normalized = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
      result += normalized;
      continue;
    }

    if (child.nodeType === 1) { // ELEMENT_NODE
      const tagName = child.tagName.toLowerCase();

      if (['script', 'style', 'noscript'].includes(tagName)) {
        continue;
      }

      const childContent = processNode(child, depth, document);

      switch (tagName) {
        case 'b':
        case 'strong':
          if (childContent.trim()) {
            result += '*' + childContent.trim() + '*';
          }
          break;

        case 'i':
        case 'em':
          if (childContent.trim()) {
            result += '_' + childContent.trim() + '_';
          }
          break;

        case 's':
        case 'strike':
        case 'del':
          if (childContent.trim()) {
            result += '~' + childContent.trim() + '~';
          }
          break;

        case 'code':
          if (childContent.trim()) {
            result += '`' + childContent.trim() + '`';
          }
          break;

        case 'pre':
          if (childContent.trim()) {
            result += '\n`' + childContent.trim() + '`\n';
          }
          break;

        case 'ul':
          result += '\n' + formatBulletList(child, depth, document) + '\n';
          break;

        case 'ol':
          result += '\n' + formatNumberedList(child, depth, document) + '\n';
          break;

        case 'li':
          result += '- ' + childContent.trim() + '\n';
          break;

        case 'blockquote':
          result += '\n' + formatBlockquote(childContent) + '\n';
          break;

        case 'a':
          const href = child.getAttribute('href');
          if (href && href.trim() && childContent.trim()) {
            result += '[' + childContent.trim() + '](' + href.trim() + ')';
          } else {
            result += childContent;
          }
          break;

        case 'br':
          result += '\n';
          break;

        case 'p':
          if (childContent.trim()) {
            result += childContent.trim() + '\n\n';
          }
          break;

        case 'div':
          if (childContent.trim()) {
            result += childContent + '\n';
          }
          break;

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

        default:
          result += childContent;
          break;
      }
    }
  }

  return result;
}

function formatBulletList(listNode, depth = 0, document) {
  let result = '';
  const indent = '  '.repeat(depth);

  for (const child of listNode.children) {
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    let itemText = '';
    let nestedListContent = '';

    for (const liChild of child.childNodes) {
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
        const liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1, document);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1, document);
        } else {
          itemText += processNode(liChild, depth + 1, document);
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

function formatNumberedList(listNode, depth = 0, document) {
  let result = '';
  const indent = '  '.repeat(depth);
  let itemIndex = 1;

  for (const child of listNode.children) {
    if (child.tagName.toLowerCase() !== 'li') {
      continue;
    }

    let itemText = '';
    let nestedListContent = '';

    for (const liChild of child.childNodes) {
      if (liChild.nodeType === 3) {
        itemText += liChild.textContent.replace(/\s+/g, ' ');
      } else if (liChild.nodeType === 1) {
        const liChildTag = liChild.tagName.toLowerCase();
        if (liChildTag === 'ul') {
          nestedListContent += formatBulletList(liChild, depth + 1, document);
        } else if (liChildTag === 'ol') {
          nestedListContent += formatNumberedList(liChild, depth + 1, document);
        } else {
          itemText += processNode(liChild, depth + 1, document);
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
    .map(line => '> ' + line.trim())
    .filter(line => line !== '> ')
    .join('\n');
}

// ============================================================================
// TEST CASES
// ============================================================================

const testCases = [
  {
    name: 'Simple bold',
    input: '<b>bold text</b>',
    expected: '*bold text*'
  },
  {
    name: 'Simple italic',
    input: '<i>italic text</i>',
    expected: '_italic text_'
  },
  {
    name: 'Strong tag',
    input: '<strong>strong text</strong>',
    expected: '*strong text*'
  },
  {
    name: 'Em tag',
    input: '<em>emphasized text</em>',
    expected: '_emphasized text_'
  },
  {
    name: 'Strikethrough',
    input: '<s>deleted text</s>',
    expected: '~deleted text~'
  },
  {
    name: 'Inline code',
    input: '<code>const x = 1</code>',
    expected: '`const x = 1`'
  },
  {
    name: 'Mixed formatting in paragraph',
    input: '<p>This has <b>bold</b> and <i>italic</i> text.</p>',
    expected: 'This has *bold* and _italic_ text.'
  },
  {
    name: 'Bullet list',
    input: '<ul><li>Item 1</li><li>Item 2</li></ul>',
    expected: '- Item 1\n- Item 2'
  },
  {
    name: 'Numbered list',
    input: '<ol><li>First</li><li>Second</li></ol>',
    expected: '1. First\n2. Second'
  },
  {
    name: 'Blockquote',
    input: '<blockquote>This is quoted</blockquote>',
    expected: '> This is quoted'
  },
  {
    name: 'Link',
    input: '<a href="https://google.com">Google</a>',
    expected: '[Google](https://google.com)'
  },
  {
    name: 'Heading 1',
    input: '<h1>Title</h1>',
    expected: '# Title'
  },
  {
    name: 'Nested list',
    input: '<ul><li>Parent<ul><li>Child</li></ul></li></ul>',
    expected: '- Parent\n  - Child'
  },
  {
    name: 'Plain text',
    input: 'Just plain text',
    expected: 'Just plain text'
  },
  {
    name: 'Bold with surrounding text',
    input: 'This is <b>important</b> stuff',
    expected: 'This is *important* stuff'
  }
];

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('='.repeat(60));
console.log('WhatsApp Format Conversion - Test Suite');
console.log('='.repeat(60));
console.log();

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = convertHTMLToWhatsApp(test.input);
  const success = result === test.expected;

  if (success) {
    console.log(`✅ PASS: ${test.name}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.name}`);
    console.log(`   Input:    ${JSON.stringify(test.input)}`);
    console.log(`   Expected: ${JSON.stringify(test.expected)}`);
    console.log(`   Got:      ${JSON.stringify(result)}`);
    failed++;
  }
}

console.log();
console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60));

// ============================================================================
// INTERACTIVE TEST
// ============================================================================

console.log();
console.log('Interactive Examples:');
console.log('-'.repeat(40));

const examples = [
  '<p><b>Bold</b> and <i>italic</i></p>',
  '<ul><li>First</li><li>Second</li><li>Third</li></ul>',
  '<blockquote>Famous quote here</blockquote>',
  '<p>Check <a href="https://example.com">this link</a></p>'
];

for (const html of examples) {
  console.log();
  console.log('HTML Input:');
  console.log('  ' + html);
  console.log('WhatsApp Output:');
  console.log('  ' + JSON.stringify(convertHTMLToWhatsApp(html)));
}

process.exit(failed > 0 ? 1 : 0);
