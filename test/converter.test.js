const test = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const { convertHTMLToWhatsApp } = require('../whatsapp-format-extension/converter.js');

const { DOMParser } = new JSDOM('').window;
const convert = (html) => convertHTMLToWhatsApp(html, DOMParser);

const cases = [
  ['empty input', '', ''],
  ['whitespace only', '   \n ', ''],
  ['plain text', 'Just plain text', 'Just plain text'],
  ['bold', '<b>Bold text</b>', '*Bold text*'],
  ['strong', '<strong>Strong</strong>', '*Strong*'],
  ['italic', '<i>Italic</i>', '_Italic_'],
  ['em', '<em>Em</em>', '_Em_'],
  ['strikethrough', '<s>Gone</s> <del>Also</del>', '~Gone~ ~Also~'],
  ['inline code', '<code>x = 1</code>', '`x = 1`'],
  ['pre block', '<pre>line 1</pre>', '`line 1`'],
  ['bold with surrounding text', 'This is <b>important</b> stuff', 'This is *important* stuff'],
  ['nested bold in italic', '<i><b>both</b></i>', '_*both*_'],
  ['paragraphs', '<p>One</p><p>Two</p>', 'One\n\nTwo'],
  ['line break', 'a<br>b', 'a\nb'],
  ['horizontal rule', 'a<hr>b', 'a\n---\nb'],
  ['bullet list', '<ul><li>Item 1</li><li>Item 2</li></ul>', '- Item 1\n- Item 2'],
  ['numbered list', '<ol><li>First</li><li>Second</li></ol>', '1. First\n2. Second'],
  ['nested bullet list', '<ul><li>Parent<ul><li>Child</li></ul></li></ul>', '- Parent\n  - Child'],
  ['mixed nested list', '<ol><li>A<ul><li>a1</li></ul></li><li>B</li></ol>', '1. A\n  - a1\n2. B'],
  ['bold inside list item', '<ul><li><b>Key</b>: value</li></ul>', '- *Key*: value'],
  ['standalone li', '<li>Alone</li>', '- Alone'],
  ['empty list items skipped', '<ul><li></li><li>Only</li></ul>', '- Only'],
  ['blockquote', '<blockquote>This is quoted</blockquote>', '> This is quoted'],
  ['multi-line blockquote', '<blockquote><p>One</p><p>Two</p></blockquote>', '> One\n> Two'],
  ['link keeps text only', '<a href="https://google.com">Google</a>', 'Google'],
  ['heading becomes bold', '<h1>Title</h1>', '*Title*'],
  ['h3 becomes bold', '<h3>Sub</h3><p>Body</p>', '*Sub*\n\nBody'],
  ['table rows', '<table><tr><td>a</td><td>b</td></tr></table>', 'a | b |'],
  ['script and style dropped', '<p>Keep</p><script>alert(1)</script><style>p{}</style>', 'Keep'],
  ['whitespace collapsed', '<p>too    many\n\nspaces</p>', 'too many spaces'],
  ['triple newlines collapsed', '<p>a</p><br><br><br><p>b</p>', 'a\n\nb'],
];

for (const [name, input, expected] of cases) {
  test(name, () => {
    assert.equal(convert(input), expected);
  });
}

test('complex document', () => {
  const html = [
    '<h2>Meeting Notes</h2>',
    '<p><strong>Date:</strong> December 3, 2024</p>',
    '<ul><li>Timeline</li><li>Budget<ul><li>Q1: $50,000</li></ul></li></ul>',
    '<blockquote>Ship it</blockquote>',
  ].join('');
  assert.equal(
    convert(html),
    '*Meeting Notes*\n\n*Date:* December 3, 2024\n\n- Timeline\n- Budget\n  - Q1: $50,000\n\n> Ship it'
  );
});

test('throws without a DOMParser', () => {
  assert.throws(() => convertHTMLToWhatsApp('<b>x</b>', null), /DOMParser/);
});
