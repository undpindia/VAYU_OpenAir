from django.db import models

from PIL import Image
from io import BytesIO

from django.core.files.base import ContentFile

from user.models import User
from sensor.models import Data


class TaskStatus(models.IntegerChoices):
    """Choice values for the role field"""
    NEW = (1, "New")
    COMPLETE = (2, "Complete")
    
class State(models.Model):
    state_name = models.CharField(max_length=200)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.state_name)

    class Meta:
        db_table = "state"
        verbose_name_plural = "States"
        
class District(models.Model):
    state_id = models.ForeignKey(State, on_delete=models.CASCADE)
    district_name = models.CharField(max_length=200)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.district_name)

    class Meta:
        db_table = "district"
        verbose_name_plural = "District"
    
class Task(models.Model):
    location = models.CharField("Task name", max_length=200, blank=True)
    description = models.TextField(blank=True)
    # distict = models.CharField(max_length=200, blank=True)
    distict = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    # state = models.CharField(max_length=200, blank=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True)
    lat  = models.FloatField(blank=True)
    long  = models.FloatField(blank=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        choices=TaskStatus.choices,
        default=TaskStatus.NEW,
        blank=False,
        verbose_name="Task Status"
    )
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # if self.farmer_crop_id is None and self.farmer_id is not None and self.crop_id is not None and \
        #         self.rua is not None and self.season is not None:
        district_id = District.objects.filter(id=self.distict.id, state_id=self.state.id)
        
        if district_id:
            self.distict = District.objects.get(id=self.distict.id, state_id=self.state.id)
        else:
            self.distict = None
            
        super().save(*args, **kwargs)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.user_id.full_name)

    class Meta:
        db_table = "task"
        verbose_name_plural = "Tasks"

class Record(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    data_id = models.ForeignKey(Data, on_delete=models.CASCADE, null=True, blank=True)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)
    lat  = models.FloatField(max_length=200, blank=True)
    long  = models.FloatField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.user_id.full_name) + " | " + str(self.data_id.device_id.device_name) if self.data_id else ""

    class Meta:
        db_table = "record"
        verbose_name_plural = "Records"


class FileUpload(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    record_id = models.ForeignKey(Record, on_delete=models.CASCADE, null=True, blank=True)
    # file_name  = models.CharField(max_length=200, blank=True) # no need of file name
    file  = models.FileField(upload_to='file_upload/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Optimize the image before saving
        if self.file:
            # Open the uploaded image
            img = Image.open(self.file)
            img_format = img.format  # Retain the original format (e.g., JPEG, PNG)
            
            # Resize the image if necessary (e.g., max width/height of 800px)
            max_size = (800, 800)
            img.thumbnail(max_size, Image.ANTIALIAS)
            
            # Save the image to an in-memory file
            img_io = BytesIO()
            img.save(img_io, format=img_format, optimize=True, quality=85)
            
            # Replace the uploaded image with the optimized one
            self.file = ContentFile(img_io.getvalue(), self.file.name)

        super().save(*args, **kwargs)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.user_id.full_name) + " | " + str(self.record_id)

    class Meta:
        db_table = "file_upload"
        verbose_name_plural = "File Uploads"


class Notification(models.Model):
    user_id = models.ManyToManyField(User, blank=True)
    message  = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return str(self.id) + " | " + str(self.user_id)

    class Meta:
        db_table = "notification"
        verbose_name_plural = "Notifications"
