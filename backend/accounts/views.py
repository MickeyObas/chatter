from rest_framework import status, permissions, parsers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes

from .models import (
    CustomUser
)
from .serializers import (
    UserSerializer,
    UserSummarySerializer
)


@api_view(['POST'])
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


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    try:
        user = request.user
    except Exception as e:
        return Response({'error': f'Could not get user data, {e}.'})
    
    serializer = UserSummarySerializer(user)

    return Response(serializer.data)


@api_view(['PUT'])
@parser_classes([parsers.MultiPartParser])
def profile_update(request):
    try:
        user = request.user 

        if 'profilePic' in request.FILES:
            print("Vamoss")

            # Assuming you're handling the profile picture here
            # Save the picture or process it as needed

        return Response({"message": "Profile updated successfully!"})

    except Exception as e:
        print(e)
        return Response({'error': f'Could not update user data, {e}.'})
