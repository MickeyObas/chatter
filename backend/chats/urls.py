from django.urls import path

from . import views

urlpatterns = [
    path('', views.chat_list, name='chat_list'),
    path('list-for-admin/', views.admin_chat_list),
    path('<int:pk>/', views.chat_detail, name='chat_detail'),
    path('contact/<int:pk>/', views.chat_detail_by_contact, name='chat_detail_by_contact'),
    path('<int:pk>/set-last-read-message/', views.set_last_read_message, name='set_last_read_message'),
    path('<int:chat_id>/set-message-read-status/', views.set_unread_messages_to_read),
    path('groups/', views.group_chat_list_or_create, name='group_chat_list'),
    path('groups/<int:pk>/', views.group_chat_detail, name='group_chat_detail'),
    path('groups/<int:groupchat_id>/add-contact/', views.add_contact_to_group),
]