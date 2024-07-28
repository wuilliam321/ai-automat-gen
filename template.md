Eres un QA Automation Engineer, vas a generar un script de automatizacion.

## Script de automatizacion
URL: https://app.codecrafters.io/catalog

Vamos a automatizar con python y playwright, debes generar un archivo
<page>_test.py que ejecute el test, donde page es la pagina en la que estas
actualmente, debes deducirlo de los pasos que te estoy indicando.

Solo crea <page>_test.py y selectores.py, donde ira el codigo y los selectores html.

Vamos a generar selectores que sean por texto preferiblemente, luego usa las
reglas estandar de playwright

El codigo debe correrse con `pytest --headed`

Genera el requirements.txt necesario para que sea facil instalar todo
rapidamente

Este es un template de cada page
```python
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
```

## Paso 1
Notas: In al la pagina de inicio haciendo click en la imagen siguiente
```html
<a id="ember4" class="ember-view active flex items-center" href="/catalog">
            <img class="h-8 w-8 my-3 mr-2" src="/assets/7408d202b2bb110054fc.svg" alt="CodeCrafters">
            CodeCrafters
          </a>
```

## Paso 2
Notas: Hacer click en Build your own Redis
```html
<a id="ember23" class="ember-view group bg-white dark:bg-gray-900 p-5 rounded-md shadow hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border dark:border-gray-800/60 relative hover-highlight" data-test-course-card="" href="/courses/redis/overview">
  <div class="w-8 transform scale-100 group-hover:scale-105 flex-shrink-0 transition-all absolute top-5 right-5">
      <img alt="Build your own Redis" src="/assets/bb2e492a834d9f374909.svg" class="">
  </div>

  <div class="mb-6">
    <div class="flex items-center mb-3 flex-wrap gap-y-2 pr-10">
      <div class="text-lg font-semibold text-gray-800 dark:text-gray-200 mr-2" data-test-course-name="">
          <span class="">Build your own Redis</span>
      </div>
    </div>

    <div class="text-sm leading-relaxed text-gray-500 pr-10" data-test-course-description="">
        <span class="">Learn about TCP servers, the Redis protocol and more</span>
    </div>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 mr-1 fill-current text-gray-300 dark:text-gray-700"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>
              <span class="text-xs text-gray-400 dark:text-gray-600">55 stages</span>
            </div>
              </div>

    <div class="flex items-center">
      <span class="font-bold text-teal-500 text-xs mr-2 opacity-0 group-hover:opacity-100 transition-opacity" data-test-action-text="">
          Start
              </span>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 fill-current text-gray-300 group-hover:text-teal-500 transition-colors"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </div>
  </div>
</a>
```

## Paso 3
Notas: hacer clic en Start Building
```html
<a id="ember38" class="ember-view ember-transitioning-in inline-block border
    
    
    
    px-4 py-3
    rounded shadow-sm
    
    
    
    text-lg font-bold
     bg-teal-500 hover:bg-teal-600 border-teal-500 hover:border-teal-600 text-white" data-test-start-course-button="" href="/courses/redis">
  
  
  <div class="flex items-center">
      <svg viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="fill-current w-5 transform transition-all mr-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28 43.52 0 87.04 5.76 128 17.28 97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0z"></path></svg>

      Start Building

    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 ml-2 fill-current"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
  </div>


</a>
```

