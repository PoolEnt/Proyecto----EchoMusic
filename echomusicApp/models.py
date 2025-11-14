from django.db import models

# Create your models here.

class Usuario(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False)
    apellido = models.CharField(max_length=30, null=False, blank=False)
    username = models.CharField(max_length=30, null=False, blank=False, unique=True)
    correo = models.EmailField(null=False, blank=False, unique=True)
    contraseña = models.CharField(max_length=50, null=False, blank=False)
    foto_perfil = models.ImageField(null=True, blank=True, default='/static/images/icons/img_perfil.svg')

class Playlist(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    descripcion = models.TextField(max_length=500, null=False, blank=False)
    imagen = models.ImageField(null=True, blank=True, default='/static/images/icons/img_playlist.svg')

class Cancion(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    autor = models.CharField(max_length=30, null=False, blank=False)
    archivo = models.FileField(null=False, blank=False)