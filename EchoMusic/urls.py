"""
URL configuration for EchoMusic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from echomusicApp import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('registrarse/', views.registrarse, name='registrarse'),
    path('ingresar/', views.ingresar, name='ingresar'),
    path('perfil/', views.perfil, name='perfil'),
    path('actualizar_perfil/', views.actualizar_perfil, name='actualizar_perfil'),
    path('agregar_favorito/', views.agregar_favorito, name='agregar_favorito'),
    path('eliminar_favorito/', views.eliminar_favorito, name='eliminar_favorito'),
    path('subir_cancion/', views.subir_cancion, name='subir_cancion'),
    path('logout/', views.logout, name='logout'),
    path('crear_album/', views.crear_album, name='crear_album'),
    path('buscar/', views.buscar, name='buscar'),
    path('actualizar/', views.actualizar, name='actualizar'),
    path('crear_playlist/', views.crear_playlist, name='crear_playlist'),
    path('playlists/', views.playlists, name='playlists'),
    path('ver_playlist/<int:playlist_id>/', views.ver_playlist, name='ver_playlist'),
    path('agregar_cancion_playlist/', views.agregar_cancion_playlist, name='agregar_cancion_playlist'),
    path('quitar_cancion_playlist/', views.quitar_cancion_playlist, name='quitar_cancion_playlist'),
    path('reordenar_playlist/', views.reordenar_playlist, name='reordenar_playlist'),
    path('editar_playlist/', views.editar_playlist, name='editar_playlist'),
    path('eliminar_playlist/', views.eliminar_playlist, name='eliminar_playlist'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)