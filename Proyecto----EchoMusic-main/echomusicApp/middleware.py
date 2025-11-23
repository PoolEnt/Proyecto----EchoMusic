import os
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse

class RangesMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.status_code != 200 or not hasattr(response, 'file_to_stream'):
            return response

        http_range = request.META.get('HTTP_RANGE')
        if not http_range:
            return response

        f = response.file_to_stream
        try:
            statobj = os.fstat(f.fileno())
        except ValueError:
            return response

        file_size = statobj.st_size
        start, end = http_range.split('=')[1].split('-')
        
        if not start:
            start = max(0, file_size - int(end))
            end = file_size - 1
        else:
            start = int(start)
            if not end:
                end = file_size - 1
            else:
                end = int(end)

        if start >= file_size:
            return response

        end = min(end, file_size - 1)
        content_length = end - start + 1
        f.seek(start)
        file_data = f.read(content_length)
        
        new_response = HttpResponse(
            file_data, 
            status=206, 
            content_type=response.get('Content-Type', 'application/octet-stream')
        )
        
        new_response['Content-Length'] = str(content_length)
        new_response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
        new_response['Accept-Ranges'] = 'bytes'
        response.close()
        
        return new_response