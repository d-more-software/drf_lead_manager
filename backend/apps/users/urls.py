from django.urls import path
from .views import MeView, RegisterView

urlpatterns = [
    path("me/", MeView.as_view()),
    path("register/", RegisterView.as_view()),
]
