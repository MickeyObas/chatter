from django.db import models
from django.conf import settings
from django.db.models import Max


class Chat(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_read_message = models.ForeignKey('messaging.Message', on_delete=models.SET_NULL, null=True, blank=True, related_name='last_read_message_chat')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner.email}'s Chat with {self.user}"
    
    def has_unread_message(self):
        if not self.messages.exists():
            return False

        if not self.last_read_message and self.messages.exists():
            return True
        
        return self.messages.filter(created_at__gt=self.last_read_message.created_at).exists()
    
    @classmethod
    def order_by_latest_message(cls, user):
        try:
            return cls.objects.filter(owner=user).annotate(
                latest_message_time=Max('messages__created_at')
            ).order_by('-latest_message_time')
        except Exception as e:
            print("The issue is here", e)
            return cls.objects.none()
    
    class Meta:
        unique_together = ['owner', 'user']
        