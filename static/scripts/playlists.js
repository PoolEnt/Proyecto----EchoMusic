
const btnCrearPlaylist = document.getElementById('btn_crear_playlist');
const divFondoCrear = document.getElementById('div_fondo_crear');
const btnCancelar = document.getElementById('btn_cancelar');

btnCrearPlaylist.addEventListener('click', () => {
    divFondoCrear.style.display = 'flex';
});

btnCancelar.addEventListener('click', () => {
    divFondoCrear.style.display = 'none';
});

divFondoCrear.addEventListener('click', (e) => {
    if (e.target === divFondoCrear) {
        divFondoCrear.style.display = 'none';
    }
});


const btnImageHover = document.getElementById('btn_image_hover');
const btnImage = document.getElementById('btn_image');
const inputImagen = document.getElementById('input_imagen');

btnImageHover.addEventListener('click', () => {
    inputImagen.click();
});

btnImage.addEventListener('click', () => {
    inputImagen.click();
});

inputImagen.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            btnImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});