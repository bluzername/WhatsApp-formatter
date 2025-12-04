/**
 * Content script functions for WhatsApp Format extension
 * These run in the page context, not the service worker
 */

// This function is called by the background script to get selected HTML
function getSelectedHTML() {
  var selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  var range = selection.getRangeAt(0);
  var container = document.createElement('div');
  container.appendChild(range.cloneContents());
  return container.innerHTML;
}

// Execute and return result
getSelectedHTML();
