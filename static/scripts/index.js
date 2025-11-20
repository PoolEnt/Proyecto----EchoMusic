let isDragging_volumen = false;
let isDragging_duracion = false;

const btn_subir = document.getElementById("btn_subir");
const div_fondo_subir = document.getElementById("div_fondo_subir");
const btn_image_cancion_hover = document.getElementById("btn_image_cancion_hover");
const btn_image_cancion = document.getElementById("btn_image_cancion");
const input_imagen_subir = document.getElementById("input_imagen_subir");
const btn_archivo = document.getElementById("btn_archivo");
const input_archivo = document.getElementById("input_archivo");
const btn_cancelar_cancion = document.getElementById("btn_cancelar_cancion");
const input_nombre_cancion = document.getElementById("input_nombre_cancion");
const input_autor_cancion = document.getElementById("input_autor_cancion");
const reproductor = document.getElementById("reproductor");
const txt_cancion_seleccionada = document.getElementById("txt_cancion_seleccionada");
const div_duracion = document.getElementById("div_duracion");
const btn_play = document.getElementById("btn_play");
const imagen_canciones = document.querySelectorAll('.imagen_cancion');
const cancion_seleccionada = document.getElementById("cancion_seleccionada");
const espacio_consumido = document.getElementById("espacio_consumido");
const btn_duracion = document.getElementById("btn_duracion");
const volumen = document.getElementById('volumen');
const espacio_volumen = document.getElementById("espacio_volumen");
const btn_volumen = document.getElementById('btn_volumen');
const div_cargando = document.getElementById("div_cargando");

btn_subir.addEventListener("click", function(){
    div_fondo_subir.style.display = "grid";
});

btn_image_cancion_hover.addEventListener("click", function(){
    input_imagen_subir.click();
});

input_imagen_subir.addEventListener("change", function(){
    if (input_imagen_subir.files && input_imagen_subir.files[0]) {
        const imagen = input_imagen_subir.files[0];
        const image_url = URL.createObjectURL(imagen);
        btn_image_cancion.src = image_url;
    }
});

btn_archivo.addEventListener("click", function(){
    input_archivo.click();
});

btn_cancelar_cancion.addEventListener("click", function(){
    input_imagen_subir.value = "";
    btn_image_cancion.src = "/media/default/img_album.svg";
    input_nombre_cancion.value = "";
    input_archivo.value = "";
    input_autor_cancion.value = "";
    div_fondo_subir.style.display = "none";
});

document.addEventListener('keydown', function(event) { 
    const elementoActivo = document.activeElement;
    const esInput = elementoActivo.tagName === 'INPUT' || 
                    elementoActivo.tagName === 'TEXTAREA' || 
                    elementoActivo.isContentEditable;

    if (esInput) return;

    if (event.key === " " || event.code === "Space") {
        event.preventDefault();

        if (cancion_seleccionada.src !== "") {
            if (cancion_seleccionada.paused) {
                cancion_seleccionada.play();
                btn_play.className = "btn_pause";
            } else {
                cancion_seleccionada.pause();
                btn_play.className = "btn_play";
            }
        }
    }
});

btn_play.addEventListener("click", function(){
    if (cancion_seleccionada.src !== "") {
        if (cancion_seleccionada.paused) {
            cancion_seleccionada.play();
            btn_play.className = "btn_pause";
        } else {
            cancion_seleccionada.pause();
            btn_play.className = "btn_play";
        }
    }
});

cancion_seleccionada.addEventListener("timeupdate", function(){
    if (!isDragging_duracion) {
        const tiempo = cancion_seleccionada.currentTime;
        const duracion = cancion_seleccionada.duration;

        if (duracion) {
            const tiempo_porcentaje = (tiempo / duracion) * 100;
            espacio_consumido.style.width = `${tiempo_porcentaje}%`;
            btn_duracion.style.left = `${tiempo_porcentaje}%`;

            if (tiempo >= duracion) {
                btn_play.className = "btn_play";
            }
        }
    }
});

imagen_canciones.forEach(imagen => {
    const padre = imagen.parentElement;
    const nombre_cancion = imagen.nextElementSibling;
    const cancion = padre.lastElementChild;

    imagen.addEventListener("click", function(){
        cancion_seleccionada.src = cancion.src;
        txt_cancion_seleccionada.textContent = nombre_cancion.textContent;
        
        reproductor.style.animationName = "reproductor";
        reproductor.style.animationDuration = "500ms";
        reproductor.style.animationFillMode = "forwards";
        
        btn_play.className = "btn_pause";
        espacio_consumido.style.width = "0%";
        btn_duracion.style.left = "0%";
        isDragging_duracion = false; 
        
        cancion_seleccionada.play();
    });
});

btn_duracion.addEventListener('pointerdown', function(e){
    isDragging_duracion = true;
    e.preventDefault();
});

btn_volumen.addEventListener('pointerdown', function(e){
    isDragging_volumen = true;
    e.preventDefault();
});

document.addEventListener('pointermove', function(e){
    if (isDragging_volumen) {
        const rielRect = volumen.getBoundingClientRect();
        let nuevaPosicionY = e.clientY - rielRect.top;

        if (nuevaPosicionY < 0) nuevaPosicionY = 0;
        if (nuevaPosicionY > rielRect.height) nuevaPosicionY = rielRect.height;

        btn_volumen.style.top = `${nuevaPosicionY}px`;
        
        const valorPorcentaje = (nuevaPosicionY / rielRect.height) * 100;
        const valor_decimal = 1.0 - (valorPorcentaje / 100);
        const porcentaje_invertido = 100 - valorPorcentaje;
        
        espacio_volumen.style.height = `${porcentaje_invertido}%`;
        cancion_seleccionada.volume = Math.max(0, Math.min(1, valor_decimal));
    }

    if (isDragging_duracion) {
        const riel_duracion = div_duracion.getBoundingClientRect();
        let nuevaPosicionX = e.clientX - riel_duracion.left;

        if (nuevaPosicionX < 0) nuevaPosicionX = 0;
        if (nuevaPosicionX > riel_duracion.width) nuevaPosicionX = riel_duracion.width;

        btn_duracion.style.left = `${nuevaPosicionX}px`;
        const valorPorcentaje = (nuevaPosicionX / riel_duracion.width) * 100;
        espacio_consumido.style.width = `${valorPorcentaje}%`;
    }
});

document.addEventListener('pointerup', function(e){
    if (isDragging_duracion) {
        const riel_duracion = div_duracion.getBoundingClientRect();
        let nuevaPosicionX = e.clientX - riel_duracion.left;

        if (nuevaPosicionX < 0) nuevaPosicionX = 0;
        if (nuevaPosicionX > riel_duracion.width) nuevaPosicionX = riel_duracion.width;

        const valorPorcentaje = (nuevaPosicionX / riel_duracion.width) * 100;
        const duracion = cancion_seleccionada.duration;

        if (isFinite(duracion) && duracion > 0) {
            const valor_milisegundos = (duracion * valorPorcentaje) / 100;
            cancion_seleccionada.currentTime = valor_milisegundos;
        }
    }

    isDragging_volumen = false;
    isDragging_duracion = false;
});

document.addEventListener('pointercancel', function(){
    isDragging_volumen = false;
    isDragging_duracion = false;
});

document.addEventListener('DOMContentLoaded', function(){
    if (div_cargando) div_cargando.remove();
});