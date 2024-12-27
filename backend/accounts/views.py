from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import (
    CustomUser
)
from .serializers import UserSerializer


@api_view(['GET'])
def user_list(request):
    print(f"{request.user} is getting all users")
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def user_detail(request, pk):
    try:
        user = CustomUser.objects.get(id=pk)
    except CustomUser.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    
    return Response(serializer.data)