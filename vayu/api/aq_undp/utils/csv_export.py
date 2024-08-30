import csv
from django.http import StreamingHttpResponse

class Echo:
    """An object that implements just the write method of the file-like interface."""
    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value

def export_as_csv(modeladmin, request, queryset):
    """
    Export selected objects as CSV file using streaming.
    """
    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    def iter_items(queryset, field_names):
        pseudo_buffer = Echo()
        writer = csv.writer(pseudo_buffer)
        yield writer.writerow(field_names)
        for obj in queryset.iterator():
            yield writer.writerow([getattr(obj, field) for field in field_names])

    response = StreamingHttpResponse(iter_items(queryset, field_names), content_type="text/csv")
    response['Content-Disposition'] = 'attachment; filename=data.csv'
    return response
