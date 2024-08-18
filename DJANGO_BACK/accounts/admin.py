from django.contrib import admin
from accounts.models import MyUser
from shop.models import Publisher, Genre, Theme, Author, Book, Sale, SaleItem
from social.models import Rating, Review, Friendship
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = MyUser
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('profile_picture','rol')}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('profile_picture','rol')}),)

admin.site.register(MyUser,CustomUserAdmin)
admin.site.register(Publisher)
admin.site.register(Genre)
admin.site.register(Theme)
admin.site.register(Author)
admin.site.register(Book)
admin.site.register(Sale)
admin.site.register(SaleItem)
admin.site.register(Rating)
admin.site.register(Review)
admin.site.register(Friendship)