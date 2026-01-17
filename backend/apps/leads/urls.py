from django.urls import path
from .views import LeadViewSet

lead_list = LeadViewSet.as_view({
    "get": "list",
    "post": "create"
})

lead_detail = LeadViewSet.as_view({
    "get": "retrieve",
    "put": "update",
    "patch": "partial_update",
    "delete": "destroy"
})

urlpatterns = [
    path(
        "orgs/<slug:org_slug>/leads/",
        lead_list,
        name="lead-list"
    ),
    path(
        "orgs/<slug:org_slug>/leads/<int:pk>/",
        lead_detail,
        name="lead-detail"
    ),
]
