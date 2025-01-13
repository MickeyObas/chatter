from django.contrib import admin

from .models import Message, GroupChatMessage


class MessageModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'recipient', 'content', 'created_at']

class GroupChatMessageModelAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'groupchat', 'content', 'created_at']

admin.site.register(Message, MessageModelAdmin)
admin.site.register(GroupChatMessage, GroupChatMessageModelAdmin)
