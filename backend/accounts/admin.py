from django.contrib import admin

from .models import CustomUser 


class UserModelAdmin(admin.ModelAdmin):
    pass

admin.site.register(CustomUser, UserModelAdmin)