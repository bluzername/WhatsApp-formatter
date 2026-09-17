/**
 * Runs in page context (injected after converter.js by background.js).
 * Serialises the current selection to HTML and converts it to WhatsApp format.
 * Returns null when nothing usable is selected.
 */
(function () {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  var container = document.createElement('div');
  container.appendChild(selection.getRangeAt(0).cloneContents());
  var html = container.innerHTML;
  if (!html || html.trim() === '') return null;

  return globalThis.WhatsAppConverter.convertHTMLToWhatsApp(html);
})();
