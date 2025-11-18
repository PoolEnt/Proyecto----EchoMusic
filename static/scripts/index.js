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
    div_fondo_subir.style.display = "none"
})