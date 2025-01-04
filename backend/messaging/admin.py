from django.contrib import admin

from .models import Message


class MessageModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'recipient', 'content', 'created_at']

admin.site.register(Message, MessageModelAdmin)
