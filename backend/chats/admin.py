from django.contrib import admin

from .models import Chat


class ChatModelAdmin(admin.ModelAdmin):
    list_display = ['owner', 'user', 'last_read_message', 'created_at', 'updated_at']

admin.site.register(Chat, ChatModelAdmin)