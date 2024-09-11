import datetime

from rest_framework import serializers, exceptions

from .models import Data, DownloadMonthYear

from utils.message_utils import get_message



class DataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Data
        exclude = ['created_at', 'updated_at']

class IOTDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Data
        fields = '__all__'

class HistoricalDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = Data
        exclude = ['device_id', 'created_at', 'updated_at']

class DownloadMonthYearSerializer(serializers.ModelSerializer):

    class Meta:
        model = DownloadMonthYear
        exclude = ['created_at', 'updated_at']
