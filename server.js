const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); // Para analizar el cuerpo de las solicitudes JSON
app.use(cors()); // Para analizar el cuerpo de las solicitudes JSON

app.post('/generate-content', (req, res) => {
  const steps = req.body;
  console.log('Pasos recibidos para generar contenido: ', steps);

  const currentUrl = 'http://example.com'; // Reemplaza con la URL real o obténla de los datos del paso

  let stepContent = '';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    stepContent += `\n## Paso ${i + 1}\nAccion: ${step.action}. ${step.notes ? "Notas: " + step.notes : ""}\n\`\`\`html\n${step.html}\n\`\`\``;
  }

  const finalContent = `
Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: ${currentUrl}

Vamos a automatizar con python y playwright, debes generar un archivo
<page>_test.py que ejecute el test, donde page es la pagina en la que estas
actualmente, debes deducirlo de los pasos que te estoy indicando.

Solo crea <page>_test.py y selectores.py, donde irá el código y los selectores html.

Ignora la clase \`hover-highlight\` al buscar selectores de todo el html que te
proveo porque es reservado para uso interno.

Vamos a generar selectores que sean por texto preferiblemente

El código debe correrse con \`pytest --headed\`

Genera el requirements.txt necesario para que sea fácil instalar todo
rápidamente

Este es un template de cada página
\`\`\`python
from playwright.sync_api import Page
from selectores import Selectors

def test_codecrafters_flow(page: Page):
    page.goto(url)

    # Paso 1: Indicaciones...
    page.click(Selectors.A_SELECTOR)

    # Paso N: Lo que corresponda

    # Verificar que estamos en la página correcta
    assert # Lo que esté indicado en el paso en concordancia con la accion dada

    page.close()
\`\`\`

${stepContent}`;

  console.log('Contenido generado: ', finalContent);
  res.json({ message: 'Contenido generado correctamente' });
});

app.listen(3001, () => {
  console.log('Aplicación escuchando en el puerto 3001');
});
