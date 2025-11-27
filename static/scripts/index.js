const filtro = document.getElementById("filtro")
const div_canciones = document.getElementById("div_canciones")
const div_albumes = document.getElementById("div_albumes")
const btn_filtro_canciones = document.getElementById("btn_filtro_canciones")
const btn_filtro_albumes = document.getElementById("btn_filtro_albumes")

if (filtro.value == 'canciones'){
    div_albumes.style.display = "none"
    btn_filtro_canciones.className = "btn_filtro_act"
    btn_filtro_albumes.className = "btn_filtro_des"
}else if (filtro.value == 'albumes') {
    div_canciones.style.display = "none"
    btn_filtro_canciones.className = "btn_filtro_des"
    btn_filtro_albumes.className = "btn_filtro_act"
}else {
    div_albumes.style.display = "none"
    btn_filtro_canciones.className = "btn_filtro_act"
    btn_filtro_albumes.className = "btn_filtro_des"
}

let isDragging_volumen = false
let isDragging_duracion = false
let reproducir_cancion = false
let cancion_actual = 0

const btn_subir = document.getElementById("btn_subir")
const div_fondo_subir = document.getElementById("div_fondo_subir")
const btn_image_cancion_hover = document.getElementById("btn_image_cancion_hover")
const btn_image_cancion = document.getElementById("btn_image_cancion")
const input_imagen_subir = document.getElementById("input_imagen_subir")
const btn_archivo = document.getElementById("btn_archivo")
const input_archivo = document.getElementById("input_archivo")
const btn_cancelar_cancion = document.getElementById("btn_cancelar_cancion")
const input_nombre_cancion = document.getElementById("input_nombre_cancion")
const input_autor_cancion = document.getElementById("input_autor_cancion")
const reproductor = document.getElementById("reproductor")
const txt_cancion_seleccionada = document.getElementById("txt_cancion_seleccionada")
const div_duracion = document.getElementById("div_duracion")
const btn_play = document.getElementById("btn_play")
const imagen_canciones = document.querySelectorAll('.imagen_cancion')
const cancion_seleccionada = document.getElementById("cancion_seleccionada")
const espacio_consumido = document.getElementById("espacio_consumido")
const btn_duracion = document.getElementById("btn_duracion")
const volumen = document.getElementById('volumen')
const espacio_volumen = document.getElementById("espacio_volumen")
const btn_volumen = document.getElementById('btn_volumen')
const div_cargando = document.getElementById("div_cargando")

btn_subir.addEventListener("click", function(){
    div_fondo_subir.style.display = "grid"
});

btn_image_cancion_hover.addEventListener("click", function(){
    input_imagen_subir.click()
});

input_imagen_subir.addEventListener("change", function(){
    if (input_imagen_subir.files && input_imagen_subir.files[0]) {
        const imagen = input_imagen_subir.files[0]
        const image_url = URL.createObjectURL(imagen)
        btn_image_cancion.src = image_url
    }
});

btn_archivo.addEventListener("click", function(){
    input_archivo.click()
});

btn_cancelar_cancion.addEventListener("click", function(){
    input_imagen_subir.value = ""
    btn_image_cancion.src = "/media/default/img_album.svg"
    input_nombre_cancion.value = ""
    input_archivo.value = ""
    input_autor_cancion.value = ""
    div_fondo_subir.style.display = "none"
});

document.addEventListener('keydown', function(event) { 
    const elementoActivo = document.activeElement
    const esInput = elementoActivo.tagName === 'INPUT' || 
                    elementoActivo.tagName === 'TEXTAREA' || 
                    elementoActivo.isContentEditable

    if (esInput) return

    if (event.key === " " || event.code === "Space") {
        event.preventDefault()

        if (cancion_seleccionada.src !== "") {
            if (cancion_seleccionada.paused) {
                cancion_seleccionada.play()
                btn_play.className = "btn_pause"
            } else {
                cancion_seleccionada.pause()
                btn_play.className = "btn_play"
            }
        }
    }
});

btn_play.addEventListener("click", function(){
    if (cancion_seleccionada.src !== "") {
        if (cancion_seleccionada.paused) {
            reproducir_cancion = true
            cancion_seleccionada.play()
            btn_play.className = "btn_pause"
        } else {
            cancion_seleccionada.pause();
            btn_play.className = "btn_play"
        }
    }
});

cancion_seleccionada.addEventListener("timeupdate", function(){
    if (!isDragging_duracion) {
        const tiempo = cancion_seleccionada.currentTime
        const duracion = cancion_seleccionada.duration

        if (duracion) {
            const tiempo_porcentaje = (tiempo / duracion) * 100
            espacio_consumido.style.width = `${tiempo_porcentaje}%`
            btn_duracion.style.left = `${tiempo_porcentaje}%`

            if (tiempo >= duracion) {
                if (reproducir_cancion == false){
                    btn_play.className = "btn_pause"
                }else {
                    btn_play.className = "btn_play"
                }
            }
        }
    }
});

