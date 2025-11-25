from django.shortcuts import render, redirect
import bcrypt
import os
from .models import Usuario, Album, Cancion, Album_Cancion
from django.contrib.auth import logout as log_out

def hashear_contraseña(contraseña):
    sal_generada = bcrypt.gensalt()
    hash_resultante = bcrypt.hashpw(contraseña.encode('utf-8'), sal_generada)
    hash_str = hash_resultante.decode('utf-8')
    return hash_str

def verificar_contraseña(contraseña, hash_almacenado):
    contraseña_bytes = contraseña.encode('utf-8')
    hash_almacenado_bytes = hash_almacenado.encode('utf-8')
    return bcrypt.checkpw(contraseña_bytes, hash_almacenado_bytes)

def imagen_valida(archivo):
    valid_extensions = ['.png', '.jpg', '.jpeg', '.gif']
    if not archivo:
        return True
    
    ext = os.path.splitext(archivo.name)[1]
    return ext.lower() in valid_extensions

def audio_valido(archivo):
    valid_extensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg']
    if not archivo:
        return True
    
    ext = os.path.splitext(archivo.name)[1]
    return ext.lower() in valid_extensions

# Create your views here.

def login(request):
    return render(request, 'login.html')

def index(request):
    if 'usuario_id' in request.session:
        usuario = Usuario.objects.get(id=request.session['usuario_id'])
        albumes = Album.objects.filter(usuario=usuario).order_by('-id')
        canciones = Cancion.objects.filter(usuario=usuario).order_by('-id')
        total_canciones = Cancion.objects.filter(usuario=usuario).count()
        total_albumes = Album.objects.filter(usuario=usuario).count()
        favoritos = []

        for cancion in canciones:
            if cancion.favorito:
                favoritos.append(cancion)

        for album in albumes:
            album.ids_canciones = set(album.album_cancion_set.values_list('cancion', flat=True))

        data = {
            'usuario':usuario,
            'albumes': albumes,
            'canciones': canciones,
            'filtro':'canciones',
            'total_canciones': total_canciones,
            'total_albumes': total_albumes,
            'canciones_favoritas': favoritos
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

def actualizar_perfil(request):
    if 'usuario_id' in request.session:
        if request.method == 'POST':
            username = request.POST.get("username")
            foto_perfil = request.FILES.get("foto_perfil")
            
            try:
                usuario = Usuario.objects.get(id=request.session['usuario_id'])
                
                if username:
                    usuario.username = username
                
                if foto_perfil:
                    if imagen_valida(foto_perfil):
                        usuario.foto_perfil = foto_perfil
                
                usuario.save()
                return redirect('index') 
            except Exception as e:
                print(f"ERROR: {e}")
                return redirect('index')
        else:
            return redirect('index')
    else:
        return redirect('login')

def agregar_favorito(request):
    if 'usuario_id' in request.session:
        cancion_id = request.POST.get('cancion_id')
        
        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])
            cancion = Cancion.objects.get(id=cancion_id, usuario=usuario)
            
            cancion.favorito = True
            cancion.save()

            return redirect('index')

        except Exception as e:
            print(f"ERROR: {e}")
            return redirect('index')
    else:
        return redirect('login')

def eliminar_favorito(request):
    if 'usuario_id' in request.session:
        cancion_id = request.POST.get('cancion_id')
        
        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])
            cancion = Cancion.objects.get(id=cancion_id, usuario=usuario)
            
            cancion.favorito = False
            cancion.save()

            return redirect('index')

        except Exception as e:
            print(f"ERROR: {e}")
            return redirect('index')
    else:
        return redirect('login')


def subir_cancion(request):
    if 'usuario_id' in request.session:
        imagen_cancion = request.FILES.get("imagen_cancion")
        nombre = request.POST.get("nombre")
        autor = request.POST.get("autor")
        archivo = request.FILES.get("archivo")

        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])

            if imagen_cancion:
                if imagen_valida(imagen_cancion):
                    if nombre and autor and archivo:
                        if audio_valido(archivo):
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
                            return redirect('index')
                    else:
                        return redirect('index')
                else:
                    if nombre and autor and archivo:
                        if audio_valido(archivo):
                            cancion = Cancion.objects.create(
                                nombre=nombre,
                                autor=autor,
                                archivo=archivo,
                                usuario=usuario
                            )

                            cancion.save()

                            return redirect('index')
                        else:
                            return redirect('index')
                    else:
                        return redirect('index')
            else:
                if nombre and autor and archivo:
                    if audio_valido(archivo):
                        cancion = Cancion.objects.create(
                            nombre=nombre,
                            autor=autor,
                            archivo=archivo,
                            usuario=usuario
                        )

                        cancion.save()

                        return redirect('index')
                    else:
                        return redirect('index')
                else:
                    return redirect('index')
        except Exception as e:
            print(f'ERROR: {e}')
            return redirect('index')
        
    else:
        return redirect('login')

