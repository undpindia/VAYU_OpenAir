from rest_framework import authentication
from rest_framework import exceptions
from rest_framework import permissions

from user.models import UserRoles

import config
    
class IsCustomerUser(permissions.BasePermission):
    """Custom Permission class that allows access only to SubAdmin users."""

    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == UserRoles.VOLUNTEER:
            return True
        return False
    
class IOTUserAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token_id = request.headers.get("Authorization", "")
        token_key = token_id.replace('Bearer ', '')
        try:
            if str(token_key) == config.DEVICE_TOKEN:
                return True, None
            else:
               raise exceptions({"code": 401, "message": "Unauthorized",
                            "detail": "Authentication credentials were not provided."})
        except Exception as err:
            print(token_id, "-----------", err)
            if not token_id:
                raise exceptions.AuthenticationFailed(
                    detail={"code": 401, "message": "Unauthorized",
                            "detail": "Authentication credentials were not provided."}
                )
            else:
                raise exceptions.AuthenticationFailed(
                    detail={"code": 401, "message": "Unauthorized", "detail": "Expired or Invalid Token"}
                )
