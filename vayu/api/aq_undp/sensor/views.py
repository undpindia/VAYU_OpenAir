import datetime
import csv
import logging
import os

from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.db.models.functions import TruncMonth, TruncYear, TruncDay
from django.db.models import Count, Max, Min, Avg, Variance, StdDev, Aggregate, FloatField
from django.http import HttpResponse, StreamingHttpResponse, Http404
from django.core.files.storage import default_storage

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Device, Data, DeviceType, DownloadData, DownloadMonthYear
from .serializers import DataSerializer, HistoricalDataSerializer, DownloadMonthYearSerializer

from utils.message_utils import get_message
from utils.upload import insert_data
from utils.pagination import CustomPageNumberPagination

from authentication.authentication import IsCustomerUser, IOTUserAuthentication

import config

User = get_user_model()


logging.basicConfig(format='%(asctime)s %(levelname)-8s [%(filename)s:%(lineno)d] %(message)s',
                    datefmt='%d-%m-%Y:%H:%M:%S',
                    level=logging.INFO,
                    filename='data.log')

class DataViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = DataSerializer
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        device_id = request.data.get('device_id')
        filter_queryset = self.queryset.filter(device_id__device_name=device_id).order_by('-id').first()
        try:
            if filter_queryset:
                serializer = self.serializer_class(filter_queryset)
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": serializer.data
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class GetDeviceViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    
    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        try:
            user_data = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {
                    "code": 200,
                    "success": False,
                    "message": get_message(404)
                },
                status.HTTP_200_OK
            )
        try:
            if user_data.device_id:
                data = {
                    "id": user_data.device_id.id,
                    "device_name": user_data.device_id.device_name,
                    "date_time": user_data.device_id.created_at,
                    "active": user_data.device_id.status
                }
            else:
                data = {}
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "data": data
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class DeviceDataViewset(viewsets.ModelViewSet):

    authentication_classes = (IOTUserAuthentication,)
    
    def create(self, request, *args, **kwargs):
        device_id = request.data.get('device_id')
        data_created_time = request.data.get('data_created_time')
        lat = request.data.get('lat')
        long = request.data.get('long')
        pm_25 = request.data.get('pm_25')
        pm_10 = request.data.get('pm_10')
        no2 = request.data.get('no2')
        co = request.data.get('co')
        co2 = request.data.get('co2')
        ch4 = request.data.get('ch4')
        temp = request.data.get('temp')
        rh = request.data.get('rh')
        try:
            try:
                device_data = Device.objects.get(
                    device_name=device_id
                )
            except Device.DoesNotExist:
                device_data = Device.objects.create(
                    device_name=device_id,
                    status = True
                    )
            Data.objects.create(
                device_id = device_data,
                lat = lat,
                long = long,
                pm_25 = pm_25,
                pm_10 =pm_10,
                no2 = no2,
                co = co,
                co2 = co2,
                data_created_time = data_created_time,
                ch4 = ch4,
                temp = temp,
                rh = rh
            )
            insert_data('iot_data.csv', request.data)
            return Response(
                {
                    "code": 201,
                    "success": True,
                    "message": get_message(201)
                },
                status.HTTP_201_CREATED
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class HistoricalDataViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = HistoricalDataSerializer
    queryset = Data.objects.all()
    pagination_class = CustomPageNumberPagination

    def create(self, request, *args, **kwargs):
        device_id = request.data.get('device_id')
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')
        
        from_date_con = datetime.datetime.strptime(from_date, '%Y-%m-%d %H:%M:%S')
        to_date_con = datetime.datetime.strptime(to_date, '%Y-%m-%d %H:%M:%S')
        
        if (to_date_con - from_date_con).total_seconds() > 86400:
            return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(457)
                    },
                    status.HTTP_200_OK
                )
        
        filter_queryset = self.queryset.filter(
            device_id__device_name=device_id,
            data_created_time__range=[from_date_con, to_date_con]
            ).order_by('-id')
        try:
            if filter_queryset:
                page = self.paginate_queryset(filter_queryset)
                if page is not None:
                    serializer = self.serializer_class(page, many=True)
                    page_data = self.get_paginated_response(serializer.data).data
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": page_data
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )


