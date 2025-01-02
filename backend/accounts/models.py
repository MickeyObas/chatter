from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import CustomUserManager

from PIL import Image


def validate_profile_picture(image):
    max_size_kb = 1024  

    if hasattr(image, 'size') and image.size > max_size_kb * 1024:
        raise ValidationError("Image size exceeds 1 MB.")
    
    if hasattr(image, 'content_type') and not image.content_type.startswith("image/"):
        raise ValidationError("Invalid image format.")
    
    try:
        img = Image.open(image)
        img.verify()
    except (IOError, SyntaxError):
        raise ValidationError("The uploaded file is not a valid image file.")
    

class CustomUser(AbstractBaseUser, PermissionsMixin):
    class OnlineStatus(models.TextChoices):
        ONLINE = 'ONLINE', 'Online'
        OFFLINE = 'OFFLINE', 'Offline'

    email = models.EmailField(_("email address"), unique=True)
    profile_picture = models.ImageField(
        blank=True,
        null=True,
        upload_to='profile_pictures/',
        validators=[validate_profile_picture]
    )
    first_name = models.CharField(max_length=140)
    last_name = models.CharField(max_length=140)
    display_name = models.CharField(max_length=160, blank=True, null=True)
    status = models.CharField(max_length=10, choices=OnlineStatus.choices, default=OnlineStatus.OFFLINE)
    status_text = models.CharField(max_length=255, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_seen = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email
    
    def delete(self):
        self.deleted_at = timezone.now()
        self.save()