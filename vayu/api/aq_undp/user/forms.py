from typing import Any
from django.contrib.auth import forms as admin_forms
from django.contrib.auth import get_user_model
from django import forms
from .models import UserRoles

User = get_user_model()


class UserChangeForm(admin_forms.UserChangeForm):
    class Meta(admin_forms.UserChangeForm.Meta):
        model = User
        fields = ("full_name", "email", "mobile", "password", "is_active")
        
    def save(self, commit=True):
        user = super().save(commit=False)
        user.save()
        
        if "role" in self.data and self.data["role"]:
            role = int(self.data["role"])
            if role in (UserRoles.SUPERADMIN , UserRoles.ADMIN):
                user.is_superuser = True
                user.is_active = True
                user.is_staff = True
            elif role == UserRoles.VOLUNTEER:
                user.is_superuser = False
                user.is_active = True
                user.is_staff = False
        
        return user


class UserCreationForm(admin_forms.UserCreationForm):
    class Meta(admin_forms.UserCreationForm.Meta):
        model = User
        fields = ("full_name", "email", "role", "mobile")

        error_messages = {
            "username": {"unique": "This username has already been taken."},
            "email": {"unique": "This email has already been taken."},
            "mobile": {"unique": "This mobile has already been taken."}
        }

    def save(self, commit=True):
        user = super().save(commit=False)

        # Set a username as email or mobile number to avoid integrity error
        user.username = user.email if user.email else self.data["mobile"]
        name_list = user.full_name.split()
        user.first_name = ' '.join(name_list[0:len(name_list) - 1]) if len(name_list) > 1 else user.full_name
        user.last_name = name_list[-1] if len(name_list) > 1 else ""
        user.save()

        if "role" in self.data and self.data["role"]:
            role = int(self.data["role"])
            if role in (UserRoles.SUPERADMIN , UserRoles.ADMIN):
                user.is_superuser = True
                user.is_active = True
                user.is_staff = True
            # elif role == UserRoles.ADMIN:
            #     user.is_superuser = True
            #     user.is_active = True
            #     user.is_staff = True

        return user

class AdminUserCreationForm(admin_forms.UserCreationForm):
    ROLE_CHOICES = (
        # ("Super Admin", "Super Admin"),
        (2, "Admin"),
        (3, "Volunteer")
        )
    role = forms.ChoiceField(choices=ROLE_CHOICES, label="User role")
    class Meta(admin_forms.UserCreationForm.Meta):
        model = User
        fields = ("full_name", "email", "role", "mobile")

        error_messages = {
            "username": {"unique": "This username has already been taken."},
            "email": {"unique": "This email has already been taken."},
            "mobile": {"unique": "This mobile has already been taken."}
        }

    def save(self, commit=True):
        user = super().save(commit=False)

        # Set a username as email or mobile number to avoid integrity error
        user.username = user.email if user.email else self.data["mobile"]
        name_list = user.full_name.split()
        user.first_name = ' '.join(name_list[0:len(name_list) - 1]) if len(name_list) > 1 else user.full_name
        user.last_name = name_list[-1] if len(name_list) > 1 else ""
        user.save()

        if "role" in self.data and self.data["role"]:
            role = int(self.data["role"])
            if role in (UserRoles.SUPERADMIN , UserRoles.ADMIN):
                user.is_superuser = True
                user.is_active = True
                user.is_staff = True
            # elif role == UserRoles.ADMIN:
            #     user.is_superuser = True
            #     user.is_active = True
            #     user.is_staff = True

        return user
