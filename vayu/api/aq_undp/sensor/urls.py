from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import (DataViewset, GetDeviceViewset, DeviceDataViewset, HistoricalDataViewset, 
                    DataActviyViewset, MapLatLongViewset, DataTrendViewset, DownloadViewset,
                    DataTrendGraphViewset, GetStaticSensorViewset, DeviceDynamicPathViewset,
                    DataDownloadBlobViewset, DataDeviceCountViewset, DownloadMonthYearViewset,
                    DataDownloadUndpBlobViewset, DataTrendDirectViewset, DataTrendGraphDirectViewset,
                    DataActviyDirectViewset, DataDeviceCountDirectViewset)


router = DefaultRouter(trailing_slash=False)

router.register(r"v1/get-device-data", DataViewset, basename="get-device-data")
router.register(r"v1/get-devices", GetDeviceViewset, basename="get-devices")
router.register(r"v1/insert-data", DeviceDataViewset, basename="insert-data")
router.register(r"v1/historical-data", HistoricalDataViewset, basename="historical-data")
# router.register(r"v1/data-activity", DataActviyViewset, basename="data-activity")
router.register(r"v1/map-lat-long", MapLatLongViewset, basename="map-lat-long")
# router.register(r"v1/data-trend", DataTrendViewset, basename="data-trend")
router.register(r"v1/data-download", DownloadViewset, basename="data-download")
# router.register(r"v1/data-trend-graph", DataTrendGraphViewset, basename="data-trend-graph")
router.register(r"v1/get-static-sensor", GetStaticSensorViewset, basename="get-static-sensor")
router.register(r"v1/data-download-blob", DataDownloadBlobViewset, basename="data-download-blob")
router.register(r"v1/device-dynamic-path", DeviceDynamicPathViewset, basename="device-dynamic-path")
# router.register(r"v1/data-device-count", DataDeviceCountViewset, basename="data-device-count")
router.register(r"v1/download-month-year", DownloadMonthYearViewset, basename="download-month-year")
router.register(r"v1/sensor-data-download", DataDownloadUndpBlobViewset, basename="sensor-data-download")
router.register(r"v1/data-trend", DataTrendDirectViewset, basename="data-trend")
router.register(r"v1/data-trend-graph", DataTrendGraphDirectViewset, basename="data-trend-graph")
router.register(r"v1/data-activity", DataActviyDirectViewset, basename="data-activity")
router.register(r"v1/data-device-count", DataDeviceCountDirectViewset, basename="data-device-count")

urlpatterns = [
    path("api/", include(router.urls)),
]