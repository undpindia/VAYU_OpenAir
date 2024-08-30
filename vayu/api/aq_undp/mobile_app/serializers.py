import datetime

from rest_framework import serializers, exceptions

from .models import Record, FileUpload, Task, Notification

from utils.message_utils import get_message

import config



class RecordListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        exclude = ['created_at', 'updated_at', 'user_id', 'task_id']
        
    def to_representation(self, instance):
        representation = super(RecordListSerializer, self).to_representation(instance)
        
        representation['date_time'] = instance.created_at
        representation['device_id'] = instance.data_id.device_id.device_name if instance.data_id else None
        return representation
        
class TaskListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        exclude = ['created_at', 'updated_at', 'status', 'user_id', 'state', 'distict']
        
    def to_representation(self, instance):
        representation = super(TaskListSerializer, self).to_representation(instance)
        
        if instance.status == 1:
            status = 'New'
        elif instance.status == 2:
            status = 'Complete'
        
        representation['status'] = status
        representation['state'] = instance.state.state_name
        representation['distict'] = instance.distict.district_name
        return representation

class RecordRetrieveSerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        exclude = ['updated_at']
        
    def to_representation(self, instance):
        representation = super(RecordRetrieveSerializer, self).to_representation(instance)
        
        file_data = FileUpload.objects.filter(record_id=instance.id)
        file_data_lst = []
        
        for file in file_data:
            file_data_lst.append(
                {
                    # "file_name": file.file_name,
                    "file" : config.DOMAIN_NAME + file.file.url
                }
            )
        
        representation['description'] = instance.description
        representation['file_data'] = file_data_lst
        representation['pm_25'] = instance.data_id.pm_25
        representation['pm_10'] = instance.data_id.pm_10
        representation['no2'] = instance.data_id.no2
        representation['co'] = instance.data_id.co
        representation['co2'] = instance.data_id.co2
        representation['ch4'] = instance.data_id.ch4
        representation['temp'] = instance.data_id.temp
        representation['rh'] = instance.data_id.rh
        return representation

class NotificationListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        exclude = ['updated_at', 'user_id']

class GetActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        exclude = ['created_at', 'updated_at', 'category', 'description', 'task_id', 'data_id', 'user_id']
