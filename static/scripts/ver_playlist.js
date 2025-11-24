
const btnAgregar = document.getElementById('btn_agregar');
const divFondoAgregar = document.getElementById('div_fondo_agregar');
const btnCerrarAgregar = document.getElementById('btn_cerrar_agregar');

const btnEditar = document.getElementById('btn_editar');
const divFondoEditar = document.getElementById('div_fondo_editar');
const btnCancelarEditar = document.getElementById('btn_cancelar_editar');

const btnEliminarPlaylist = document.getElementById('btn_eliminar_playlist');
const divFondoEliminar = document.getElementById('div_fondo_eliminar');
const btnCancelarEliminar = document.getElementById('btn_cancelar_eliminar');


btnAgregar.addEventListener('click', () => {
    divFondoAgregar.style.display = 'flex';
});

btnCerrarAgregar.addEventListener('click', () => {
    divFondoAgregar.style.display = 'none';
});

divFondoAgregar.addEventListener('click', (e) => {
    if (e.target === divFondoAgregar) {
        divFondoAgregar.style.display = 'none';
    }
});


btnEditar.addEventListener('click', () => {
    divFondoEditar.style.display = 'flex';
});

btnCancelarEditar.addEventListener('click', () => {
    divFondoEditar.style.display = 'none';
});

divFondoEditar.addEventListener('click', (e) => {
    if (e.target === divFondoEditar) {
        divFondoEditar.style.display = 'none';
    }
});


btnEliminarPlaylist.addEventListener('click', () => {
    divFondoEliminar.style.display = 'flex';
});

btnCancelarEliminar.addEventListener('click', () => {
    divFondoEliminar.style.display = 'none';
});

divFondoEliminar.addEventListener('click', (e) => {
    if (e.target === divFondoEliminar) {
        divFondoEliminar.style.display = 'none';
    }
});


const btnImageEditarHover = document.getElementById('btn_image_editar_hover');
const btnImageEditar = document.getElementById('btn_image_editar');
const inputImagenEditar = document.getElementById('input_imagen_editar');

btnImageEditarHover.addEventListener('click', () => {
    inputImagenEditar.click();
});

btnImageEditar.addEventListener('click', () => {
    inputImagenEditar.click();
});

inputImagenEditar.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            btnImageEditar.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});


const botonesReproducir = document.querySelectorAll('.imagen_cancion_reproducir');
const audiosCanciones = document.querySelectorAll('.audio_cancion');
const txtCancionSeleccionada = document.getElementById('txt_cancion_seleccionada');
const cancionSeleccionada = document.getElementById('cancion_seleccionada');
const btnPlay = document.getElementById('btn_play');
const divReproductor = document.getElementById('reproductor');
const btnDuracion = document.getElementById('btn_duracion');
const divDuracion = document.getElementById('div_duracion');
const espacioConsumido = document.getElementById('espacio_consumido');
const btnVolumen = document.getElementById('btn_volumen');
const volumen = document.getElementById('volumen');
const espacioVolumen = document.getElementById('espacio_volumen');

let cancionActual = null;
let isDraggingDuration = false;
let isDraggingVolume = false;

cancionSeleccionada.volume = 0.5;
espacioVolumen.style.height = '50%';
btnVolumen.style.bottom = '50%';

botonesReproducir.forEach((boton, index) => {
    boton.addEventListener('click', () => {
        const audioSrc = audiosCanciones[index].src;
        const itemCancion = boton.closest('.item_cancion');
        const nombreCancion = itemCancion.querySelector('.nombre_cancion').textContent;
        
        if (cancionActual === audioSrc && !cancionSeleccionada.paused) {
            cancionSeleccionada.pause();
            btnPlay.className = 'btn_play';
        } else {
            cancionSeleccionada.src = audioSrc;
            txtCancionSeleccionada.textContent = nombreCancion;
            cancionSeleccionada.play();
            btnPlay.className = 'btn_pause';
            cancionActual = audioSrc;
            
            if (divReproductor.style.animation === '') {
                divReproductor.style.animation = 'reproductor 0.5s forwards';
            }
        }
    });
});

