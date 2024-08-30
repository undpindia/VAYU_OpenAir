from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (CreateRecordViewset, TaskViewset, MarkTaskViewset, GetCapturedDataViewset, 
                    NotificationListViewset, GetActivityViewset, RecordMapViewset,
                    RecordRetieveMapViewset)


router = DefaultRouter(trailing_slash=False)

router.register(r"v1/add-record", CreateRecordViewset, basename="add-record")
router.register(r"v1/get-assigned-records", TaskViewset, basename="get-assigned-records")
router.register(r"v1/mark-task-complete", MarkTaskViewset, basename="mark-task-complete")
router.register(r"v1/get-captured-data", GetCapturedDataViewset, basename="get-captured-data")
router.register(r"v1/get-notifications", NotificationListViewset, basename="get-notifications")
router.register(r"v1/get-activity", GetActivityViewset, basename="get-activity")
router.register(r"v1/record-map", RecordMapViewset, basename="record-map")
router.register(r"v1/record-retrive-map", RecordRetieveMapViewset, basename="record-retrive-map")

urlpatterns = [
    path("api/", include(router.urls)),
]