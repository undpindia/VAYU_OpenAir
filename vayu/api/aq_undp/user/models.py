import datetime

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MaxValueValidator, RegexValidator

from sensor.models import Device


class UserRoles(models.IntegerChoices):
    """Choice values for the role field"""
    SUPERADMIN = (1, "Super Admin")
    ADMIN = (2, "Admin")
    VOLUNTEER = (3, "Volunteer")
    
class UserGenders(models.IntegerChoices):
    """Choice values for the role field"""
    Male = (1, "Male")
    FEMALE = (2, "Female")
    OTHER = (3, "Other")

class User(AbstractUser):
    """Default user for Dossier Request Form."""
    #: First and last name do not cover name patterns around the globe
    full_name = models.CharField("Name of user", blank=True, max_length=255)
    role = models.PositiveSmallIntegerField(
        choices=UserRoles.choices,
        default=UserRoles.SUPERADMIN,
        blank=False,
        verbose_name="User role"
    )
    gender = models.PositiveSmallIntegerField(
        choices=UserGenders.choices,
        null=True,
        blank=True,
        verbose_name="Gender"
    )
    device_id  = models.ForeignKey(Device, on_delete=models.CASCADE, null=True, blank=True)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{10}$',
                                 message="Please enter 10 digits phone number")
    mobile = models.CharField(validators=[phone_regex], max_length=15, null=True, blank=True)
    status = models.BooleanField(null=True, blank=True, verbose_name="Approve")
    dob = models.DateField(null=True, blank=True, verbose_name="Date of birth", validators=[MaxValueValidator(datetime.date.today)])
    address = models.TextField(null=True, blank=True)
    # district = models.CharField(max_length=200, null=True, blank=True)
    # state = models.CharField(max_length=200, null=True, blank=True)
    district = models.ForeignKey('mobile_app.District', on_delete=models.SET_NULL, null=True, blank=True)
    state = models.ForeignKey('mobile_app.State', on_delete=models.SET_NULL, null=True, blank=True)
    is_staff = models.BooleanField(
        _('Portal Access'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.CharField(max_length=200, null=True, blank=True)
    
    def __str__(self):
        return self.full_name if self.full_name else self.email

    class Meta:
        db_table = "user"
  