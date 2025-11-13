from django.shortcuts import render, redirect

# Create your views here.

def login(request):
    return render(request, 'login.html')

def index(request):
    if 'usuario_id' in request.session:
        return render(request, 'index.html')
    else:
        return redirect('login')