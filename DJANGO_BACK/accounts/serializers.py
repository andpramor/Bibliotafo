from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from accounts.models import MyUser
from shop.models import Sale

class LoginTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        credentials = {
            'username': '',
            'password': attrs.get('password')
        }

        #Tanto email como username son únicos, verifico que el usuario proporcionado existe:
        user = MyUser.objects.filter(email=attrs.get('username')).first() or MyUser.objects.filter(username=attrs.get('username')).first()

        if user:
            credentials['username'] = user.username

        if not user:
            raise serializers.ValidationError(('No user found with the provided credentials.'))

        response = super().validate(credentials)
        response.update({'rol': user.rol}) #Añado el rol del usuario en la respuesta
        response.update({'id': user.pk}) #Añado la pk del usuario a la respuesta

        if user.rol == 'client':
            sale_open = Sale.objects.filter(buyer=user.pk, sale_done=False).first()
            if sale_open:
                response.update({'sale': sale_open.pk})
        else:
            sale_open = Sale.objects.filter(seller=user.pk, sale_done=False).first()
            if sale_open:
                response.update({'sale': sale_open.pk})
        if user.profile_picture:
            response.update({'profile': user.profile_picture.url})
        else:
            response.update({'profile': None})

        return response

class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'first_name', 'email', 'profile_picture', 'rol', 'address']

class MyUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'profile_picture']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username','password', 'first_name', 'last_name', 'email', 'profile_picture']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': True},
            'profile_picture': {'required': False}
        }