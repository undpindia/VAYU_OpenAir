from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from .forms import UserChangeForm, UserCreationForm, AdminUserCreationForm

from django_celery_beat.models import (
    IntervalSchedule,
    CrontabSchedule,
    SolarSchedule,
    ClockedSchedule,
    PeriodicTask,
)

from django_celery_results.models import TaskResult

User = get_user_model()


admin.site.unregister(Group)
admin.site.unregister(SolarSchedule)
admin.site.unregister(ClockedSchedule)
admin.site.unregister(PeriodicTask)
admin.site.unregister(IntervalSchedule)
admin.site.unregister(CrontabSchedule)
admin.site.unregister(TaskResult)


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    
    class Media:
        js = (
            'state_dropdown_select_user.js', # In your static folder and write the logic in this file.
            'https://code.jquery.com/jquery-3.3.1.min.js' # Jquery CDN
        )

    form = UserChangeForm
    add_form = UserCreationForm
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            "fields": ("full_name", "email", "mobile", "gender", "role", "status", "password1", "password2")
        }),
    )
    fieldsets = (
        (None, {"fields": ("username",)}),
        (_("Personal info"), {
         "fields": ("full_name", "mobile", "email", "dob", "gender", "address", "district", "state")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "role",
                    "is_active",
                    # "is_staff",
                    "is_superuser",
                    # "groups",
                    # "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined",)}),
        (_("Device"), {"fields": ("device_id",)}),
        (_("Approval"), {"fields": ("status",)}),
    )
    list_display = ["username", "full_name", "role", "device_id", "status", "district", "state"]
    search_fields = ["full_name", "email", "mobile"]
    list_filter = ("is_active", "role", "status", "state")
    # readonly_fields=('last_login',"date_joined")

    def get_readonly_fields(self, request, obj=None):
        if obj:
            if request.user.role == 1:
                return ["last_login","date_joined"] # list of read only fields name
            else:
                return ["last_login","date_joined", "role", "is_superuser"]
        return self.readonly_fields
    
    def get_form(self, request, obj=None, **kwargs):
        defaults = {}
        if obj is None:
            if request.user.role != 1:
                defaults['form'] = AdminUserCreationForm
                defaults.update(kwargs)
            else:
                defaults['form'] = self.add_form
        return super().get_form(request, obj, **defaults)