imagen_canciones.forEach(imagen => {
    const padre = imagen.parentElement
    const div_nombre_autor = imagen.nextElementSibling
    const nombre_cancion = div_nombre_autor.firstElementChild
    const cancion = padre.lastElementChild

    imagen.addEventListener("click", function(){
        cancion_seleccionada.src = cancion.src
        txt_cancion_seleccionada.textContent = nombre_cancion.textContent
        
        reproductor.style.animationName = "reproductor"
        reproductor.style.animationDuration = "500ms"
        reproductor.style.animationFillMode = "forwards"
        
        btn_play.className = "btn_pause"
        espacio_consumido.style.width = "0%"
        btn_duracion.style.left = "0%"
        isDragging_duracion = false;
        reproducir_cancion = true
        cancion_seleccionada.play()
    });
});

btn_duracion.addEventListener('pointerdown', function(e){
    isDragging_duracion = true
    e.preventDefault()
});

btn_volumen.addEventListener('pointerdown', function(e){
    isDragging_volumen = true
    e.preventDefault()
});

document.addEventListener('pointermove', function(e){
    if (isDragging_volumen) {
        const rielRect = volumen.getBoundingClientRect()
        let nuevaPosicionY = e.clientY - rielRect.top

        if (nuevaPosicionY < 0) nuevaPosicionY = 0
        if (nuevaPosicionY > rielRect.height) nuevaPosicionY = rielRect.height

        btn_volumen.style.top = `${nuevaPosicionY}px`
        
        const valorPorcentaje = (nuevaPosicionY / rielRect.height) * 100
        const valor_decimal = 1.0 - (valorPorcentaje / 100)
        const porcentaje_invertido = 100 - valorPorcentaje
        
        espacio_volumen.style.height = `${porcentaje_invertido}%`
        cancion_seleccionada.volume = Math.max(0, Math.min(1, valor_decimal))
    }

    if (isDragging_duracion) {
        const riel_duracion = div_duracion.getBoundingClientRect()
        let nuevaPosicionX = e.clientX - riel_duracion.left

        if (nuevaPosicionX < 0) nuevaPosicionX = 0
        if (nuevaPosicionX > riel_duracion.width) nuevaPosicionX = riel_duracion.width

        btn_duracion.style.left = `${nuevaPosicionX}px`
        const valorPorcentaje = (nuevaPosicionX / riel_duracion.width) * 100
        espacio_consumido.style.width = `${valorPorcentaje}%`
    }
});

document.addEventListener('pointerup', function(e){
    if (isDragging_duracion) {
        const riel_duracion = div_duracion.getBoundingClientRect()
        let nuevaPosicionX = e.clientX - riel_duracion.left

        if (nuevaPosicionX < 0) nuevaPosicionX = 0
        if (nuevaPosicionX > riel_duracion.width) nuevaPosicionX = riel_duracion.width

        const valorPorcentaje = (nuevaPosicionX / riel_duracion.width) * 100
        const duracion = cancion_seleccionada.duration

        if (isFinite(duracion) && duracion > 0) {
            const valor_milisegundos = (duracion * valorPorcentaje) / 100;
            cancion_seleccionada.currentTime = valor_milisegundos
        }
    }

    isDragging_volumen = false
    isDragging_duracion = false
});

document.addEventListener('pointercancel', function(){
    isDragging_volumen = false
    isDragging_duracion = false
});

document.addEventListener('DOMContentLoaded', function(){
    if (div_cargando) div_cargando.remove()
});

const btn_crear = document.getElementById("btn_crear")
const div_fondo_crear = document.getElementById("div_fondo_crear")
const btn_cancelar_album = document.getElementById("btn_cancelar_album")
const btn_image_album_hover = document.getElementById("btn_image_album_hover")
const btn_image_album = document.getElementById("btn_image_album")
const input_imagen_crear = document.getElementById("input_imagen_crear")
const input_nombre_album = document.getElementById("input_nombre_album")
const input_descripcion_album = document.getElementById("input_descripcion_album")

btn_crear.addEventListener("click", function(){
    div_fondo_crear.style.display = "grid"
})

btn_image_album_hover.addEventListener("click", function(){
    input_imagen_crear.click()
});

input_imagen_crear.addEventListener("change", function(){
    if (input_imagen_crear.files && input_imagen_crear.files[0]) {
        const imagen = input_imagen_crear.files[0]
        const image_url = URL.createObjectURL(imagen)
        btn_image_album.src = image_url
    }
});

btn_cancelar_album.addEventListener("click", function(){
    input_imagen_crear.value = ""
    btn_image_album.src = "/media/default/img_album.svg"
    input_nombre_album.value = ""
    input_descripcion_album.value = ""
    div_fondo_crear.style.display = "none"
})

