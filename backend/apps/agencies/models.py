from django.db import models


class Agency(models.Model):

    CURRENCY_CHOICES = (
        ("EUR", "Euro €"),
        ("USD", "Dollar $"),
        ("GBP", "Livre £"),
        ("TRY", "Lira Turque"),


        # 🌍 Afrique
        ("XAF", "Franc CFA (CEMAC)"),
        ("XOF", "Franc CFA (UEMOA)"),
        ("MAD", "Dirham Marocain"),
        ("DZD", "Dinar Algérien"),
        ("TND", "Dinar Tunisien"),
    )

    LANGUAGE_CHOICES = (
        ("FR", "Français"),
        ("EN", "English"),
    )

    name = models.CharField(max_length=255, unique=True)
    sector = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField()
    logo = models.ImageField(upload_to="agency_logos/", null=True, blank=True)

    # ✅ NOUVEAU
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="XAF",
    )

    language = models.CharField(
        max_length=2,
        choices=LANGUAGE_CHOICES,
        default="FR",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
