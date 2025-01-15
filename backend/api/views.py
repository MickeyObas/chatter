from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout as django_logout

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.http import JsonResponse

from django.contrib.auth import authenticate
from django.core.cache import cache

from accounts.models import CustomUser
from accounts.serializers import UserSerializer
from backend.config.redis_client import redis_client
    

@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Both email address and password are required'})
    
    user = authenticate(email=email, password=password)

    if user is not None:
       
        if not user.is_verified:
            return Response({'error': 'Email is not verified. Please check your email to complete registration.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            refresh = RefreshToken.for_user(user)
            profile_picture = user.profile_picture.url if user.profile_picture else None
            return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_picture': profile_picture
            },
            'is_first_login': user.is_first_login
        }, status=status.HTTP_200_OK)
            
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def logout(request):
    user = request.user
    redis_client.srem('online_users', user.id)
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
def email_confirm(request, token):
    user_id = cache.get(token)
    if not user_id:
        return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
    user = CustomUser.objects.get(id=user_id)
    user.is_verified = True
    user.save()

    cache.delete(token)

    return Response({"message": "Email confirmed. Redirecting to Login"}, status=status.HTTP_200_OK)