btn_filtro_canciones.addEventListener("click", function(){
    btn_filtro_canciones.className = "btn_filtro_act"
    btn_filtro_albumes.className = "btn_filtro_des"
    div_canciones.style.display = "flex"
    div_albumes.style.display = "none"
    filtro.value = "canciones"
})

btn_filtro_albumes.addEventListener("click", function(){
    btn_filtro_albumes.className = "btn_filtro_act"
    btn_filtro_canciones.className = "btn_filtro_des"
    div_albumes.style.display = "flex"
    div_canciones.style.display = "none"
    filtro.value = "albumes"
})

const btn_contenido = document.querySelectorAll(".btn_contenido")

btn_contenido.forEach(btn => {
    const div_btn_contenido = btn.parentElement
    const div_album = div_btn_contenido.parentElement
    const div_fondo_contenido = div_album.nextElementSibling
    const div_contenido = div_fondo_contenido.querySelector(".div_contenido")
    const div_lista_btn = div_contenido.nextElementSibling
    const eliminar_album = div_lista_btn.querySelector(".eliminar_album")
    const btn_actualizar = div_lista_btn.querySelector(".btn_actualizar")
    const btn_eliminar_album = div_lista_btn.querySelector(".btn_eliminar_album")
    const btn_cerrar = div_contenido.querySelector(".btn_cerrar")
    const titulo_form_input = btn_cerrar.nextElementSibling
    const texto_titulo = titulo_form_input.value
    const lista_canciones = titulo_form_input.nextElementSibling
    const descripcion_form_input = div_contenido.querySelector(".descripcion_form_input")
    const texto_descripcion = descripcion_form_input.value
    const btn_image_hover = div_contenido.querySelector(".btn_image_hover")
    const btn_image = div_contenido.querySelector(".btn_image")
    const btn_image_anterior = btn_image.src
    const input_imagen_actualizar = div_contenido.querySelector(".input_imagen_actualizar")
    const div_cancion_album = document.querySelectorAll(".div_cancion_album")
    const div_cancion_lista = document.querySelectorAll(".div_cancion_lista")

    btn.addEventListener("click", function(){
        div_fondo_contenido.style.display = "grid"
    })

    btn_cerrar.addEventListener("click", function(){
        input_imagen_actualizar.value = ""
        btn_image.src = btn_image_anterior
            
        div_cancion_lista.forEach(div_cancion => {
            const primer_hijo = div_cancion.firstElementChild
            const btn_seleccionar_cancion = primer_hijo.nextElementSibling
            const cancion_id = div_cancion.lastElementChild
            cancion_id.value = ''                
            btn_seleccionar_cancion.className = "btn_seleccionar_cancion"
        })

        div_cancion_album.forEach(div => {
            const cancion_id = div.nextElementSibling
            const cancion_quitar = cancion_id.nextElementSibling
            cancion_quitar.value = ''
            div.style.display = 'flex'
        })
        
        div_fondo_contenido.style.display = "none"
        titulo_form_input.value = texto_titulo
        descripcion_form_input.value = texto_descripcion
    })

    btn_image_hover.addEventListener("click", function(){
        input_imagen_actualizar.click()
    })

    input_imagen_actualizar.addEventListener("change", function(){
        if (input_imagen_actualizar.files && input_imagen_actualizar.files[0]) {
            const imagen = input_imagen_actualizar.files[0]
            const image_url = URL.createObjectURL(imagen)
            btn_image.src = image_url
        }
    })

    btn_eliminar_album.addEventListener("click", function(){
        eliminar_album.value = "eliminar"
        btn_actualizar.click()
    })
})

const div_cancion_lista = document.querySelectorAll(".div_cancion_lista")

div_cancion_lista.forEach(div_cancion => {
    const btn_seleccionar_cancion = div_cancion.querySelector(".btn_seleccionar_cancion")
    const cancion_id = div_cancion.lastElementChild
    const id_cancion = cancion_id.previousElementSibling

    btn_seleccionar_cancion.addEventListener("click", function(){
        if (btn_seleccionar_cancion.className == "btn_seleccionar_cancion"){
            btn_seleccionar_cancion.className = "btn_cancion_seleccionada"
            cancion_id.value = id_cancion.value
        }else {
            btn_seleccionar_cancion.className = "btn_seleccionar_cancion"
            cancion_id.value = ""
        }
    })
})

const btn_quitar_cancion = document.querySelectorAll(".btn_quitar_cancion")

btn_quitar_cancion.forEach(boton => {
    boton.addEventListener("click", function(){
        const div_cancion_album = boton.parentElement
        const cancion_id = div_cancion_album.nextElementSibling
        const cancion_quitar = cancion_id.nextElementSibling
        cancion_quitar.value = cancion_id.value
        div_cancion_album.style.display = "none"
    })
})

