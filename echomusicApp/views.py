from django.shortcuts import render, redirect
import bcrypt
from .models import Usuario

def hashear_contraseña(contraseña):
    sal_generada = bcrypt.gensalt()
    hash_resultante = bcrypt.hashpw(contraseña.encode('utf-8'), sal_generada)
    return hash_resultante

def verificar_contraseña(contraseña, hash_almacenado):
    contraseña_bytes = contraseña.encode('utf-8')
    return bcrypt.checkpw(contraseña_bytes, hash_almacenado)

# Create your views here.

def login(request):
    return render(request, 'login.html')

def index(request):
    if 'usuario_id' in request.session:
        return render(request, 'index.html')
    else:
        return redirect('login')

def registrarse(request):
    if request.method == "POST":
        nombre_usuario = request.POST.get("nombre_usuario")
        nombre = request.POST.get("nombre")
        apellido = request.POST.get("apellido")
        email = request.POST.get("email")
        email_comfirmar = request.POST.get("email_confirmar")
        contraseña = request.POST.get("contraseña")
        contraseña_comfirmar = request.POST.get("contraseña_confirmar")

        try:
            if email == email_comfirmar and contraseña == contraseña_comfirmar:
                contraseña_hash = hashear_contraseña(contraseña)

                usuario = Usuario.objects.create(
                    username=nombre_usuario,
                    nombre=nombre,
                    apellido=apellido,
                    email=email,
                    contraseña=contraseña_hash
                )

                data = {
                    'mensaje': '¡Registro exitoso!'
                }

                return render(request, 'login.html', data)
            else:
                data = {
                    'mensaje': 'Ocurrió un error al momento de registrarse'
                }

                return render(request, 'login.html', data)

        except Exception as e:
            print(f"ERROR: {e}")
            
            data = {
                'mensaje': 'Ocurrió un error al momento de registrarse'
            }

            return render(request, 'login.html', data)
    else:
        return redirect('login')