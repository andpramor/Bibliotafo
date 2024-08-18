from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from bibliotafo import views

urlpatterns = [
    path('admin/', admin.site.urls), #Django admin (monolítico)
    path('', views.home, name='home'), #Página de inicio (monolítico)

    #____API____
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/shop/', include('shop.urls')),
    path('api/v1/social/', include('social.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)