from django.urls import path

from . import views


urlpatterns = [
    path('', views.contact_list, name='contact-list'),
    path('<int:pk>/', views.contact_detail, name='contact-detail')
]