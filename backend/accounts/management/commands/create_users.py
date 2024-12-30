from django.core.management import BaseCommand

from accounts.models import CustomUser as User


class Command(BaseCommand):
    help = "Generate random active users"

    def handle(self, *args, **kwargs):
        for i in range(10):
            User.objects.create(
                first_name=f"Person {i}",
                last_name=f"Person {i}",
                email=f"Person{i}@email.com"
            )
        
        
        self.stdout.write(self.style.SUCCESS('Users added successfully'))