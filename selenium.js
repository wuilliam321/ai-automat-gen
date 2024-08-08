const model = require('./model');

const handler = async (req, res) => {
  const { steps, currentUrl } = req.body;
  const prompt = generatePrompt(steps, currentUrl);
  const result = await model.generateCode(prompt);
  res.json({ message: result });
};

function generatePrompt(steps, currentUrl) {
  const tools = "python con unittest y selenium 4"
  let stepContent = '';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    stepContent += `\n## Paso ${i + 1}\n###Accion\n${step.action}. ${step.notes ? "\n###Notas\n" + step.notes : ""}\n\`\`\`html\n${step.html}\n\`\`\``;
  }
  return `
Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: ${currentUrl}

Vamos a automatizar con ${tools}, usando el patron page object debes generar un
archivo <page>.py con las definiciones de la page y uno <page>_test.py que ejecute
el test, donde <page> es la pagina en la que estas actualmente, debes deducirlo de
los pasos que te estoy indicando, crea solo un test por archivo.

Solo crea un <page>.py, un <page>_test.py y un selectores.py, donde irá el código
y los selectores html.

Ignora la clase \`hover-highlight\` al buscar selectores de todo el html que te
proveo porque es reservado para uso interno.

Vamos a generar selectores que sean por texto preferiblemente a menos que las notas
indiquen usar un metodo particular, no usar xpath.

Vamos a esperar por el siguiente elemento antes de ejecutar la accion indicada.

El código debe correrse con \`python <page>_test.py\`.

Genera el requirements.txt necesario para que sea fácil instalar todo
rápidamente.

Este es un template de cada página
\`\`\`python
import unittest
from selenium import webdriver
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager

from selectores import Selectores

class <Page>TestSuite(unittest.TestCase):

    def setUp(self):
        self. driver = webdriver.Firefox(service=FirefoxService(GeckoDriverManager().install()))

    def test_the_best_name_you_can(self):
        driver = self.driver
        driver.get(url)

        # Paso 1: Indicaciones...
        elem = driver.find_element(Selectores.<El Selector que corresponda>, "Selecciona el mejor valor posible")

        # Paso N: Lo que corresponda

        # Verificar que estamos en la página correcta

        # Hacer assertion segun lo que esté indicado en el paso en concordancia con la accion dada


    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
\`\`\`

${stepContent}`
}

module.exports = { handler, generatePrompt };
