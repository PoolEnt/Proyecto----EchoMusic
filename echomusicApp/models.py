from django.db import models

# Create your models here.

class Usuario(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False)
    apellido = models.CharField(max_length=30, null=False, blank=False)
    username = models.CharField(max_length=30, null=False, blank=False, unique=True)
    correo = models.EmailField(null=False, blank=False, unique=True)
    contraseña = models.CharField(max_length=100, null=False, blank=False)
    foto_perfil = models.ImageField(null=True, blank=True, default='/static/images/icons/img_perfil.svg')

class Album(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    descripcion = models.TextField(max_length=500, null=False, blank=False)
    imagen = models.ImageField(null=True, blank=True, default='/static/images/icons/img_album.svg')
    usuario = models.ForeignKey(Usuario, null=False, blank=False, on_delete=models.CASCADE)

class Cancion(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    autor = models.CharField(max_length=30, null=False, blank=False)
    imagen = models.ImageField(null=False, blank=False, default='/static/images/icons/img_album.svg')
    archivo = models.FileField(null=False, blank=False, unique=True)
    album = models.ForeignKey(Album, null=True, blank=True, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, null=False, blank=False, on_delete=models.CASCADE)