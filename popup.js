document.addEventListener('DOMContentLoaded', () => {
  const stepsContainer = document.getElementById('steps-container');
  const finishButton = document.getElementById('finish-button');
  const clearAllButton = document.getElementById('clear-all-button');
  const toggleButton = document.getElementById('toggle-button');
  const currentUrlInput = document.getElementById('current-url');
  const loadingSpinner = document.getElementById('loading-spinner');
  const codeContainer = document.getElementById('content');

  let isActive = false;

  // Recuperar pasos guardados y el estado activo
  chrome.storage.local.get(['steps', 'isActive', 'currentUrl', 'code'], function(result) {
    const steps = result.steps || [];
    steps.forEach((step) => {
      addStep(step.id, step.html, step.notes, step.action);
    });
    isActive = result.isActive || false;
    currentUrlInput.value = result.currentUrl || '';
    codeContainer.textContent = result.code;
    updateToggleButton();
  });

  // Agregar un nuevo paso al contenedor
  function addStep(stepId, htmlContent, notes, action) {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step');
    stepDiv.setAttribute('data-step-id', stepId);
    stepDiv.innerHTML = `
      <h4>Paso <span class="step-number"></span> <span class="delete-step" data-step-id="${stepId}">X</span></h4>
      <select id="action-select">
        <option value="">Seleccionar acción</option>
        <option value="click"${action == "click" ? ' selected="selected"' : ''}>Click</option>
        <option value="hover"${action == "hover" ? ' selected="selected"' : ''}>Hover</option>
        <option value="dblclick"${action == "dblclick" ? ' selected="selected"' : ''}>Doble click</option>
        <option value="keydown"${action == "keydown" ? ' selected="selected"' : ''}>Tecla presionada</option>
        <option value="keyup"${action == "keyup" ? ' selected="selected"' : ''}>Tecla soltada</option>
        <option value="blur"${action == "blur" ? ' selected="selected"' : ''}>Perder foco</option>
        <option value="focus"${action == "focus" ? ' selected="selected"' : ''}>Obtener foco</option>
        <option value="change"${action == "change" ? ' selected="selected"' : ''}>Cambio de valor</option>
        <option value="input"${action == "input" ? ' selected="selected"' : ''}>Entrada de texto</option>
        <option value="assertion"${action == "assertion" ? ' selected=selected' : ''}>Assertion</option>
      </select>
      <textarea placeholder="Notas...">${notes || ''}</textarea>
      <pre>${htmlContent}</pre>
    `;
    stepsContainer.appendChild(stepDiv);

    // Añadir evento de eliminación de paso
    stepDiv.querySelector('.delete-step').addEventListener('click', () => {
      chrome.storage.local.get(['steps'], function(result) {
        const steps = result.steps || [];
        steps.forEach((step, idx) => {
          const stepId = stepDiv.getAttribute('data-step-id');
          if (step.id === stepId) {
            steps.splice(idx, 1);
            stepDiv.remove();
          }
        });

        updateStepNumbers();

        chrome.storage.local.set({ steps }, () => {
          console.log("step deleted")
        });
      });
    });

    // Guardar contenido del textarea
    stepDiv.querySelector('textarea').addEventListener('focusout', saveSteps);
    stepDiv.querySelector('select').addEventListener('change', saveSteps);

    updateStepNumbers();
  }

  // Guardar los pasos en el almacenamiento local
  function saveSteps() {
    chrome.storage.local.get(['steps'], function(result) {
      const steps = result.steps || [];
      steps.forEach((step, idx) => {
        const stepDivs = stepsContainer.getElementsByClassName('step');
        for (let stepDiv of stepDivs) {
          const stepId = stepDiv.getAttribute('data-step-id');
          if (step.id === stepId) {
            const action = stepDiv.querySelector('select').value;
            const notes = stepDiv.querySelector('textarea').value;
            steps[idx] = { id: step.id, action, html: step.html, notes };
          }
        }
      });

      chrome.storage.local.set({ steps }, () => {
        console.log("steps updated", steps)
      });

      const currentUrl = document.getElementById('current-url').value;
      chrome.storage.local.set({ currentUrl }, () => {
        console.log("url updated", currentUrl)
      });
    });
  }

  // Actualizar números de pasos después de eliminar uno
  function updateStepNumbers() {
    const stepDivs = stepsContainer.getElementsByClassName('step');
    Array.from(stepDivs).forEach((stepDiv, index) => {
      const stepNumber = index + 1;
      stepDiv.querySelector('.step-number').textContent = stepNumber;
    });
  }

  // Copiar todos los pasos al portapapeles
  finishButton.addEventListener('click', () => {
    document.getElementById('content').textContent = "";

    // Show the loading spinner
    loadingSpinner.style.display = 'block';

    const steps = [];
    const stepDivs = stepsContainer.getElementsByClassName('step');
    for (let stepDiv of stepDivs) {
      const action = stepDiv.querySelector('select').value;
      const notes = stepDiv.querySelector('textarea').value;
      const htmlContent = stepDiv.querySelector('pre').innerText;
      const id = stepDiv.getAttribute('data-step-id');
      steps.push({ id, action, notes, html: htmlContent });
    }

    const currentUrl = document.getElementById('current-url').value;

    // Hacer una solicitud POST a la API externa con los datos de los pasos
    fetch('http://192.168.1.19:3001/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps, currentUrl })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Pasos enviados a la API: ', data);

        codeContainer.textContent = data.message;
        loadingSpinner.style.display = 'none';

        const contenido = data.message;
        chrome.storage.local.set({ code: contenido });
      })
      .catch((error) => {
        console.error('Error al enviar pasos a la API: ', error);
        loadingSpinner.style.display = 'none';
      });
  });

  // Limpiar todos los pasos
  clearAllButton.addEventListener('click', () => {
    stepsContainer.innerHTML = '';
    chrome.storage.local.set({ steps: [] });
  });

  // Actualizar el botón de ON/OFF
  function updateToggleButton() {
    toggleButton.textContent = isActive ? 'Recording' : 'Stopped';
  }

  // Cambiar el estado de la extensión
  toggleButton.addEventListener('click', () => {
    isActive = !isActive;
    chrome.storage.local.set({ isActive });
    updateToggleButton();
  });

  // Guardar pasos al modificar notas y URL
  stepsContainer.addEventListener('focusout', saveSteps);
  currentUrlInput.addEventListener('focusout', saveSteps);
});
