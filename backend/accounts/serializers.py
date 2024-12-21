from rest_framework import serializers
from django.core.cache import cache

from .models import CustomUser
from .utils import generate_confirmation_token, send_confirmation_email


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'name',
            "first_name",
            "last_name",
            'password',
            'display_name',
            'profile_picture',
            'status',
            'last_seen',
            'deleted_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'status': {'read_only': True},
            'last_seen': {'read_only': True},
            'deleted_at': {'read_only': True},
            'first_name': {'write_only': True},
            'last_name': {'write_only': True}
        }

    def get_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        elif obj.first_name:
            return obj.first_name
        elif obj.last_name:
            return obj.last_name
        
    def validate_email(self, email):
        return email.strip()
    
    def validate_first_name(self, first_name):
        return first_name.strip()
    
    def validate_last_name(self, last_name):
        return last_name.strip()
    
    def validate_profile_picture(self, image):
        if image.size > 1024 * 1024:
            raise serializers.ValidationError("Image size exceeds 1 MB")
        if not image.content_type.startswith("image/"):
            raise serializers.ValidationError("Invald image format")
        return image

    def create(self, validated_data):
        user =  CustomUser.objects.create_user(**validated_data)
        token = generate_confirmation_token()
        cache.set(token, user.id, timeout=60*60*24)
        send_confirmation_email(user, token)
        return user
