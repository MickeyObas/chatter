from django.urls import path

from . import views


urlpatterns = [
    path('', views.contact_list, name='contact-list'),
    path('online/', views.online_contact_list, name='online_contact_list'),
    path('<int:pk>/', views.contact_detail, name='contact-detail')
]