class DataActviyViewset(viewsets.ModelViewSet):

    permission_classes = ()
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        from_date = request.data.get('from_date')
        to_date = request.data.get('to_date')
        
        if request.data.get('device_type') == "static":
            device_type = [1]
        elif request.data.get('device_type') == "dynamic":
            device_type = [2]
        else:
            device_type = [1, 2]
            
        if request.data.get('city') == 'all':
            city = Device.objects.filter(status=True).values_list('city', flat=True)
        else:
            city = Device.objects.filter(
                city__icontains=request.data.get('city'),
                status=True
                ).values_list('city', flat=True)
            
        if request.data.get('device_id') == 'all':
            device_id = Device.objects.filter(status=True).values_list('device_name', flat=True)
        else:
            device_id = Device.objects.filter(
                device_name__icontains=request.data.get('device_id'),
                status=True
                ).values_list('device_name', flat=True)
        
        # in DB there is wrongly future date added to avoid that use current year
        current_year = datetime.datetime.now().year
        
        if (from_date and to_date) == "all":
            filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                        data_created_time__year__lte=current_year,
                                        device_id__city__in=city,
                                        device_id__device_name__in=device_id,
                                        device_id__device_type__in=device_type)
        else:
            filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                        data_created_time__year__lte=current_year,
                                        device_id__city__in=city,
                                        device_id__device_name__in=device_id,
                                        device_id__device_type__in=device_type,
                                        data_created_time__date__gte=from_date,
                                        data_created_time__date__lte=to_date)
        
        days = filter_qs.annotate(day=TruncDay('data_created_time')).values('day').annotate(total=Count('pk')).order_by('day')
        years = filter_qs.annotate(year=TruncYear('data_created_time')).values_list('year', flat=True).distinct().order_by('year')
        
        try:
            if days:
                data_lst = []
                for j in years:
                    e = {}
                    for month_count in range(1, 13):
                        month_lst = []
                        for i in days:
                            if i['day'].year == j.year and i['day'].month == month_count:
                                d = {
                                    "date" : i['day'].date(),
                                    "count" : i['total']
                                }
                                month_lst.append(d)
                        e[month_count] = month_lst
                    f = {
                        "year": j.year,
                        "data": e
                    }
                    data_lst.append(f)
                
                
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": data_lst
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )


class MapLatLongViewset(viewsets.ModelViewSet):

    permission_classes = ()
    queryset = Data.objects.all()

    def list(self, request, *args, **kwargs):
        
        filter_queryset = self.queryset.all().order_by('-id').values('lat', 'long').distinct()
        try:
            if filter_queryset:
                lat_long_lst = []
                for data in filter_queryset:
                    lat_long_lst.append(data)
                
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": lat_long_lst
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )
            
class Median(Aggregate):
        function = 'PERCENTILE_CONT'
        name = 'median'
        output_field = FloatField()
        template = '%(function)s(0.5) WITHIN GROUP (ORDER BY %(expressions)s)'

class DataTrendViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            from_date = request.data.get('from_date')
            to_date = request.data.get('to_date')
            
            if request.data.get('device_type') == "static":
                device_type = [1]
            elif request.data.get('device_type') == "dynamic":
                device_type = [2]
            else:
                device_type = [1, 2]
                
            if request.data.get('city') == 'all':
                city = Device.objects.filter(status=True).values_list('city', flat=True)
            else:
                city = Device.objects.filter(
                    city__icontains=request.data.get('city'),
                    status=True
                    ).values_list('city', flat=True)
            
            if request.data.get('device_id') == 'all':
                device_id = Device.objects.filter(status=True).values_list('device_name', flat=True)
            else:
                device_id = Device.objects.filter(
                    device_name__icontains=request.data.get('device_id'),
                    status=True
                    ).values_list('device_name', flat=True)
            
            # in DB there is wrongly future date added to avoid that use current year
            current_year = datetime.datetime.now().year
            
            if (from_date and to_date) == "all":
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_name__in=device_id,
                                            device_id__device_type__in=device_type)
            else:
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_name__in=device_id,
                                            device_id__device_type__in=device_type,
                                            data_created_time__date__gte=from_date,
                                            data_created_time__date__lte=to_date)
            
            data = filter_qs.aggregate(
                pm_25_max = Max('pm_25'), 
                pm_25_min = Min('pm_25'), 
                pm_25_avg = Avg('pm_25'),
                pm_25_var = Variance('pm_25'),
                pm_25_stdev = StdDev('pm_25'),
                pm_25_median = Median('pm_25'),
                pm_10_max = Max('pm_10'), 
                pm_10_min = Min('pm_10'), 
                pm_10_avg = Avg('pm_10'),
                pm_10_var = Variance('pm_10'),
                pm_10_stdev = StdDev('pm_10'),
                pm_10_median = Median('pm_10'),
                no2_max = Max('no2'), 
                no2_min = Min('no2'), 
                no2_avg = Avg('no2'),
                no2_var = Variance('no2'),
                no2_stdev = StdDev('no2'),
                no2_median = Median('no2'),
                co_max = Max('co'), 
                co_min = Min('co'), 
                co_avg = Avg('co'),
                co_var = Variance('co'),
                co_stdev = StdDev('co'),
                co_median = Median('co'),
                co2_max = Max('co2'), 
                co2_min = Min('co2'), 
                co2_avg = Avg('co2'),
                co2_var = Variance('co2'),
                co2_stdev = StdDev('co2'),
                co2_median = Median('co2'),
                ch4_max = Max('ch4'), 
                ch4_min = Min('ch4'), 
                ch4_avg = Avg('ch4'),
                ch4_var = Variance('ch4'),
                ch4_stdev = StdDev('ch4'),
                ch4_median = Median('ch4'),
                temp_max = Max('temp'), 
                temp_min = Min('temp'), 
                temp_avg = Avg('temp'),
                temp_var = Variance('temp'),
                temp_stdev = StdDev('temp'),
                temp_median = Median('temp'),
                rh_max = Max('rh'), 
                rh_min = Min('rh'), 
                rh_avg = Avg('rh'),
                rh_var = Variance('rh'),
                rh_stdev = StdDev('rh'),
                rh_median = Median('rh'),
                )
            
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "data": data
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )


class Echo:
    """An object that implements just the write method of the file-like interface."""
    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value

def data_generator(queryset, fields):
    # Yield the header row
    yield fields

    # Yield data rows in chunks
    for obj in queryset:
        yield [
            obj.device_id.device_name if obj.device_id else None, 
            obj.data_created_time, 
            obj.lat,
            obj.long,
            obj.pm_25,
            obj.pm_10,
            obj.no2,
            obj.co,
            obj.co2,
            obj.ch4,
            obj.temp,
            obj.rh
        ]

class DownloadViewset(viewsets.ModelViewSet):

    permission_classes = ()
    queryset = Data.objects.all()

    def list(self, request, *args, **kwargs):
        
        filter_queryset = self.queryset.all().order_by('-id')
        try:
            if filter_queryset:
                fields = ['device_id', 'data_created_time', 'lat', 'long', 'pm_25', 'pm_10', 'no2', 'co', 'co2', 'ch4', 'temp', 'rh']

                # Create the streaming response
                response = StreamingHttpResponse(
                    (csv.writer(Echo()).writerow(row) for row in data_generator(filter_queryset, fields)),
                    content_type="text/csv"
                )
                response['Content-Disposition'] = 'attachment; filename="data.csv"'

                return response
                
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )
            

class DataTrendGraphViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            from_date = request.data.get('from_date')
            to_date = request.data.get('to_date')
            
            if request.data.get('device_type') == "static":
                device_type = [1]
            elif request.data.get('device_type') == "dynamic":
                device_type = [2]
            else:
                device_type = [1, 2]
                
            if request.data.get('city') == 'all':
                city = Device.objects.filter(status=True).values_list('city', flat=True)
            else:
                city = Device.objects.filter(
                    city__icontains=request.data.get('city'),
                    status=True
                    ).values_list('city', flat=True)
                
            if request.data.get('device_id') == 'all':
                device_id = Device.objects.filter(status=True).values_list('device_name', flat=True)
            else:
                device_id = Device.objects.filter(
                    device_name__icontains=request.data.get('device_id'),
                    status=True
                    ).values_list('device_name', flat=True)
            
            # in DB there is wrongly future date added to avoid that use current year
            current_year = datetime.datetime.now().year
            
            if (from_date and to_date) == "all":
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_name__in=device_id,
                                            device_id__device_type__in=device_type)
            else:
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_name__in=device_id,
                                            device_id__device_type__in=device_type,
                                            data_created_time__date__gte=from_date,
                                            data_created_time__date__lte=to_date)
            
            days = filter_qs.annotate(
                day=TruncDay('data_created_time')).values('day').annotate(
                    pm_25_avg=Avg('pm_25'),
                    pm_10_avg=Avg('pm_10'),
                    no2_avg=Avg('no2'),
                    co_avg=Avg('co'),
                    co2_avg=Avg('co2'),
                    ch4_avg=Avg('ch4'),
                    temp_avg=Avg('temp'),
                    rh_avg=Avg('rh'),
                    ).order_by('day')
            
            if days:
                month_lst = []
                for i in days:
                    d = {
                        "date" : i['day'].date(),
                        "pm_25_avg" : i['pm_25_avg'],
                        "pm_10_avg" : i['pm_10_avg'],
                        "no2_avg" : i['no2_avg'],
                        "co_avg" : i['co_avg'],
                        "co2_avg" : i['co2_avg'],
                        "ch4_avg" : i['ch4_avg'],
                        "temp_avg" : i['temp_avg'],
                        "rh_avg" : i['rh_avg'],
                    }
                    month_lst.append(d)
                
                
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": month_lst
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )            

class GetStaticSensorViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Device.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            if request.data.get('city') == 'all':
                filter_qs = Device.objects.filter(
                    status=True,
                    device_type=DeviceType.STATIC
                )
            else:
                filter_qs = Device.objects.filter(
                    city__icontains=request.data.get('city'),
                    device_type=DeviceType.STATIC
                )
            
            
            if filter_qs:
                static_station_lst = []
                for i in filter_qs:
                    d = {
                        "lat" : i.lat,
                        "long" : i.long,
                        "device_id" : i.device_name
                    }
                    static_station_lst.append(d)
                
                
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": static_station_lst
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(404)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )  
            
class DataDownloadBlobViewset(viewsets.ModelViewSet):
    permission_classes = ()

    def create(self, request, *args, **kwargs):
        try:
            from_month = request.data.get('month')
            device_type = request.data.get('device_type')
            city = request.data.get('city')
            year = request.data.get('year')
            name = request.data.get('name')
            email = request.data.get('email')
            usage_type = request.data.get('usage_type')
            purpose = request.data.get('purpose')
            
            url = config.DOWNLOAD_BLOB_URL + str(city).capitalize() + "/sensor-data/data-" + device_type + "-sensor/vayu_"+str(city).capitalize()+ "_" + device_type +"_sensor_data_"+ from_month +"_"+ year +".csv"
            
            DownloadData.objects.create(
                month = from_month,
                year = year,
                city = city,
                device_type = device_type,
                user_name = name,
                user_email = email,
                usage_type = usage_type,
                purpose = purpose
            )
            
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "data": url
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )          

class DeviceDynamicPathViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        # try:
            from_date = request.data.get('from_date')
            to_date = request.data.get('to_date')
            
            if request.data.get('city') == 'all':
                city = Device.objects.filter(status=True).values_list('city', flat=True)
            else:
                city = Device.objects.filter(
                    city__icontains=request.data.get('city'),
                    status=True
                    ).values_list('city', flat=True)
                
            device_ids = Device.objects.filter(status=True).values_list('device_name', flat=True).distinct()
            print(device_ids)
            
            # in DB there is wrongly future date added to avoid that use current year
            current_year = datetime.datetime.now().year
            
            dynamic_path_lst = []
            final_feature_lst = []
            feature_lst = []
            for device_id in device_ids:
                device_data_lst = []
                if (from_date and to_date) == "all":
                    dates = self.queryset.filter(
                        data_created_time__year__gte=2023,
                        data_created_time__year__lte=current_year,
                        ).values_list('data_created_time__date', flat=True).distinct().order_by('data_created_time')
                    date_lst = list(set(dates))
                    
                    feature = {
                                "type": "Feature",
                                "properties": {
                                    "device_id": device_id,
                                },
                                "geometry": {
                                    "type": "MultiLineString",
                                    "coordinates": [
                                    float(feature['long']) if feature['lat']!='NA' else None,
                                    float(feature['lat']) if feature['long']!='NA' else None
                                    ]
                                }
                            }
                    
                    for date in date_lst:
                        filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                                    data_created_time__year__lte=current_year,
                                                    data_created_time__date=date,
                                                    device_id__city__in=city,
                                                    device_id__device_name=device_id,
                                                    device_id__device_type=2).values_list(
                                                        'lat',
                                                        'long'
                                                    ).order_by('data_created_time')
                        print(filter_qs)
                        if filter_qs:
                            co_o = []
                            for i in filter_qs:
                                if i:
                                    co_o.append([float(j) for j in i if j and j != 'NA'])
                            if co_o:
                                feature = {
                                    "type": "Feature",
                                    "properties": {
                                        "device_id": device_id,
                                        "data_created_time": str(date) + "T00:00:00Z",
                                    },
                                    "geometry": {
                                        "type": "MultiLineString",
                                        "coordinates": [co_o]
                                    }
                                }
                                # feature_lst.append(feature)
                                geo_json_format = {
                                    "type": "FeatureCollection",
                                    "name": "heatmap",
                                    "crs": {
                                        "type": "name",
                                        "properties": {
                                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                                        }
                                    },
                                    "features": feature
                                }
                                
                                feature_lst.append(geo_json_format)
                    if feature_lst:            
                        final_feature_lst.append(feature_lst)
                else:
                    # dates = self.queryset.filter(
                    #     data_created_time__year__gte=2023,
                    #     data_created_time__year__lte=current_year,
                    #     data_created_time__date__gte=from_date,
                    #     data_created_time__date__lte=to_date
                    #     ).values_list('data_created_time', flat=True).distinct().order_by('data_created_time')
                    # # date_lst = list(dates)
                    
                    
                    co_final = []
                    # for date in dates:
                    filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            # data_created_time=date,
                                            device_id__city__in=city,
                                            device_id__device_name=device_id,
                                            device_id__device_type=2,
                                            data_created_time__date__gte=from_date,
                                            data_created_time__date__lte=to_date).order_by('data_created_time')
                    if filter_qs:
                        check_date = datetime.datetime(2024,1,1)
                        co_o = []
                        for i in filter_qs:
                            if i and i.lat != 'NA' and i.long != 'NA':
                                if ((i.data_created_time.replace(tzinfo=None)- check_date).seconds / 60) < 10:
                                    co_o.append([float(i.long), float(i.lat)])
                                    check_date = i.data_created_time.replace(tzinfo=None)
                                    
                                else:
                                    if co_o:
                                        co_final.append(co_o)
                                        co_o = []
                                        co_o.append([float(i.long), float(i.lat)])
                                        # co_final.append(co_o)
                                        check_date = i.data_created_time.replace(tzinfo=None)
                                    else:
                                        co_o.append([float(i.long), float(i.lat)])
                                        check_date = i.data_created_time.replace(tzinfo=None)
                            
                        if co_o:
                            co_final.append(co_o)
                        for j in co_final:    
                            feature = {
                                    "type": "Feature",
                                    "properties": {
                                        "device_id": device_id,
                                        "data_created_time": str(i.data_created_time.date()) + "T00:00:00Z",
                                    },
                                    "geometry": {
                                        "type": "MultiLineString",
                                        "coordinates": [j]
                                    }
                                }
                            if feature:            
                                feature_lst.append(feature)
            geo_json_format = {
                "type": "FeatureCollection",
                "name": "heatmap",
                "crs": {
                    "type": "name",
                    "properties": {
                    "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                },
                "features": feature_lst
            }
                    
            if geo_json_format:            
                final_feature_lst.append(geo_json_format)
                
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "geojson": final_feature_lst,
                    # "data": dynamic_path_lst
                },
                status.HTTP_200_OK
            )

        # except Exception:
        #     return Response(
        #         {
        #             "code": 400,
        #             "success": False,
        #             "message": get_message(400)
        #         },
        #         status.HTTP_400_BAD_REQUEST
        #     )

class DataDeviceCountViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Data.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            from_date = request.data.get('from_date')
            to_date = request.data.get('to_date')
            
            if request.data.get('device_type') == "static":
                device_type = [1]
            elif request.data.get('device_type') == "dynamic":
                device_type = [2]
            else:
                device_type = [1, 2]
                
            if request.data.get('city') == 'all':
                city = Device.objects.filter(status=True).values_list('city', flat=True)
            else:
                city = Device.objects.filter(
                    city__icontains=request.data.get('city'),
                    status=True
                    ).values_list('city', flat=True)
            
            # in DB there is wrongly future date added to avoid that use current year
            current_year = datetime.datetime.now().year
            
            if (from_date and to_date) == "all":
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_type__in=device_type)
            else:
                filter_qs = self.queryset.filter(data_created_time__year__gte=2023,
                                            data_created_time__year__lte=current_year,
                                            device_id__city__in=city,
                                            device_id__device_type__in=device_type,
                                            data_created_time__date__gte=from_date,
                                            data_created_time__date__lte=to_date)
            
            device_count = filter_qs.values_list('device_id', flat=True).distinct().count()
            data_count = filter_qs.count()
                
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "device_count": device_count,
                    "data_count": data_count
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )            

class DownloadMonthYearViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = DownloadMonthYear.objects.all()
    serializer_class = DownloadMonthYearSerializer

    def list(self, request, *args, **kwargs):
        try:
            qs = self.queryset.all()
            month_year_lst = self.serializer_class(qs, many=True)
            
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "device_count": month_year_lst.data
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )         


def download_file(request, file_path):
    if not default_storage.exists(file_path):
        raise Http404("File not found.")

    file_name = os.path.basename(file_path)
    response = HttpResponse(default_storage.open(file_path).read(), content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={file_name}'
    
    return response

class DataDownloadUndpBlobViewset(viewsets.ModelViewSet):
    permission_classes = ()

    def create(self, request, *args, **kwargs):
        try:
            from_month = request.data.get('month')
            device_type = request.data.get('device_type')
            city = request.data.get('city')
            year = request.data.get('year')
            
            url = config.DOWNLOAD_BLOB_URL + str(city).capitalize() + "/sensor-data/data-" + device_type + "-sensor/vayu_"+str(city).capitalize()+ "_" + device_type +"_sensor_data_"+ from_month +"_"+ year +".csv"
            
            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(200),
                    "data": url
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )
