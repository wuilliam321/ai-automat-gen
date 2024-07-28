document.addEventListener('DOMContentLoaded', () => {
  const stepsContainer = document.getElementById('steps-container');
  const finishButton = document.getElementById('finish-button');
  const clearAllButton = document.getElementById('clear-all-button');
  const toggleButton = document.getElementById('toggle-button');
  const currentUrlInput = document.getElementById('current-url');

  let isActive = false;

  // Recuperar pasos guardados y el estado activo
  chrome.storage.local.get(['steps', 'isActive', 'currentUrl'], function(result) {
    const steps = result.steps || [];
    steps.forEach((step, index) => {
      addStep(index + 1, step.html, step.notes);
    });
    isActive = result.isActive || false;
    currentUrlInput.value = result.currentUrl || '';
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
    const currentUrl = currentUrlInput.value;
    chrome.storage.local.set({ steps, currentUrl });
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
      steps.push(`## Paso ${steps.length + 1}\nInstrucciones: ${notes}\n\`\`\`html\n${htmlContent}\n\`\`\`\n`);
    }
    const finalContent = `
Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: ${currentUrlInput.value}

Vamos a automatizar con python y playwright, debes generar un archivo
<page>_test.py que ejecute el test, donde page es la pagina en la que estas
actualmente, debes deducirlo de los pasos que te estoy indicando.

Solo crea <page>_test.py y selectores.py, donde ira el codigo y los selectores html.

Vamos a generar selectores que sean por texto preferiblemente luego usa las
reglas estandar de playwright, usa el block code html para ubicar el texto o el
selector mas indicado, has uso de las instrucciones para construir el mejor 
selector posible, con el texto tal como lo indique el html.

El codigo debe correrse con \`pytest --headed\`

Genera el requirements.txt necesario para que sea facil instalar todo
rapidamente

Este es un template de cada page
\`\`\`python
from playwright.sync_api import Page
from selectores import Selectors


def test_codecrafters_flow(page: Page):
    page.goto(url)

    # Paso 1: Indicaciones...
    page.click(Selectors.A_SELECTOR)

    # Paso N: Lo que corresponda

    # Verificar que estamos en la página correcta
    assert # Lo que este indicado en el paso

    page.close()
\`\`\`

${steps.join('\n')}`;

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

  // Guardar pasos al modificar notas y URL
  stepsContainer.addEventListener('input', saveSteps);
  currentUrlInput.addEventListener('input', saveSteps);
});
