const btnEditar = document.getElementById('btn_editar');
const divFondoEditar = document.getElementById('div_fondo_editar');
const btnCancelar = document.getElementById('btn_cancelar');

btnEditar.addEventListener('click', () => {
    divFondoEditar.style.display = 'flex';
});

btnCancelar.addEventListener('click', () => {
    btnImage.src = imagen_original
    inputFoto.value = ""
    divFondoEditar.style.display = 'none';
});

const btnImageHover = document.getElementById('btn_image_hover');
const btnImage = document.getElementById('btn_image');
const inputFoto = document.getElementById('input_foto');
const previewFoto = document.getElementById('preview_foto');

const imagen_original = btnImage.src

btnImageHover.addEventListener('click', () => {
    inputFoto.click();
});

btnImage.addEventListener('click', () => {
    inputFoto.click();
});

inputFoto.addEventListener('change', (e) => {
    if (inputFoto.files && inputFoto.files[0]) {
        const imagen = inputFoto.files[0]
        const image_url = URL.createObjectURL(imagen)
        btnImage.src = image_url
    }
});