document.addEventListener('DOMContentLoaded', () => {
  const stepsContainer = document.getElementById('steps-container');
  const finishButton = document.getElementById('finish-button');

  // Recuperar pasos guardados
  chrome.storage.local.get(['steps'], function(result) {
    const steps = result.steps || [];
    steps.forEach((step, index) => {
      addStep(index + 1, step.html, step.notes);
    });
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
      <h4>Paso ${stepNumber}</h4>
      <textarea placeholder="Notas...">${notes || ''}</textarea>
      <pre>${escapeHtml(htmlContent)}</pre>
    `;
    stepsContainer.appendChild(stepDiv);
  }

  // Escuchar mensajes del content script
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'addStep') {
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
      const htmlContent = stepDiv.querySelector('pre').textContent;
      steps.push({ notes, htmlContent });
    }
    chrome.storage.local.set({ steps });
  }

  // Copiar todos los pasos al portapapeles
  finishButton.addEventListener('click', () => {
    const steps = [];
    const stepDivs = stepsContainer.getElementsByClassName('step');
    for (let stepDiv of stepDivs) {
      const notes = stepDiv.querySelector('textarea').value;
      const htmlContent = stepDiv.querySelector('pre').textContent;
      steps.push(`Paso ${steps.length + 1}\nNotas: ${notes}\n${htmlContent}\n`);
    }
    const finalContent = steps.join('\n');
    navigator.clipboard.writeText(finalContent).then(() => {
      alert('Contenido copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  });

  // Guardar pasos al modificar notas
  stepsContainer.addEventListener('input', saveSteps);
});
