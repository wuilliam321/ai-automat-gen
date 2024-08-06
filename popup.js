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
    steps.forEach((step) => {
      addStep(step.id, step.html, step.notes, step.action);
    });
    isActive = result.isActive || false;
    currentUrlInput.value = result.currentUrl || '';
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
    const steps = [];
    const stepDivs = stepsContainer.getElementsByClassName('step');
    for (let stepDiv of stepDivs) {
      const action = stepDiv.querySelector('select').value;
      const notes = stepDiv.querySelector('textarea').value;
      const htmlContent = stepDiv.querySelector('pre').innerText;
      steps.push(`## Paso ${steps.length + 1}\nAccion: ${action}. ${notes ? "Notas: " + notes : ""}\n\`\`\`html\n${htmlContent}\n\`\`\`\n`);
    }
    const finalContent = `
Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: ${currentUrlInput.value}

Vamos a automatizar con python y playwright, debes generar un archivo
<page>_test.py que ejecute el test, donde page es la pagina en la que estas
actualmente, debes deducirlo de los pasos que te estoy indicando.

Solo crea <page>_test.py y selectores.py, donde ira el codigo y los selectores html.

Vamos a generar selectores que sean por texto preferiblemente, luego usa las
reglas estandar de playwright

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
  stepsContainer.addEventListener('focusout', saveSteps);
  currentUrlInput.addEventListener('focusout', saveSteps);
});
