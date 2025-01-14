from django.db import models
from django.db.models import Max


class Message(models.Model):
    chat = models.ForeignKey('chats.Chat', on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content

    class Meta:
        get_latest_by = 'created_at'
        ordering = ['created_at']


class GroupChatMessage(models.Model):
    groupchat = models.ForeignKey('chats.GroupChat', on_delete=models.CASCADE)
    sender = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        get_latest_by = 'created_at'
        ordering = ['created_at']
    

class GroupChatMessageReadStatus(models.Model):
    message = models.ForeignKey('messaging.GroupChatMessage', on_delete=models.CASCADE)
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    read_at = models.DateTimeField()

    class Meta:
        get_latest_by = 'read_at'

    def __str__(self):
        return f"{self.message.sender.email} -> {self.message.content}"



    

