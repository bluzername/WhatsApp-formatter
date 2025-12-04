/**
 * Copy text to clipboard - injected into page context
 * The text is stored in window.__whatsappFormatText by the background script
 */
(function() {
  var text = window.__whatsappFormatText;
  if (!text) {
    console.error('[WA Format] No text to copy');
    return false;
  }

  return navigator.clipboard.writeText(text).then(function() {
    console.log('[WA Format] Copy success');
    delete window.__whatsappFormatText;
    return true;
  }).catch(function(err) {
    console.error('[WA Format] Clipboard write failed:', err);
    return false;
  });
})();
