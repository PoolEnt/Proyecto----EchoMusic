from django.shortcuts import render, redirect
import bcrypt
from .models import Usuario, Album, Cancion

def hashear_contraseña(contraseña):
    sal_generada = bcrypt.gensalt()
    hash_resultante = bcrypt.hashpw(contraseña.encode('utf-8'), sal_generada)
    hash_str = hash_resultante.decode('utf-8')
    return hash_str

def verificar_contraseña(contraseña, hash_almacenado):
    contraseña_bytes = contraseña.encode('utf-8')
    hash_almacenado_bytes = hash_almacenado.encode('utf-8')
    return bcrypt.checkpw(contraseña_bytes, hash_almacenado_bytes)

# Create your views here.

def login(request):
    return render(request, 'login.html')

def index(request):
    if 'usuario_id' in request.session:
        usuario = Usuario.objects.get(id=request.session['usuario_id'])
        albumes = Album.objects.filter(usuario=usuario)
        canciones = Cancion.objects.filter(usuario=usuario)

        data = {
            'usuario':usuario,
            'albumes': albumes,
            'canciones': canciones
        }

        return render(request, 'index.html', data)
    else:
        return redirect('login')

def registrarse(request):
    if request.method == "POST":
        nombre_usuario = request.POST.get("nombre_usuario")
        nombre = request.POST.get("nombre")
        apellido = request.POST.get("apellido")
        correo = request.POST.get("correo")
        correo_comfirmar = request.POST.get("correo_confirmar")
        contraseña = request.POST.get("contraseña")
        contraseña_confirmar = request.POST.get("contraseña_confirmar")

        try:
            if correo == correo_comfirmar and contraseña == contraseña_confirmar:

                contraseña_hash = hashear_contraseña(contraseña)

                usuario = Usuario.objects.create(
                    username=nombre_usuario,
                    nombre=nombre,
                    apellido=apellido,
                    correo=correo,
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
    
def ingresar(request):
    if request.method == "GET":
        correo = request.GET.get("correo")
        contraseña = request.GET.get("contraseña")

        try:
            usuario = Usuario.objects.get(correo=correo)

            if verificar_contraseña(contraseña, usuario.contraseña):
                request.session['usuario_id'] = usuario.id
                request.session.modified = True
            
                return redirect('index')
            else:
                data = {
                    'mensaje': 'No se encontró el usuario ingresado'
                }

                return render(request, 'login.html', data)

        except Exception as e:
            print(f"ERROR: {e}")
            
            data = {
                'mensaje': 'Ocurrió un error al momento de ingresar'
            }

            return render(request, 'login.html', data)
    else:
        return redirect('login')
    
def perfil(request):
    if 'usuario_id' in request.session:
        usuario = Usuario.objects.get(id=request.session['usuario_id'])

        data = {
            'usuario':usuario
        }

        return render(request, 'perfil.html', data)
    else:
        return redirect('login')

def subir_cancion(request):
    if 'usuario_id' in request.session:
        imagen_cancion = request.FILES.get("imagen_cancion")
        nombre = request.POST.get("nombre")
        autor = request.POST.get("autor")
        archivo = request.FILES.get("archivo")

        print("Archivos recibidos:", request.FILES)

        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])

            if imagen_cancion:
                cancion = Cancion.objects.create(
                    nombre=nombre,
                    autor=autor,
                    imagen=imagen_cancion,
                    archivo=archivo,
                    usuario=usuario
                )

                cancion.save()

                return redirect('index')
            else:
                cancion = Cancion.objects.create(
                    nombre=nombre,
                    autor=autor,
                    archivo=archivo,
                    usuario=usuario
                )

                return redirect('index')
        except Exception as e:
            print(f'ERROR: {e}')
            return redirect('index')
        
    else:
        return redirect('login')