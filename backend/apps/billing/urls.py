from django.urls import path
from .views import BillingStatsView

urlpatterns = [
    path("stats/", BillingStatsView.as_view(), name="billing-stats"),
]
