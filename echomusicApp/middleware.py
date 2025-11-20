import os
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse

class RangesMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # 1. Si no es una descarga de archivo (FileResponse) o no es status 200, pasamos.
        if response.status_code != 200 or not hasattr(response, 'file_to_stream'):
            return response

        # 2. Verificar si el navegador pidió un Rango (Range Header)
        http_range = request.META.get('HTTP_RANGE')
        if not http_range:
            return response

        # 3. Obtener el archivo y su tamaño
        f = response.file_to_stream
        try:
            statobj = os.fstat(f.fileno())
        except ValueError:
            return response

        file_size = statobj.st_size

        # 4. Calcular Start y End
        start, end = http_range.split('=')[1].split('-')
        
        if not start:  # Pidiendo los últimos N bytes
            start = max(0, file_size - int(end))
            end = file_size - 1
        else:
            start = int(start)
            if not end: # Pidiendo desde Start hasta el final
                end = file_size - 1
            else:
                end = int(end)

        # 5. Validación de seguridad: Si el rango está fuera de límites, devolvemos todo
        if start >= file_size:
            return response

        end = min(end, file_size - 1)
        
        # 6. Calcular longitud del pedazo
        content_length = end - start + 1

        # 7. Leer el pedazo del archivo
        f.seek(start)
        file_data = f.read(content_length)
        
        # 8. CREAR UNA NUEVA RESPUESTA (Aquí estaba el error anterior)
        # En lugar de modificar 'response', creamos una HttpResponse nueva con el pedazo de datos.
        new_response = HttpResponse(
            file_data, 
            status=206, 
            content_type=response.get('Content-Type', 'application/octet-stream')
        )
        
        # 9. Establecer las cabeceras necesarias
        new_response['Content-Length'] = str(content_length)
        new_response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        new_response['Accept-Ranges'] = 'bytes'
        
        # Cerrar la respuesta anterior para liberar recursos (opcional pero recomendado)
        response.close()
        
        return new_response