const imagen_albumes = document.querySelectorAll(".imagen_album")
let album_seleccionado = ""

imagen_albumes.forEach(imagen => {
    const padre = imagen.parentElement
    const div_canciones_album = padre.lastElementChild
    const canciones = div_canciones_album.querySelectorAll('audio')
    const div_nombre_descripcion = imagen.nextElementSibling
    const nombre_cancion = div_nombre_descripcion.firstElementChild
    imagen.addEventListener("click", function(){
        album_seleccionado = imagen
        if(canciones.length >= 1){
            cancion_actual = 0
            reproducir_cancion = false
            txt_cancion_seleccionada.textContent = nombre_cancion.textContent
            reproductor.style.animationName = "reproductor"
            reproductor.style.animationDuration = "500ms"
            reproductor.style.animationFillMode = "forwards"
            btn_play.className = "btn_pause"
            espacio_consumido.style.width = "0%"
            btn_duracion.style.left = "0%"
            isDragging_duracion = false;

            reproducir_siguiente(album_seleccionado)
        }
    });
});

cancion_seleccionada.addEventListener('ended', function(){
    if (reproducir_cancion == false){
        setTimeout(() => {
            reproducir_siguiente(album_seleccionado)
        }, 2000)
    }else{
        btn_play.className = "btn_pause"
        setTimeout(() => {
            cancion_seleccionada.play()
        }, 2000)
    }
})

function reproducir_siguiente(album_seleccionado) {
    if (reproducir_cancion == false) {
        const padre = album_seleccionado.parentElement
        const div_canciones_album = padre.lastElementChild
        const canciones = div_canciones_album.querySelectorAll('audio')
        const playlist = Array.from(canciones)

        if (cancion_actual < playlist.length){
            cancion_seleccionada.src = playlist[cancion_actual].src
            cancion_seleccionada.play()
            btn_play.className = "btn_pause"
            cancion_actual++
        }else {
            cancion_actual = 0
            cancion_seleccionada.src = playlist[cancion_actual].src
            cancion_seleccionada.play()
            btn_play.className = "btn_pause"
            cancion_actual++
        }
    }
}

const btn_perfil = document.getElementById("btn_perfil")
const div_index = document.getElementById("div_index")
const div_perfil = document.getElementById("div_perfil")

btn_perfil.addEventListener("click", function(){
    div_index.style.position = "absolute"
    div_index.style.visibility = "hidden"
    div_perfil.style.display = "block"
})

const img_logo = document.getElementById("img_logo")

img_logo.addEventListener("click", function(){
    div_index.style.position = "relative"
    div_index.style.visibility = "visible"
    div_perfil.style.display = "none"
})

const btn_cancion = document.querySelectorAll(".btn_cancion")

btn_cancion.forEach(boton => {
    boton.addEventListener("click", function(){
        const div_btn_contenido = boton.parentElement
        const div_cancion = div_btn_contenido.parentElement
        const div_fondo_cancion = div_cancion.nextElementSibling

        div_fondo_cancion.style.display = "grid"
    })
})

const div_fondo_cancion = document.querySelectorAll(".div_fondo_cancion")

div_fondo_cancion.forEach(div => {
    const btn_cerrar = div.querySelector(".btn_cerrar")
    const btn_image_hover = div.querySelector(".btn_image_hover")
    const btn_image = div.querySelector(".btn_image")
    const btn_image_anterior = btn_image.src
    const input_imagen_actualizar = div.querySelector(".input_imagen_actualizar")
    const titulo_form_input = div.querySelector(".titulo_form_input")
    const titulo_form_input_anterior = titulo_form_input.value
    const input_form = div.querySelector(".input_form")
    const input_form_anterior = input_form.value
    const btn_actualizar_cancion = div.querySelector(".btn_actualizar_cancion")
    const btn_eliminar_cancion = div.querySelector(".btn_eliminar_cancion")

    btn_cerrar.addEventListener("click", function(){
        div.style.display = "none"
        titulo_form_input.value = titulo_form_input_anterior
        btn_image.src = btn_image_anterior
        input_imagen_actualizar.value = ""
        input_form.value = input_form_anterior
    })

    btn_image_hover.addEventListener("click", function(){
        input_imagen_actualizar.click()
    })

    input_imagen_actualizar.addEventListener("change", function(){
        if (input_imagen_actualizar.files && input_imagen_actualizar.files[0]) {
            const imagen = input_imagen_actualizar.files[0]
            const image_url = URL.createObjectURL(imagen)
            btn_image.src = image_url
        }
    })

    btn_eliminar_cancion.addEventListener("click", function(){
        const eliminar_cancion = div.querySelector(".eliminar_cancion")
        eliminar_cancion.value = "eliminar"
        btn_actualizar_cancion.click()
    })
})