import secrets

from django.conf import settings
from django.core.mail import send_mail


def generate_confirmation_token():
    return secrets.token_urlsafe(64)


def send_confirmation_email(user, token):
    confirmation_link = f"{settings.FRONTEND_URL}/email-confirm/{token}/"
    subject = "Confirm Your Email Address"
    message = f"Click the link to confirm your email: {confirmation_link}"
    send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
