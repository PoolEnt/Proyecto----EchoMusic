from django.db import models
import os
from django.core.exceptions import ValidationError

def audio_valido(value):    
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Formato de archivo no soportado. Sube un archivo PNG o JPG.')

def imagen_valida(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.png', '.jpg', '.jpeg', '.gif']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Formato de archivo no soportado. Sube un archivo PNG o JPG.')

# Create your models here.

class Usuario(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False)
    apellido = models.CharField(max_length=30, null=False, blank=False)
    username = models.CharField(max_length=30, null=False, blank=False, unique=True)
    correo = models.EmailField(null=False, blank=False, unique=True)
    contraseña = models.CharField(max_length=100, null=False, blank=False)
    foto_perfil = models.ImageField(validators=[imagen_valida], null=True, blank=True, default='/default/img_perfil.svg')

class Album(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    descripcion = models.TextField(max_length=100, null=False, blank=False)
    imagen = models.ImageField(validators=[imagen_valida], null=False, blank=False, default='/default/img_album.svg')
    usuario = models.ForeignKey(Usuario, null=False, blank=False, on_delete=models.CASCADE)

class Cancion(models.Model):
    nombre = models.CharField(max_length=30, null=False, blank=False, unique=True)
    autor = models.CharField(max_length=30, null=False, blank=False)
    imagen = models.ImageField(validators=[imagen_valida], null=False, blank=False, default='/default/img_album.svg')
    archivo = models.FileField(validators=[audio_valido], null=False, blank=False, unique=True)
    usuario = models.ForeignKey(Usuario, null=False, blank=False, on_delete=models.CASCADE)
    favorito = models.BooleanField(null=False, blank=False, default=False)

class Album_Cancion(models.Model):
    album = models.ForeignKey(Album, null=False, blank=False, on_delete=models.CASCADE)
    cancion = models.ForeignKey(Cancion, null=False, blank=False, on_delete=models.CASCADE)