from django.urls import path

from . import views

urlpatterns = [
    path('', views.chat_list, name='chat_list'),
    path('<int:pk>/', views.chat_detail, name='chat_detail'),
    path('contact/<int:pk>/', views.chat_detail_by_contact, name='chat_detail_by_contact'),
    path('<int:pk>/set-last-read-message/', views.set_last_read_message, name='set_last_read_message'),
]