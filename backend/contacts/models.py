from django.db import models


class Contact(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        BLOCKED = 'Blocked', 'Blocked'

    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE)
    contact_user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='contacted_by')
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_favorite = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'contact_user')
        ordering = ['contact_user__email']

    def __str__(self):
        return f"{self.user.email} -> {self.contact_user.email}"