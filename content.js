document.addEventListener('mouseover', function(event) {
  const target = event.target;

  // Añadir clase de resaltado
  target.classList.add('hover-highlight');

  // Remover clase de resaltado al quitar el cursor
  target.addEventListener('mouseout', function() {
    target.classList.remove('hover-highlight');
  }, { once: true });

  // Capturar clic y enviar mensaje al background script
  target.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const outerHTML = target.outerHTML;

    // Intentar enviar el mensaje al background script
    try {
      chrome.runtime.sendMessage({ action: 'addStep', htmlContent: outerHTML }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error al enviar mensaje: ', chrome.runtime.lastError.message);
        } else {
          console.log('Mensaje enviado: ', response);
        }
      });
    } catch (error) {
      console.error('Error al enviar mensaje: ', error);
    }
  }, { once: true });
});
