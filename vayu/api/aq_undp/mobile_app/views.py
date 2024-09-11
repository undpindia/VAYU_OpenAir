import json
import datetime

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Record, FileUpload, Task, Notification, State, District
from sensor.models import Data
from .serializers import RecordListSerializer, TaskListSerializer, RecordRetrieveSerializer, NotificationListSerializer, GetActivitySerializer

from sensor.models import Device

from utils.message_utils import get_message
from utils.pagination import CustomPageNumberPagination

from authentication.authentication import IsCustomerUser

User = get_user_model()


class CreateRecordViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)

    def create(self, request, *args, **kwargs):
        record_data = json.loads(request.data.get("record_data"))
        file = request.FILES.getlist("file")
        
        user_id = record_data['user_id']
        data_id = record_data['data_id']
        category = record_data['category']
        lat = record_data['lat']
        long = record_data['long']
        description = record_data['description']
        location = record_data['location']
        task_id = record_data['task_id']
        # file_name = record_data['file_name']
        
        try:
            user_query = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {
                    "code": 200,
                    "success": False,
                    "message": get_message(204),
                },
                status.HTTP_200_OK
            )
            
        try:
            data_query = Data.objects.get(id=data_id)
        except Data.DoesNotExist:
            return Response(
                {
                    "code": 200,
                    "success": False,
                    "message": get_message(204),
                },
                status.HTTP_200_OK
            )
            
        if task_id:
            try:    
                task_query = Task.objects.get(id = task_id)
                
            except Task.DoesNotExist:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(204),
                    },
                    status.HTTP_200_OK
                )
        else:
            task_query = None
        
        try:
            record_id = Record.objects.create(
                user_id = user_query,
                data_id = data_query,
                task_id = task_query,
                lat = lat,
                long = long,
                description = description,
                category = category,
                location = location
            )
            
            for file_data in file:
                FileUpload.objects.create(
                    user_id = user_query,
                    record_id = record_id,
                    # file_name = file_name,
                    file = file_data,
                )
            if task_id:   
                task_query.status = 2
                task_query.save()
            
            return Response(
                {
                    "code": 201,
                    "success": True,
                    "message": get_message(455),
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


class TaskViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = TaskListSerializer
    queryset = Task.objects.all()

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        filter_queryset = self.queryset.filter(user_id__id=user_id)
        try:
            if filter_queryset:
                serializer = self.serializer_class(filter_queryset, many=True)
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

class MarkTaskViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    queryset = Task.objects.all()

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        task_id = request.data.get('task_id')
        status_data = request.data.get('status')
        
        filter_queryset = self.queryset.filter(id=task_id, user_id__id=user_id)
        try:
            if filter_queryset:
                if status_data.lower() == 'complete':
                    filter_queryset.update(
                        status = 2
                    )
                return Response(
                    {
                        "code": 202,
                        "success": True,
                        "message": get_message(456),
                    },
                    status.HTTP_202_ACCEPTED
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

class GetCapturedDataViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = RecordListSerializer
    queryset = Record.objects.all()
    pagination_class = CustomPageNumberPagination

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        
        filter_queryset = self.queryset.filter(user_id__id=user_id)
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
            
    def retrieve(self, request, *args, **kwargs):
        
        pk = kwargs.get('pk')
        
        filter_queryset = self.queryset.get(id=pk)
        try:
            if filter_queryset:
                serializer = RecordRetrieveSerializer(filter_queryset)
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

class NotificationListViewset(viewsets.ModelViewSet):
    permission_classes = (IsCustomerUser,)
    queryset = Notification.objects.all()
    serializer_class = NotificationListSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        
        filter_queryset = self.queryset.filter(user_id__id=user_id)
        try:
            if filter_queryset:
                serializer = self.serializer_class(filter_queryset, many=True)
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

class GetActivityViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = GetActivitySerializer
    queryset = Record.objects.all()

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        filter_queryset = self.queryset.filter(user_id__id=user_id)
        try:
            if filter_queryset:
                serializer = self.serializer_class(filter_queryset, many=True)
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

def get_district(request):
    state_id = request.GET.get('state')
    if state_id:
        districts = District.objects.filter(state_id=state_id).values_list('id', 'district_name')
    else:
        districts = District.objects.none()
    districts = dict(districts)
    return JsonResponse(
        data= districts,
        safe=False
    )
    
def get_state(request):
    district_id = request.GET.get('district')
    if district_id:
        districts = District.objects.filter(id=district_id).values_list('id', 'state_id__state_name')
    else:
        districts = District.objects.none()
    districts = dict(districts)
    return JsonResponse(
        data= districts,
        safe=False
    )


class RecordMapViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Record.objects.all()

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
                city = Device.objects.all().values_list('city', flat=True)
            else:
                city = Device.objects.filter(city__icontains=request.data.get('city')).values_list('city', flat=True)
            # in DB there is wrongly future date added to avoid that use current year
            current_year = datetime.datetime.now().year
            
            if (from_date and to_date) == "all":
                filter_qs = self.queryset.filter(created_at__year__gte=2023,
                                            created_at__year__lte=current_year,
                                            data_id__device_id__city__in=city,
                                            data_id__device_id__device_type__in=device_type)
            else:
                filter_qs = self.queryset.filter(created_at__year__gte=2023,
                                            created_at__year__lte=current_year,
                                            data_id__device_id__city__in=city,
                                            data_id__device_id__device_type__in=device_type,
                                            created_at__date__gte=from_date,
                                            created_at__date__lte=to_date)
            
            
            if filter_qs:
                record_lst = []
                for i in filter_qs:
                    d = {
                        "date" : i.created_at.date(),
                        "id" : i.id,
                        "lat" : i.lat,
                        "long" : i.long
                    }
                    record_lst.append(d)
                
                
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": record_lst
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

class RecordRetieveMapViewset(viewsets.ModelViewSet):
    permission_classes = ()
    queryset = Record.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        
        filter_queryset = self.queryset.get(id=pk)
        try:
            if filter_queryset:
                serializer = RecordRetrieveSerializer(filter_queryset)
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
