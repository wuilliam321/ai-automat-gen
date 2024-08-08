const express = require('express');
const cors = require('cors');
const playwright = require('./playwright');
const selenium = require('./selenium');
const app = express();
app.use(express.json()); // Para analizar el cuerpo de las solicitudes JSON
app.use(cors()); // Para analizar el cuerpo de las solicitudes JSON


const mode = process.argv[2];

const noop = (_, res) => {
  console.log('Ningun contenido generado');
  res.json({ message: 'Ningun contenido generado' });
};

let canRun = false;
let generateContentHandler = noop;
if (mode === 'playwright') {
  generateContentHandler = playwright.handler;
  canRun = true;
} else if (mode === 'selenium') {
  generateContentHandler = selenium.handler;
  canRun = true;
} else {
  console.log("wrong use: node server.js [playwright|selenium]");
  canRun = true;
}

if (canRun) {
  app.post('/generate-content', generateContentHandler);

  app.listen(3001, () => {
    console.log('Aplicación escuchando en el puerto 3001');
  });
}
