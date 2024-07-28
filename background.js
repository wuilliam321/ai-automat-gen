// Función para generar un ID único
function generateUniqueId() {
  return 'step-' + Math.random().toString(36).substr(2, 9);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addStep') {
    chrome.storage.local.get(['steps'], function(result) {
      const steps = result.steps || [];
      const stepId = generateUniqueId();
      steps.push({ id: stepId, html: message.htmlContent, notes: result.notes });
      chrome.storage.local.set({ steps }, () => {
        sendResponse({ status: 'success' });
      });
    });
    return true; // Mantener el canal abierto para sendResponse
  }
});
