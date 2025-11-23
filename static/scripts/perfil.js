const btnEditar = document.getElementById('btn_editar');
const divFondoEditar = document.getElementById('div_fondo_editar');
const btnCancelar = document.getElementById('btn_cancelar');

btnEditar.addEventListener('click', () => {
    divFondoEditar.style.display = 'flex';
});

btnCancelar.addEventListener('click', () => {
    divFondoEditar.style.display = 'none';
});

const btnImageHover = document.getElementById('btn_image_hover');
const btnImage = document.getElementById('btn_image');
const inputFoto = document.getElementById('input_foto');
const previewFoto = document.getElementById('preview_foto');

btnImageHover.addEventListener('click', () => {
    inputFoto.click();
});

btnImage.addEventListener('click', () => {
    inputFoto.click();
});

inputFoto.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            btnImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});