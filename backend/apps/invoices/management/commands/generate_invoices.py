from django.core.management.base import BaseCommand
from apps.invoices.services import generate_invoices_for_today



class Command(BaseCommand):
    help = "Generate invoices automatically for due contracts"

    def handle(self, *args, **kwargs):

        self.stdout.write("Generating invoices...")

        generate_invoices_for_today()

        self.stdout.write(self.style.SUCCESS("Done."))
