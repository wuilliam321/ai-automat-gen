// Crear y agregar el overlay al documento
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)'; // Fondo transparente
overlay.style.zIndex = 9999;
overlay.style.display = 'none';
overlay.style.cursor = 'default';
document.body.appendChild(overlay);

document.addEventListener('mouseover', function(event) {
  const target = event.target;

  // Añadir clase de resaltado
  target.classList.add('hover-highlight');

  // Remover clase de resaltado al quitar el cursor
  target.addEventListener('mouseout', function() {
    target.classList.remove('hover-highlight');
  }, { once: true });

  // Copiar outerHTML al portapapeles al hacer clic
  const clickHandler = function(e) {
    e.preventDefault();
    e.stopPropagation();

    overlay.style.display = 'block'; // Mostrar el overlay

    const outerHTML = target.outerHTML;
    navigator.clipboard.writeText(outerHTML).then(() => {
      console.log('outerHTML copiado al portapapeles');
      overlay.style.display = 'none'; // Ocultar el overlay después de copiar
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
      overlay.style.display = 'none'; // Asegurarse de ocultar el overlay en caso de error
    });
  };

  target.addEventListener('click', clickHandler, { once: true });
});
