/**
 * WhatsApp Formatter - Chrome Extension Background Service Worker
 * Handles context menu and clipboard operations
 */

// Create context menu on install
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'copy-whatsapp-format',
    title: 'Copy as WhatsApp Formatter',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async function(info, tab) {
  if (info.menuItemId !== 'copy-whatsapp-format') {
    return;
  }

  try {
    // Step 1: Get selected HTML and convert to WhatsApp format (in page context)
    var results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['get-selection.js']
    });

    console.log('[WA Formatter] Conversion results:', results);

    if (!results || !results[0] || !results[0].result) {
      showNotification('Error', 'No text selected.');
      return;
    }

    var whatsappText = results[0].result;
    console.log('[WA Formatter] Converted text:', whatsappText);

    if (!whatsappText || whatsappText.trim() === '') {
      showNotification('Error', 'Could not convert selection.');
      return;
    }

    // Step 2: Copy to clipboard using offscreen document
    await copyToClipboardViaOffscreen(whatsappText);
    showNotification('WhatsApp Formatter', 'Copied to clipboard!');

  } catch (error) {
    console.error('[WA Formatter] Error:', error);
    showNotification('Error', 'An error occurred: ' + error.message);
  }
});

// === CLIPBOARD HELPER (uses offscreen document) ===

let offscreenDocumentCreated = false;

async function setupOffscreenDocument() {
  if (offscreenDocumentCreated) {
    return;
  }

  try {
    // Check if getContexts is available (Chrome 116+)
    // Older Chrome versions don't have this API
    if (chrome.runtime.getContexts) {
      const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
      });

      if (existingContexts.length > 0) {
        offscreenDocumentCreated = true;
        return;
      }
    }

    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['CLIPBOARD'],
      justification: 'Copy formatted text to clipboard'
    });

    offscreenDocumentCreated = true;
  } catch (err) {
    // Handle "document already exists" error gracefully
    // This can happen if service worker restarts but offscreen doc persists
    if (err.message && err.message.includes('already exists')) {
      offscreenDocumentCreated = true;
      return;
    }
    console.error('[WA Formatter] Failed to create offscreen document:', err);
    throw err;
  }
}

async function copyToClipboardViaOffscreen(text) {
  await setupOffscreenDocument();

  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage({ type: 'copy-to-clipboard', text: text }, function(response) {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (response && response.success) {
        resolve();
      } else {
        reject(new Error(response ? response.error : 'Unknown clipboard error'));
      }
    });
  });
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
