import logging

from django.contrib import admin
from django.contrib.auth import get_user_model
from django_admin_listfilter_dropdown.filters import (
    RelatedDropdownFilter
)
from rangefilter.filters import (
    DateRangeFilterBuilder
)
from import_export.admin import ImportExportModelAdmin

from .models import Device, Data, DownloadData, DownloadMonthYear

from utils.csv_export import export_as_csv


logging.basicConfig(format='%(asctime)s %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s',
                    datefmt='%d-%m-%Y:%H:%M:%S',
                    level=logging.INFO,
                    filename='admin_data.log')


User = get_user_model()

class DeviceAdmin(admin.ModelAdmin):
    search_fields = ('device_name__icontains', 'id')
    list_display = ["id", "device_name", "status", "get_data_last_time", "get_user", "device_type"]
    list_filter = ("status",)
    
    def has_add_permission(self, request, obj=None):
        if request.user.role == 1:
            return True
        else:
            return False
        
    def get_data_last_time(self, obj):
        device_data = Data.objects.filter(device_id__device_name=obj.device_name).latest('id')
        if device_data:
            data_time = device_data.data_created_time.strftime("%d %b %Y %H:%M:%S")
        else:
            data_time = None
        return data_time
    
    def get_user(self, obj):
        try:
            user_data = User.objects.filter(device_id__device_name=obj.device_name).values_list('full_name', flat=True)
            name = list(user_data)
        except User.DoesNotExist:
            name = None
        return name
    
    get_data_last_time.short_description = 'Data Last Fetch Time'
    get_user.short_description = 'User'
    
class DataAdmin(ImportExportModelAdmin):
    search_fields = ('device_id__device_name__icontains', 'id')
    list_display = ["id", "get_device", "lat", "long", "time_seconds", "get_user", "get_user_district", 'pm_25',"pm_10", "no2", "co", "co2", "ch4", "get_temp", "get_rh"]
    list_filter = ("data_created_time",
                   ("data_created_time", DateRangeFilterBuilder()), 
                   ('device_id', RelatedDropdownFilter)
                   )
    readonly_fields=("lat", "long", "pm_25","pm_10", "no2", "co", "co2", "ch4", "temp", "rh", "time_seconds")
    exclude = ["data_created_time"]
    actions = [export_as_csv]
    
    def has_add_permission(self, request, obj=None):
        if request.user.role == 1:
            return True
        else:
            return False
    
    def get_user(self, obj):
        try:
            user_data = User.objects.filter(device_id=obj.device_id).values_list('full_name', flat=True)
            name = list(user_data)
        except User.DoesNotExist:
            name = None
        return name
    def get_user_district(self, obj):
        try:
            user_data = User.objects.filter(device_id=obj.device_id).values_list('district__district_name', flat=True)
            district = list(user_data)
        except User.DoesNotExist:
            district = None
        return district
    def get_user_state(self, obj):
        try:
            user_data = User.objects.filter(device_id=obj.device_id).values_list('state__state_name', flat=True)
            state = list(user_data)
        except User.DoesNotExist:
            state = None
        return state
    def get_device(self, obj):
        try:
            device_data = Data.objects.get(id=obj.id)
            name = device_data.device_id.device_name
        except Data.DoesNotExist:
            name = None
        return name
    
    def time_seconds(self, obj):
        return obj.data_created_time.strftime("%d %b %Y %H:%M:%S")
    
    def get_temp(self, obj):
        return obj.temp
    
    def get_rh(self, obj):
        return obj.rh
    
    get_device.short_description = 'Device'
    get_user.short_description = 'User'
    get_user_district.short_description = 'User District'
    get_user_state.short_description = 'User State'
    time_seconds.short_description = 'Data Created Time'
    get_temp.short_description = 'Temp'
    get_rh.short_description = 'RH'


class DownloadDataAdmin(admin.ModelAdmin):
    search_fields = ('id', 'user_name', 'user_email')
    list_display = ["id", "user_name", "user_email", "city", "usage_type"]
    
class DownloadMonthYearAdmin(admin.ModelAdmin):
    search_fields = ('id', 'month', 'year')
    list_display = ["id", "month", "year"]

admin.site.register(Device, DeviceAdmin)
admin.site.register(Data, DataAdmin)
admin.site.register(DownloadData, DownloadDataAdmin)
admin.site.register(DownloadMonthYear, DownloadMonthYearAdmin)
