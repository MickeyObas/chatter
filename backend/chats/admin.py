from django.contrib import admin

from .models import Chat


class ChatModelAdmin(admin.ModelAdmin):
    pass

admin.site.register(Chat, ChatModelAdmin)