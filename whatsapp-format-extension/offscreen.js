/**
 * Offscreen document for clipboard operations
 * This runs in a document context where clipboard APIs work reliably
 */

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'copy-to-clipboard') {
    copyToClipboard(message.text)
      .then(function() {
        sendResponse({ success: true });
      })
      .catch(function(err) {
        console.error('[WA Formatter Offscreen] Copy failed:', err);
        sendResponse({ success: false, error: err.message });
      });
    return true; // Keep channel open for async response
  }
});

async function copyToClipboard(text) {
  // Method 1: Try navigator.clipboard API first
  try {
    await navigator.clipboard.writeText(text);
    console.log('[WA Formatter Offscreen] Clipboard API success');
    return;
  } catch (err) {
    console.log('[WA Formatter Offscreen] Clipboard API failed, trying fallback:', err);
  }

  // Method 2: Fallback to execCommand
  var textarea = document.getElementById('clipboard-textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.focus();
  textarea.select();

  var success = document.execCommand('copy');
  textarea.value = '';

  if (!success) {
    throw new Error('execCommand copy failed');
  }
  console.log('[WA Formatter Offscreen] execCommand success');
}