btnPlay.addEventListener('click', () => {
    if (cancionSeleccionada.paused) {
        cancionSeleccionada.play();
        btnPlay.className = 'btn_pause';
    } else {
        cancionSeleccionada.pause();
        btnPlay.className = 'btn_play';
    }
});

cancionSeleccionada.addEventListener('timeupdate', () => {
    if (!isDraggingDuration) {
        const porcentaje = (cancionSeleccionada.currentTime / cancionSeleccionada.duration) * 100;
        espacioConsumido.style.width = porcentaje + '%';
        btnDuracion.style.left = porcentaje + '%';
    }
});

btnDuracion.addEventListener('mousedown', () => {
    isDraggingDuration = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingDuration) {
        const rect = divDuracion.getBoundingClientRect();
        let x = e.clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const porcentaje = (x / rect.width) * 100;
        espacioConsumido.style.width = porcentaje + '%';
        btnDuracion.style.left = porcentaje + '%';
        cancionSeleccionada.currentTime = (porcentaje / 100) * cancionSeleccionada.duration;
    }
});

document.addEventListener('mouseup', () => {
    isDraggingDuration = false;
});

btnVolumen.addEventListener('mousedown', () => {
    isDraggingVolume = true;
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) {
        const rect = volumen.getBoundingClientRect();
        let y = e.clientY - rect.top;
        if (y < 0) y = 0;
        if (y > rect.height) y = rect.height;
        const porcentaje = ((rect.height - y) / rect.height) * 100;
        espacioVolumen.style.height = porcentaje + '%';
        btnVolumen.style.bottom = porcentaje + '%';
        cancionSeleccionada.volume = porcentaje / 100;
    }
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});

// REORDENAR CANCIONES (DRAG AND DROP)
const btnReordenar = document.getElementById('btn_reordenar');
const listaCanciones = document.getElementById('lista_canciones');
const formReordenar = document.getElementById('form_reordenar');
const inputsOrden = document.getElementById('inputs_orden');

let modoReordenar = false;
let draggedElement = null;

btnReordenar.addEventListener('click', () => {
    modoReordenar = !modoReordenar;
    
    if (modoReordenar) {
        btnReordenar.textContent = '✓ Guardar Orden';
        btnReordenar.style.backgroundColor = '#27ae60';
        activarReordenar();
    } else {
        btnReordenar.textContent = '⇅ Reordenar';
        btnReordenar.style.backgroundColor = '#3498db';
        guardarOrden();
        desactivarReordenar();
    }
});

function activarReordenar() {
    const items = document.querySelectorAll('.item_cancion');
    const botonesMover = document.querySelectorAll('.btn_mover');
    const botonesQuitar = document.querySelectorAll('.btn_quitar');
    
    items.forEach((item, index) => {
        item.draggable = true;
        botonesMover[index].style.display = 'block';
        botonesQuitar[index].style.display = 'none';
        
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

function desactivarReordenar() {
    const items = document.querySelectorAll('.item_cancion');
    const botonesMover = document.querySelectorAll('.btn_mover');
    const botonesQuitar = document.querySelectorAll('.btn_quitar');
    
    items.forEach((item, index) => {
        item.draggable = false;
        botonesMover[index].style.display = 'none';
        botonesQuitar[index].style.display = 'block';
        
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragover', handleDragOver);
        item.removeEventListener('drop', handleDrop);
        item.removeEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(listaCanciones, e.clientY);
    if (afterElement == null) {
        listaCanciones.appendChild(draggedElement);
    } else {
        listaCanciones.insertBefore(draggedElement, afterElement);
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    actualizarNumeros();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.item_cancion:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function actualizarNumeros() {
    const items = document.querySelectorAll('.item_cancion');
    items.forEach((item, index) => {
        const numero = item.querySelector('.numero_orden');
        numero.textContent = index + 1;
    });
}

function guardarOrden() {
    inputsOrden.innerHTML = '';
    
    const items = document.querySelectorAll('.item_cancion');
    items.forEach((item) => {
        const cancionId = item.getAttribute('data-cancion-id');
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'cancion_orden[]';
        input.value = cancionId;
        inputsOrden.appendChild(input);
    });
    
    formReordenar.submit();
}