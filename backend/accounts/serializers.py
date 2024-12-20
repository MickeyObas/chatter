from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'email',
            'name',
            'display_name',
            'profile_picture',
            'status',
            'last_seen',
            'deleted_at'
        ]

    def get_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        elif obj.first_name:
            return obj.first_name
        elif obj.last_name:
            return obj.last_name
        
    def validate_profile_picture(self, image):
        if image.size > 1024 * 1024:
            raise serializers.ValidationError("Image size exceeds 1 MB")
        if not image.content_type.startswith("image/"):
            raise serializers.ValidationError("Invald image format")
        return image