import random

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Max


def validate_profile_picture(image):
    max_size_kb = 1024

    if hasattr(image, "size") and image.size > max_size_kb * 1024:
        raise ValidationError("Image size exceeds 1 MB.")

    if hasattr(image, "content_type") and not image.content_type.startswith("image/"):
        raise ValidationError("Invalid image format.")


class Chat(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chats"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_read_message = models.ForeignKey(
        "messaging.Message",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="last_read_message_chat",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.owner.email}'s Chat with {self.user}"

    @classmethod
    def order_by_latest_message(cls, user):
        try:
            return (
                cls.objects.filter(owner=user)
                .annotate(latest_message_time=Max("messages__created_at"))
                .order_by("-latest_message_time")
            )
        except Exception as e:
            print("The issue is here", e)
            return cls.objects.none()

    class Meta:
        unique_together = ["owner", "user"]


class GroupChat(models.Model):
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(
        "accounts.CustomUser", on_delete=models.CASCADE, related_name="groupchats_owned"
    )
    admins = models.ManyToManyField(
        "accounts.CustomUser", related_name="groupchats_admninistrated"
    )
    description = models.TextField()
    picture = models.ImageField(
        blank=True,
        null=True,
        upload_to="group_chat_display_pictures/",
        validators=[validate_profile_picture],
    )
    members = models.ManyToManyField("accounts.CustomUser")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def order_by_latest_message(cls, user):
        try:
            return (
                cls.objects.filter(members__in=[user.id])
                .annotate(latest_message_time=Max("groupchatmessage__created_at"))
                .order_by("-latest_message_time")
            )
        except Exception as e:
            print("The issue is here", e)
            return cls.objects.none()

    def __str__(self):
        return self.title


filtered_colors = [
    "#FF5733",  # Fiery Orange
    "#33FF57",  # Bright Green
    "#3357FF",  # Vivid Blue
    "#FF33A8",  # Vibrant Pink
    "#800080",  # Purple
    "#FF4500",  # Orange Red
    "#2E8B57",  # Sea Green
    "#8A2BE2",  # Blue Violet
    "#DC143C",  # Crimson
    "#00FA9A",  # Medium Spring Green
    "#FF6347",  # Tomato
    "#4682B4",  # Steel Blue
    "#D2691E",  # Chocolate
    "#FF1493",  # Deep Pink
    "#6495ED",  # Cornflower Blue
    "#9ACD32",  # Yellow Green
    "#EE82EE",  # Violet
    "#5F9EA0",  # Cadet Blue
    "#808080",  # Gray
    "#191970",  # Midnight Blue
    "#FFA07A",  # Light Salmon
    "#32CD32",  # Lime Green
    "#BA55D3",  # Medium Orchid
    "#800000",  # Maroon
]


def get_random_color():
    return random.choice(filtered_colors)


class UserGroupContactColorMap(models.Model):
    user = models.ForeignKey(
        "accounts.CustomUser",
        on_delete=models.CASCADE,
        related_name="user_group_contact_color_maps",
    )
    group = models.ForeignKey("chats.GroupChat", on_delete=models.CASCADE)
    contact_user = models.ForeignKey("accounts.CustomUser", on_delete=models.CASCADE)
    color = models.CharField(max_length=8, default=get_random_color)

    def __str__(self):
        return f"{self.user} -> {self.contact_user.email} : {self.color}"
