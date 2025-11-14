const btn_registro = document.getElementById("btn_regitro")
const btn_volver = document.getElementById("btn_volver")
const div_login = document.getElementById("div_login")
const div_register = document.getElementById("div_register")

btn_registro.addEventListener("click", function(){
    div_login.style.top = "-200%"
    div_register.style.top = "50%"
})

btn_volver.addEventListener("click", function(){
    div_login.style.top = "50%"
    div_register.style.top = "200%"
})