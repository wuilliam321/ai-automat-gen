document.addEventListener('DOMContentLoaded', () => {
  const stepsContainer = document.getElementById('steps-container');
  const finishButton = document.getElementById('finish-button');
  const clearAllButton = document.getElementById('clear-all-button');
  const toggleButton = document.getElementById('toggle-button');

  let isActive = false;

  // Recuperar pasos guardados y el estado activo
  chrome.storage.local.get(['steps', 'isActive'], function(result) {
    const steps = result.steps || [];
    steps.forEach((step, index) => {
      addStep(index + 1, step.html, step.notes);
    });
    isActive = result.isActive || false;
    updateToggleButton();
  });

  // Función para escapar caracteres especiales en HTML
  function escapeHtml(html) {
    const div = document.createElement('div');
    div.innerText = html;
    return div.innerHTML;
  }

  // Agregar un nuevo paso al contenedor
  function addStep(stepNumber, htmlContent, notes) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');
    stepDiv.innerHTML = `
      <h4>Paso ${stepNumber} <span class="delete-step" data-step="${stepNumber}">X</span></h4>
      <textarea placeholder="Notas...">${notes || ''}</textarea>
      <pre>${escapeHtml(htmlContent)}</pre>
    `;
    stepsContainer.appendChild(stepDiv);

    // Añadir evento de eliminación de paso
    stepDiv.querySelector('.delete-step').addEventListener('click', () => {
      stepDiv.remove();
      updateStepNumbers();
      saveSteps();
    });

    // Guardar contenido del textarea
    stepDiv.querySelector('textarea').addEventListener('input', saveSteps);
  }

  // Escuchar mensajes del content script
  chrome.runtime.onMessage.addListener((request) => {
    if (isActive && request.action === 'addStep') {
      const stepNumber = stepsContainer.children.length + 1;
      addStep(stepNumber, request.htmlContent, '');
      saveSteps();
    }
  });

  // Guardar los pasos en el almacenamiento local
  function saveSteps() {
    const steps = [];
    const stepDivs = stepsContainer.getElementsByClassName('step');
    for (let stepDiv of stepDivs) {
      const notes = stepDiv.querySelector('textarea').value;
      const htmlContent = stepDiv.querySelector('pre').innerText;
      steps.push({ notes, htmlContent });
    }
    chrome.storage.local.set({ steps });
  }

  // Actualizar números de pasos después de eliminar uno
  function updateStepNumbers() {
    const stepDivs = stepsContainer.getElementsByClassName('step');
    Array.from(stepDivs).forEach((stepDiv, index) => {
      const stepNumber = index + 1;
      stepDiv.querySelector('h4').innerHTML = `Paso ${stepNumber} <span class="delete-step" data-step="${stepNumber}">X</span>`;
    });
  }

  // Copiar todos los pasos al portapapeles
  finishButton.addEventListener('click', () => {
    const steps = [];
    const stepDivs = stepsContainer.getElementsByClassName('step');
    for (let stepDiv of stepDivs) {
      const notes = stepDiv.querySelector('textarea').value;
      const htmlContent = stepDiv.querySelector('pre').innerText;
      steps.push(`## Paso ${steps.length + 1}\nNotas: ${notes}\n\`\`\`html\n${htmlContent}\n\`\`\`\n`);
    }
    const finalContent = steps.join('\n');
    navigator.clipboard.writeText(finalContent).then(() => {
      alert('Contenido copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  });

  // Limpiar todos los pasos
  clearAllButton.addEventListener('click', () => {
    stepsContainer.innerHTML = '';
    chrome.storage.local.set({ steps: [] });
  });

  // Actualizar el botón de ON/OFF
  function updateToggleButton() {
    toggleButton.textContent = isActive ? 'ON' : 'OFF';
  }

  // Cambiar el estado de la extensión
  toggleButton.addEventListener('click', () => {
    isActive = !isActive;
    chrome.storage.local.set({ isActive });
    updateToggleButton();
  });

  // Guardar pasos al modificar notas
  stepsContainer.addEventListener('input', saveSteps);
});
