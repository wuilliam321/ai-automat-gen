chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addStep') {
    chrome.storage.local.get(['steps'], function(result) {
      const steps = result.steps || [];
      steps.push({ html: message.htmlContent, notes: '' });
      chrome.storage.local.set({ steps }, () => {
        sendResponse({ status: 'success' });
      });
    });
    return true; // Mantener el canal abierto para sendResponse
  }
});
