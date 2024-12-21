from django.urls import path, include

from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('users/', include('accounts.urls')),
    path('email-confirm/<str:token>/', views.email_confirm, name='email-confirm'),
]