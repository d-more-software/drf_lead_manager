from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, MeView, UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
]

urlpatterns += router.urls
