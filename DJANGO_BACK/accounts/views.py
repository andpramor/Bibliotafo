from typing import Any

from django.db.models.query import QuerySet
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, UpdateView
from django.contrib.auth import login
from django.contrib.auth.hashers import make_password

from bibliotafo.permissions import IsManager

from accounts.models import MyUser
from accounts.forms import RegisterForm
from accounts.serializers import LoginTokenSerializer, MyUserSerializer, MyUserUpdateSerializer, RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# __________VISTAS MONOLÍTICAS__________

class Users(ListView):
    model = MyUser
    template_name = 'accounts/users.html'
    paginate_by = 10


    def get_queryset(self) -> QuerySet[Any]:
        queryset = MyUser.objects.all().order_by('username')
        return queryset

def client_register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.rol = 'client' #Establezco el rol del usuario a crear como cliente.
            #TODO en su lugar, añadir al usuario al grupo clientes.
            user = form.cleaned_data.save() #TODO Comprobar que va con el añadido ".cleaned_data".
            login(request,user)
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'registration/client_register.html', {'form':form})

def staff_register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.rol = 'staff' #Establezco el rol del usuario a crear como staff.
            form.save() #No hago login con el nuevo usuario, lo ha creado un manager pero el manager sigue con la sesión iniciada.
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'registration/staff_register.html', {'form':form})

def manager_register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            form.instance.rol = 'manager' #Establezco el rol del usuario a crear como manager.
            form.save()
            return redirect('home')
    else:
        form = RegisterForm()
    return render(request, 'registration/manager_register.html', {'form':form})

class ReadUser(DetailView):
    model = MyUser
    template_name = 'accounts/readUser.html'

class UpdateUser(UpdateView):
    model = MyUser
    template_name = 'accounts/updateUser.html'
    fields = ['username', 'first_name', 'last_name', 'email', 'password', 'dni', 'address', 'phone', 'profile_picture']

    #Para volver al perfil tras actualizarlo:
    def get_success_url(self):
        user_id = self.object.pk
        return reverse_lazy('readUser', kwargs={'pk': user_id})

    # Personalizo los labels del formulario para que no salgan en inglés como los atributos de la clase:
    def get_form(self):
        form = super().get_form()
        form.fields['username'].label = 'Nombre de usuario'
        form.fields['first_name'].label = 'Nombre'
        form.fields['last_name'].label = 'Apellidos'
        form.fields['email'].label = 'Correo electrónico'
        form.fields['password'].label = 'Contraseña'
        form.fields['dni'].label = 'DNI'
        form.fields['address'].label = 'Dirección'
        form.fields['phone'].label = 'Teléfono'
        form.fields['profile_picture'].label = 'Foto de perfil'
        return form

# __________VISTAS API__________

# Login
class LoginApiView(TokenObtainPairView):
    serializer_class = LoginTokenSerializer

# Users
class MyUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk == None:
            users = MyUser.objects.all()
            if request.user.rol == 'client':
                users = users.filter(rol='client')
            else:
                rol = request.query_params.get('rol')
                if rol:
                    users = users.filter(rol=rol)
            serializer = MyUserSerializer(users, many=True)
            return Response(serializer.data)
        else:
            user = get_object_or_404(MyUser, pk=pk)
            if request.user != user: #Esto y entrar en MyOwnProfile es lo mismo.
                #COMPROBAR AMISTAD (tampoco hace falta la comprobación que ya hago aquí abajo porque no hay amistad entre no clientes)
                if request.user.rol == 'client' and user.rol != 'client':
                    return Response('No tienes acceso a los perfiles de los trabajadores', status.HTTP_401_UNAUTHORIZED)
            serializer = MyUserSerializer(user)
            return Response(serializer.data)
        
    def patch(self, request, pk):
        user = get_object_or_404(MyUser, pk=pk)
        if user == request.user:
            serializer = MyUserUpdateSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                # Si la contraseña es parte de lo que voy a cambiar, la encripto antes de guardarla:
                if 'password' in serializer.validated_data:
                    serializer.validated_data['password'] = make_password(serializer.validated_data['password'])

                serializer.save()
                return Response(serializer.data, status.HTTP_200_OK)
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        return Response('Sólo puedes editar tu propio perfil', status.HTTP_401_UNAUTHORIZED)

    def delete(self, request):
        user = get_object_or_404(MyUser, pk=request.user.pk)
        user.delete()
        return Response(status.HTTP_204_NO_CONTENT)

class MyOwnUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(MyUser, pk=request.user.pk)
        serializer = MyUserSerializer(user)
        return Response(serializer.data)

# Register
class ClientRegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            #Aquí tengo la contraseña, el rol se lo impondré, encripto la contraseña para guardarla:
            encrypted_password = make_password(password)

            user_data = {**serializer.validated_data, 'password': encrypted_password, 'rol': 'client'} #Monto un usuario con los datos serializados y sustituyo el valor de la contraseña por el de la contraseña encriptada

            new_client = MyUser.objects.create(**user_data)

            response_data = {
                'id': new_client.id,
                'username': new_client.username,
                'first_name': new_client.first_name,
                'last_name': new_client.last_name,
                'email': new_client.email,
                'profile_picture': new_client.profile_picture.url if new_client.profile_picture else None, #Al mandar el nombre.url de un campo tipo ImageField, Django pasa la url pública, que un navegador puede usar para mostrar la imagen directamente.
                'rol': new_client.rol
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StaffRegisterView(APIView):
    permission_classes = [IsManager]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            encrypted_password = make_password(password)

            user_data = {**serializer.validated_data, 'password': encrypted_password, 'rol': 'staff'}

            new_staff = MyUser.objects.create(**user_data)

            response_data = {
                'id': new_staff.id,
                'username': new_staff.username,
                'first_name': new_staff.first_name,
                'last_name': new_staff.last_name,
                'email': new_staff.email,
                'profile_picture': new_staff.profile_picture.url if new_staff.profile_picture else None,
                'rol': new_staff.rol
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagerRegisterView(APIView):
    permission_classes = [IsManager]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            encrypted_password = make_password(password)

            user_data = {**serializer.validated_data, 'password': encrypted_password, 'rol': 'manager'}

            new_manager = MyUser.objects.create(**user_data)

            response_data = {
                'id': new_manager.id,
                'username': new_manager.username,
                'first_name': new_manager.first_name,
                'last_name': new_manager.last_name,
                'email': new_manager.email,
                'profile_picture': new_manager.profile_picture.url if new_manager.profile_picture else None,
                'rol': new_manager.rol
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)