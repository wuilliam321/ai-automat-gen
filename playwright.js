const handler = (req, res) => {
  const { steps, currentUrl } = req.body;

  const prompt = generatePrompt(steps, currentUrl);

  console.log('Contenido generado: ', prompt);

  res.json({ message: prompt });
};

function generatePrompt(steps, currentUrl) {
  const tools = "python y playwright"
  let stepContent = '';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    stepContent += `\n## Paso ${i + 1}\n###Accion\n${step.action}. ${step.notes ? "\n###Notas\n" + step.notes : ""}\n\`\`\`html\n${step.html}\n\`\`\``;
  }
  return `
Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: ${currentUrl}

Vamos a automatizar con ${tools}, debes generar un archivo
<page>_test.py que ejecute el test, donde page es la pagina en la que estas
actualmente, debes deducirlo de los pasos que te estoy indicando.

Solo crea <page>_test.py y selectores.py, donde irá el código y los selectores html.

Ignora la clase \`hover-highlight\` al buscar selectores de todo el html que te
proveo porque es reservado para uso interno.

Vamos a generar selectores que sean por texto preferiblemente.

El código debe correrse con \`pytest --headed\`.

Genera el requirements.txt necesario para que sea fácil instalar todo
rápidamente.

Este es un template de cada página
\`\`\`python
from playwright.sync_api import Page
from selectores import Selectores

def test_the_best_name_you_can(page: Page):
    page.goto(url)

    # Paso 1: Indicaciones...
    page.click(Selectors.A_SELECTOR)

    # Paso N: Lo que corresponda

    # Verificar que estamos en la página correcta
    assert # Lo que esté indicado en el paso en concordancia con la accion dada

    page.close()
\`\`\`

${stepContent}`
}

module.exports = { handler, generatePrompt };
