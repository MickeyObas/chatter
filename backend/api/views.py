from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout as django_logout
from django.contrib.auth import login as django_login

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.http import JsonResponse

from django.contrib.auth import authenticate
from django.core.cache import cache
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

from accounts.models import CustomUser
from accounts.serializers import UserSerializer


class CustomLogoutView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'You are not logged in'}, status=400)
        
        django_logout(request)
        
        return JsonResponse({"detail": "SUccessfully logged out!"}) 


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
            response = Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            })

            django_login(request, user)

            return response
            
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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


# SESSION + CSRF Functions
def get_csrf(request):
    response = JsonResponse({"detail": "CSRF cookie set"})
    response['X-CSRFToken'] = get_token(request)
    return response


@ensure_csrf_cookie
def session(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": False}, status=400)
    
    return JsonResponse({"isAuthenticated": True})


def whoami(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})
    
    return JsonResponse({'user': request.user.username})