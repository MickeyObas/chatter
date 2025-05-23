from django.contrib import admin

from .models import Chat, GroupChat, UserGroupContactColorMap


class ChatModelAdmin(admin.ModelAdmin):
    list_display = ["owner", "user", "last_read_message", "created_at", "updated_at"]


class GroupChatModelAdmin(admin.ModelAdmin):
    list_display = ["id", "owner", "title", "description"]


admin.site.register(Chat, ChatModelAdmin)
admin.site.register(GroupChat, GroupChatModelAdmin)
admin.site.register(UserGroupContactColorMap)
