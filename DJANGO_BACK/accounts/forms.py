from django.contrib.auth.forms import UserCreationForm
from django import forms
from shop.models import MyUser

# Registro de usuarios
class RegisterForm(UserCreationForm):
    profile_picture = forms.ImageField(required=False)
    class Meta:
        model = MyUser
        fields = ['username','password1','password2','profile_picture']