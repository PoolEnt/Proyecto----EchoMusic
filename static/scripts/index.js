const btn_subir = document.getElementById("btn_subir")
const div_fondo_subir = document.getElementById("div_fondo_subir")

btn_subir.addEventListener("click", function(){
    div_fondo_subir.style.display = "grid"
})

const btn_image_cancion_hover = document.getElementById("btn_image_cancion_hover")
const btn_image_cancion = document.getElementById("btn_image_cancion")
const input_imagen_subir = document.getElementById("input_imagen_subir")

btn_image_cancion_hover.addEventListener("click", function(){
    input_imagen_subir.click()
})

input_imagen_subir.addEventListener("change", function(){
    const imagen = input_imagen_subir.files[0];

    const image_url = URL.createObjectURL(imagen);
    btn_image_cancion.src = image_url
})

const btn_archivo = document.getElementById("btn_archivo")
const input_archivo = document.getElementById("input_archivo")

btn_archivo.addEventListener("click", function(){
    input_archivo.click()
})

const btn_cancelar_cancion = document.getElementById("btn_cancelar_cancion")
const input_nombre_cancion = document.getElementById("input_nombre_cancion")
const input_autor_cancion = document.getElementById("input_autor_cancion")

btn_cancelar_cancion.addEventListener("click", function(){
    input_imagen_subir.value = ""
    btn_image_cancion.src = "/static/images/icons/img_album.svg"
    input_nombre_cancion.value = ""
    input_archivo.value = ""
    input_autor_cancion.value = ""
    div_fondo_subir.style.display = "none"
})

const reproductor = document.getElementById("reproductor")
const btn_play = document.getElementById("btn_play")
const imagen_canciones = document.querySelectorAll('.imagen_cancion')
const cancion_seleccionada = document.getElementById("cancion_seleccionada")
const espacio_consumido = document.getElementById("espacio_consumido")
const btn_duracion = document.getElementById("btn_duracion")

btn_play.addEventListener("click", function(){
    if (cancion_seleccionada.src != ""){
        if (cancion_seleccionada.paused) {
            cancion_seleccionada.play();
            btn_play.className = "btn_pause"
        } else {
            cancion_seleccionada.pause();
            btn_play.className = "btn_play"
        }
    }
})

cancion_seleccionada.addEventListener("timeupdate", function(){
    const tiempo = cancion_seleccionada.currentTime
    const duracion = cancion_seleccionada.duration

    const tiempo_porcentaje = (tiempo / duracion) * 100

    espacio_consumido.style.width = String(tiempo_porcentaje+"%")
    btn_duracion.style.left = String(tiempo_porcentaje+"%")

    if (tiempo_porcentaje == 100){
        btn_play.className = "btn_play"
    }
})

imagen_canciones.forEach(imagen => {
    const padre = imagen.parentElement
    const cancion = padre.lastElementChild

    imagen.addEventListener("click", function(){
        cancion_seleccionada.src = cancion.src
        reproductor.style.animationName = "reproductor"
        reproductor.style.animationDuration = "500ms"
        reproductor.style.animationFillMode = "forwards"
        btn_play.className = "btn_play"
        espacio_consumido.style.width = "0%"
        btn_duracion.style.left = "0%"
    })
})