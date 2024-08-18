from django.urls import include, path
from accounts import views
from accounts.views import ClientRegisterView, LoginApiView, ManagerRegisterView, MyOwnUserView, MyUsersView, ReadUser, StaffRegisterView, Users, UpdateUser


#____MONOLÍTICAS____
urlpatterns = [
    path('monolitica/accounts/', include('django.contrib.auth.urls')), #login

    path('monolitica/client_register/', views.client_register, name='client_register'),
    path('monolitica/staff_register/', views.staff_register, name='staff_register'),
    path('monolitica/manager_register/', views.manager_register, name='manager_register'),

    path('monolitica/users/', Users.as_view(), name='users'),
    path('monolitica/readUser/<int:pk>', ReadUser.as_view(), name='readUser'),
    path('monolitica/updateUser/<int:pk>', UpdateUser.as_view(), name='updateUser')
]

#____API____ (api/v1/accounts/)
urlpatterns += [    
    path('login/', LoginApiView.as_view(), name='login'),
    path('client_register/', ClientRegisterView.as_view(), name='client_register'),
    path('staff_register/', StaffRegisterView.as_view(), name='staff_register'),
    path('manager_register/', ManagerRegisterView.as_view(), name='manager_register'),
    path('users/<int:pk>/', MyUsersView.as_view(), name='user_details'),
    path('users/', MyUsersView.as_view(), name='users_list'),
    path('profile/', MyOwnUserView.as_view(), name='own_user')
]