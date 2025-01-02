from django.db import models
from django.conf import settings
from django.db.models import Max


class Chat(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner.email}'s Chat with {self.user}"
    
    @classmethod
    def order_by_latest_message(cls, user):
        return cls.objects.filter(owner=user).annotate(
            latest_message_time=Max('messages__created_at')
        ).order_by('-latest_message_time')
    
    class Meta:
        unique_together = ['owner', 'user']
        