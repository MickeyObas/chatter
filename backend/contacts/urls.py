from django.urls import path

from . import views

urlpatterns = [
    path("", views.contact_list_create, name="contact-list-create"),
    path("online/", views.online_contact_list, name="online_contact_list"),
    path("<int:pk>/", views.contact_detail_or_delete, name="contact-detail_or_delete"),
]
