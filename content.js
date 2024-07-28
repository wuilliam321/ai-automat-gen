let currentTarget = null;
let hoverListener;
let clickListener;
let isActive = false;

// Función para escapar caracteres especiales en HTML
function escapeHtml(html) {
  const div = document.createElement('div');
  div.innerText = html;
  return div.innerHTML;
}

function addListeners() {
  hoverListener = (event) => {
    const target = event.target;

    chrome.storage.local.get(['isActive'], function(result) {
      if (!result.isActive) return;

      // Guardar el nuevo elemento como el objetivo actual
      currentTarget = target;

      // Añadir clase de resaltado
      target.classList.add('hover-highlight');

      // Remover clase de resaltado y listeners al quitar el cursor
      target.addEventListener('mouseout', () => {
        removeListeners(target);
      }, { once: true });

      // Capturar clic y enviar mensaje al background script
      clickListener = () => {
        const outerHTML = target.outerHTML;

        // Intentar enviar el mensaje al background script
        try {
          chrome.runtime.sendMessage({ action: 'addStep', htmlContent: escapeHtml(outerHTML) }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error al enviar mensaje: ', chrome.runtime.lastError.message);
            } else {
              console.log('Mensaje enviado: ', response);
            }
          });
        } catch (error) {
          console.error('Error al enviar mensaje: ', error);
        }
      };

      target.addEventListener('click', clickListener, { once: true });
    });
  };

  document.addEventListener('mouseover', hoverListener);
}

function removeListeners(target) {
  if (target && clickListener) {
    target.removeEventListener('click', clickListener);
    target.classList.remove('hover-highlight');
  }
  currentTarget = null;
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes);
  if (namespace === 'local' && 'isActive' in changes) {
    isActive = changes.isActive.newValue;
    if (isActive) {
      addListeners();
    } else {
      if (currentTarget) {
        removeListeners(currentTarget);
      }
    }
  }
});

// Inicializar listeners basados en el estado inicial
chrome.storage.local.get(['isActive'], function(result) {
  isActive = result.isActive || false;
  if (isActive) {
    addListeners();
  }
});