def logout(request):
    if 'usuario_id' in request.session:
        log_out(request)
        return redirect('login')
    else:
        return redirect('login')

def crear_album(request):
    if 'usuario_id' in request.session:
        imagen_album = request.FILES.get("imagen_album")
        nombre = request.POST.get("nombre")
        descripcion = request.POST.get("descripcion")

        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])

            if imagen_album:
                if imagen_valida(imagen_album):
                    if nombre and descripcion:
                        album = Album.objects.create(
                            nombre=nombre,
                            descripcion=descripcion,
                            imagen=imagen_album,
                            usuario=usuario
                        )

                        album.save()

                        return redirect('index')
                    else:
                        return redirect('index')
                else:
                    return redirect('index')
            else:
                if nombre and descripcion:
                    album = Album.objects.create(
                        nombre=nombre,
                        descripcion=descripcion,
                        usuario=usuario
                    )

                    return redirect('index')
                else:
                    return redirect('index')

        except Exception as e:
            print(f'ERROR: {e}')
            return redirect('index')
        
    else:
        return redirect('login')

def buscar(request):
    if 'usuario_id' in request.session:
        buscar = request.GET.get("buscar")
        filtro = request.GET.get("filtro")

        try:
            usuario = Usuario.objects.get(id=request.session['usuario_id'])

            if buscar:
                canciones_resultantes = Cancion.objects.filter(nombre__icontains=buscar, usuario=usuario).order_by('-id')
                canciones = Cancion.objects.filter(usuario=usuario).order_by('-id')
                albumes = Album.objects.filter(nombre__icontains=buscar, usuario=usuario).order_by('-id')
                total_canciones = Cancion.objects.filter(usuario=usuario).count()
                total_albumes = Album.objects.filter(usuario=usuario).count()
                favoritos = []

                for cancion in canciones:
                    if cancion.favorito:
                        favoritos.append(cancion)

                for album in albumes:
                    album.ids_canciones = set(album.album_cancion_set.values_list('cancion', flat=True))

                data = {
                    'usuario':usuario,
                    'albumes': albumes,
                    'canciones': canciones_resultantes,
                    'filtro':filtro,
                    'total_canciones': total_canciones,
                    'total_albumes': total_albumes,
                    'canciones_favoritas': favoritos
                }

                return render(request, 'index.html', data)

            else:
                return redirect('index')
        except Exception as e:
            print(f"ERROR: {e}")
    else:
        return redirect('login')

def actualizar(request):
    if 'usuario_id' in request.session:
        canciones = request.POST.getlist('cancion_id[]')
        album_id = request.POST.get('album_id')
        album_nombre = request.POST.get('album_nombre')
        canciones_quitar = request.POST.getlist('cancion_quitar[]')
        eliminar_album = request.POST.get('eliminar_album')

        try:
            album_id = int(album_id)
            usuario = Usuario.objects.get(id=request.session['usuario_id'])
            album = Album.objects.get(id=album_id, usuario_id=usuario.id)

            if eliminar_album == 'eliminar':
                album.delete()
                return redirect('index')
            else:
                for id_quitar in canciones_quitar:
                    if id_quitar != '':
                        id_cancion_quitar = int(id_quitar)
                        cancion_quit = Cancion.objects.get(id=id_cancion_quitar)
                        relacion = Album_Cancion.objects.filter(album=album, cancion=cancion_quit)
                        relacion.delete()

                album.nombre = album_nombre
                album.save()

                if canciones:
                    for cancion_id in canciones:
                        if cancion_id != '':
                            id_cancion = int(cancion_id)
                            cancion = Cancion.objects.get(id=id_cancion)
                            relacion_si = Album_Cancion.objects.filter(album=album, cancion=cancion)
                            if relacion_si:
                                pass
                            else:
                                album_cancion = Album_Cancion.objects.create(
                                    album=album,
                                    cancion=cancion
                                )
                        else:
                            pass
                    
                    return redirect('index')
                else:
                    return redirect('index')
        except Exception as e:
            print(f"ERROR: {e}")
            return redirect('index')
    else:
        return redirect('login')
    
def eliminar_cancion(request):
    if 'usuario_id' in request.session:
        id_cancion = request.POST.get('id_cancion')

        try:
            id_cancion = int(id_cancion)
            cancion = Cancion.objects.get(id=id_cancion)

            cancion.delete()

            return redirect('index')
        except Exception as e:
            print(f'ERROR: {e}')
    else:
        return redirect('login')