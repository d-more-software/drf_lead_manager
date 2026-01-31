from django.db import models
from django.db.models import Sum
from django.utils import timezone

from decimal import Decimal
from apps.agencies.models import Agency


class Company(models.Model):
    agency = models.ForeignKey(
        Agency,
        on_delete=models.CASCADE,
        related_name="companies"
    )

    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=255)
    email = models.EmailField()

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
    )

    province = models.CharField(max_length=100,blank=True)
    city = models.CharField(max_length=100)
    address = models.TextField(blank=True)

    responsible_name = models.CharField(max_length=255, blank=True)
    responsible_function = models.CharField(max_length=255, blank=True)

    accountant_name = models.CharField(max_length=255, blank=True)
    accountant_contact = models.CharField(max_length=255, blank=True)

    # 🔴 NOUVEAU — recouvrement
    credit_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=[
            ("normal", "Normal"),
            ("warning", "Warning"),
            ("contentious", "Contentious"),
        ],
        default="normal"
    )

    observation = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # =========================
    # 🔵 LOGIQUE METIER
    # =========================

    @property
    def total_due(self):
        """
        Somme restante à payer sur toutes les factures.
        Calcul dynamique → jamais stocké.
        """

        totals = self.invoices.aggregate(
            total_amount=Sum("amount_total"),
            paid_amount=Sum("amount_paid"),
        )

        total = totals["total_amount"] or Decimal("0.00")
        paid = totals["paid_amount"] or Decimal("0.00")

        return total - paid


    # ---------------------------------
    # STATUS REFRESH
    # ---------------------------------
    def refresh_status(self):
        """
        Met à jour automatiquement le statut selon le seuil.
        Appelé après paiements / factures / suppressions.
        """

        due = self.total_due

        if self.credit_limit and due > self.credit_limit:
            self.status = "contentious"

        elif self.credit_limit and due > (self.credit_limit * Decimal("0.8")):
            self.status = "warning"

        else:
            self.status = "normal"

        self.save(update_fields=["status"])


    def __str__(self):
        return self.name
