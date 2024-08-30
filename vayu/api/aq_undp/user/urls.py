from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (ForgotPasswordViewset, ChangePasswordViewset, ResetPasswordViewset, UserProfileViewset,
                    UserSignUpViewset, UserStatusViewset)


router = DefaultRouter(trailing_slash=False)

router.register(r"v1/forgot-password", ForgotPasswordViewset, basename="forgot-password")
router.register(r"v1/reset-password", ResetPasswordViewset, basename="reset-password")
router.register(r"v1/change-password", ChangePasswordViewset, basename="change-password")
router.register(r"v1/profile", UserProfileViewset, basename="profile")
router.register(r"v1/signup", UserSignUpViewset, basename="signup")
router.register(r"v1/approval", UserStatusViewset, basename="approval")

urlpatterns = [
    path("api/", include(router.urls)),
]