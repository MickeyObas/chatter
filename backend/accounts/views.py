from rest_framework import status, permissions, parsers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes

from .models import (
    CustomUser
)
from .serializers import (
    UserSerializer,
    UserSummarySerializer,
    UserProfileUpdateSerializer
)


@api_view(['GET'])
def user_list(request):
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


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    try:
        user = request.user
    except Exception as e:
        return Response({'error': f'Could not get user data, {e}.'})
    
    serializer = UserSummarySerializer(user)

    return Response(serializer.data)


@api_view(['PATCH'])
@parser_classes([parsers.MultiPartParser])
def profile_update(request):
    try:
        user = request.user 

        serializer = UserProfileUpdateSerializer(user, data=request.data, context={'request': request}, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"message": "Profile updated successfully!"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': f'Could not update user data, {e}.'})
