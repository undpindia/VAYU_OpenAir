from django.contrib import admin, messages
from django.utils.html import format_html
from .models import Record, FileUpload, Task, Notification, State, District
from .forms import TaskCreationForm, TaskChangeForm
from sensor.models import Data

from import_export.admin import ImportExportModelAdmin


def show_file(file):
    img =  format_html('<img src="{}" style="max-width:200px; max-height:200px"/>'.format(file.file.url))
    return img

class RecordAdmin(ImportExportModelAdmin):
    
    fieldsets = [
        (
            None,
            {
                "fields": ["user_id", "task_id", "location", "lat", "long", "description", "category", "get_device", "data_id", "created_at"],
            },
        ),
        (
            "Files",
            {
                "fields": [("get_file_first", "get_file_last")],
            },
        ),
    ]
    
    search_fields = ('id', 'category__icontains', 'location__icontains', 'user_id__full_name__icontains')
    list_display = ["user_id", "data_id", "category", "location", "lat", "long", "created_at"]
    readonly_fields=("get_file_first","get_file_last", "get_device", "data_id", "created_at")
    
    def get_file_first(self, obj):
        
        file_data = FileUpload.objects.filter(record_id=obj.id).first()
        if file_data:
            if file_data.file:
                file =  show_file(file_data)
                return file
        else:
            file = None
            return file
        
    def get_file_last(self, obj):
        
        file_data = FileUpload.objects.filter(record_id=obj.id).last()
        file_data_len = FileUpload.objects.filter(record_id=obj.id).count()
        if file_data and file_data_len > 1:
            if file_data.file:
                file =  show_file(file_data)
                return file
        else:
            file = None
            return file
        
    def get_device(self, obj):
        try:
            device_data = Data.objects.get(id=obj.data_id.id)
            name = device_data.device_id.device_name
        except Data.DoesNotExist:
            name = None
        return name
    
    # def delete_queryset(self, request, queryset):
    #     msgs = messages.get_messages(request)

    #     # Delete loaded messages
    #     for i in range(len(msgs)):
    #         del msgs[i]
        
    #     # Add a new message
    #     self.message_user(request, "Deleted successfully!!", messages.SUCCESS)

    #     queryset.delete()
    
    def has_add_permission(self, request, obj=None):
        if request.user.role == 1:
            return True
        else:
            return False
    
    get_device.short_description = 'Device'
    get_file_first.short_description = 'File'
    get_file_last.short_description = 'File'
    
class FileUploadAdmin(admin.ModelAdmin):
    def file_tag(self, obj):
        if obj.file:
            return format_html('<img src="{}" style="max-width:200px; max-height:200px"/>'.format(obj.file.url))
        else:
            return None
    
    def get_model_perms(self, request):
        """
        Return empty perms dict thus hiding the model from admin index.
        """
        if request.user.role != 1:
            return {}
        return super(FileUploadAdmin, self).get_model_perms(request)
    
class TaskAdmin(admin.ModelAdmin):
    search_fields = ('id', 'location__icontains')
    list_display = ["id", "location", "user_id", "status",]
    
    class Media:
        js = (
            'state_dropdown_select.js', # In your static folder and write the logic in this file.
            'https://code.jquery.com/jquery-3.3.1.min.js' # Jquery CDN
        )
    
    def has_delete_permission(self, request, obj=None):
        if obj and obj.status == 2:
            return False
        else:
            return True
        
    def get_form(self, request, obj=None, **kwargs):
        if obj:
            kwargs['form'] = TaskChangeForm
        else:
            kwargs['form'] = TaskCreationForm
        return super().get_form(request, obj, **kwargs)
    
    # def get_search_results(self, request, queryset, search_term):
    #     queryset, use_distinct = super().get_search_results(request, queryset, search_term)
    #     try:
    #         search_term_as_int = search_term
    #         queryset |= self.model.objects.filter(location__icontains=search_term_as_int)
    #     except ValueError:
    #         pass
    #     return queryset, use_distinct
    
class NotificationAdmin(admin.ModelAdmin):
    search_fields = ('id',)
    list_display = ["id", "created_at"]
    
class StateAdmin(admin.ModelAdmin):
    search_fields = ('id', 'state_name')
    list_display = ["id", "state_name"]
    
class DistrictAdmin(admin.ModelAdmin):
    search_fields = ('id', 'district_name')
    list_display = ["id", "state_id", "district_name"]

admin.site.register(Record, RecordAdmin)
admin.site.register(FileUpload, FileUploadAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Notification, NotificationAdmin)
# admin.site.register(State, StateAdmin)
# admin.site.register(District, DistrictAdmin)
