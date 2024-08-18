from rest_framework import permissions
    
# Sólo managers:
class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.rol == 'manager'

# Sólo managers editan:
class IsManagerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS: # GET, HEAD y OPTIONS
            return True
        return request.user.is_authenticated and request.user.rol == 'manager'
