from django.urls import path

from . import views

urlpatterns = [
    path("", views.create_message, name="create_message"),
    path("groups/<int:groupchat_id>/mark-as-read/", views.mark_group_messages_as_read),
]
