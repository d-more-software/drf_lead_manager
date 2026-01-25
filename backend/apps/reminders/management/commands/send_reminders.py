from django.core.management.base import BaseCommand
from apps.reminders.services import send_due_reminders


class Command(BaseCommand):
    help = "Send scheduled invoice reminders"

    def handle(self, *args, **kwargs):

        self.stdout.write("Sending reminders...")

        send_due_reminders()

        self.stdout.write(self.style.SUCCESS("Done."))
