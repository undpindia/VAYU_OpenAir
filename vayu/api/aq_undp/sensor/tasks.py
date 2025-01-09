import os
import logging
import subprocess
import json
import datetime
import csv

from .models import Data, Device, DownloadMonthYear, DataTrend

from azure.storage.blob import BlobServiceClient

from celery import shared_task

import config


from django.core.files.storage import default_storage
from django.conf import settings
from django.urls import reverse
from django.db.models import Count, Max, Min, Avg, Variance, StdDev, Aggregate, FloatField

from utils.email_utils import send_mail


logger = logging.getLogger(__name__)



@shared_task
def insert_heatmap_pmtiles():
    patna_lat_extent = config.PATNA_LAT_EXTENT
    patna_long_extent = config.PATNA_LONG_EXTENT

    gurugram_lat_extent = config.GURUGRAM_LAT_EXTENT
    gurugram_long_extent = config.GURUGRAM_LONG_EXTENT
    
    for dis in ['Patna', 'Gurugram']:
        heatmap_datas = Data.objects.filter(device_id__city=dis, device_id__device_type=2)

        feature_data = []
        for heat_map in heatmap_datas:
            if heat_map.lat and heat_map.long and heat_map.lat != 'NA' and heat_map.long != 'NA':
                if dis == 'Patna' and patna_lat_extent[0] <= float(heat_map.lat) <= patna_lat_extent[-1] and patna_long_extent[0] <= float(heat_map.long) <= patna_long_extent[-1]:
                    feature_data.append(
                        { 
                            "type": "Feature", 
                            "properties": 
                            { 
                                "id": heat_map.id, 
                                "device_id": heat_map.device_id.id if heat_map.device_id else None,
                                "lat": float(heat_map.lat), 
                                "long": float(heat_map.long),
                                "pm_25": heat_map.pm_25, 
                                "pm_10": heat_map.pm_10, 
                                "no2": heat_map.no2, 
                                "co": heat_map.co, 
                                "co2": heat_map.co2, 
                                "ch4": heat_map.ch4, 
                                "temp": heat_map.temp, 
                                "rh": heat_map.rh, 
                                "data_created_time": datetime.datetime.strftime(heat_map.data_created_time, "%Y/%m/%d %H:%M:%S.000"),
                                "created_at": datetime.datetime.strftime(heat_map.created_at, "%Y/%m/%d %H:%M:%S.000"), 
                                "updated_at": datetime.datetime.strftime(heat_map.updated_at, "%Y/%m/%d %H:%M:%S.000")
                                }, 
                                "geometry": 
                                { 
                                    "type": "Point", 
                                    "coordinates": 
                                    [ float(heat_map.long), float(heat_map.lat) ] 
                                } 
                        }
                    )
                if dis == 'Gurugram' and gurugram_lat_extent[0] <= float(heat_map.lat) <= gurugram_lat_extent[-1] and gurugram_long_extent[0] <= float(heat_map.long) <= gurugram_long_extent[-1]:
                    feature_data.append(
                        { 
                            "type": "Feature", 
                            "properties": 
                            { 
                                "id": heat_map.id, 
                                "device_id": heat_map.device_id.id if heat_map.device_id else None,
                                "lat": float(heat_map.lat), 
                                "long": float(heat_map.long),
                                "pm_25": heat_map.pm_25, 
                                "pm_10": heat_map.pm_10, 
                                "no2": heat_map.no2, 
                                "co": heat_map.co, 
                                "co2": heat_map.co2, 
                                "ch4": heat_map.ch4, 
                                "temp": heat_map.temp, 
                                "rh": heat_map.rh, 
                                "data_created_time": datetime.datetime.strftime(heat_map.data_created_time, "%Y/%m/%d %H:%M:%S.000"),
                                "created_at": datetime.datetime.strftime(heat_map.created_at, "%Y/%m/%d %H:%M:%S.000"), 
                                "updated_at": datetime.datetime.strftime(heat_map.updated_at, "%Y/%m/%d %H:%M:%S.000")
                                }, 
                                "geometry": 
                                { 
                                    "type": "Point", 
                                    "coordinates": 
                                    [ float(heat_map.long), float(heat_map.lat) ] 
                                } 
                        }
                    )
        json_data = {
            "type": "FeatureCollection",
            "name": "heatmap",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": feature_data
        }
        heatmap_json = json.dumps(json_data, indent=4)

        pmtiles_file = 'heatmap.pmtiles'
        geojson_file = f"{dis.lower()}_heatmap.json"

        with open(geojson_file, "w") as outfile:
            outfile.write(heatmap_json)

        

        subprocess.run(['tippecanoe', '-zg', '--projection=EPSG:4326', '-o', pmtiles_file, '-l', 'zcta', geojson_file])

        

        # Replace with your actual connection string
        connection_string = config.AZURE_CONNECTION_STRING
        container_name = "data/Layers"
        blob_name = f"{dis.lower()}/heatmap/heatmap.pmtiles"
        local_file_path = pmtiles_file

        # Initialize the BlobServiceClient
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)

        # Get a reference to the container
        container_client = blob_service_client.get_container_client(container_name)

        # Get a reference to the blob (file) you want to upload/replace
        blob_client = container_client.get_blob_client(blob_name)

        # Upload the file, replacing it if it already exists
        with open(local_file_path, "rb") as data:
            blob_client.upload_blob(data, overwrite=True)

        # print(f"File {blob_name} uploaded/replaced successfully.")

        os.remove(pmtiles_file)
        os.remove(geojson_file)


        # self.stdout.write(self.style.SUCCESS('Data successfully written to record pmtiles'))

    return {"success":True,"message":"Heatmap pmtiles file uploaded/replaced successfully."}

@shared_task
def export_data_to_csv(queryset_ids, user_email, file_name):
    queryset = Data.objects.filter(pk__in=queryset_ids)
    path = f'{file_name}.csv'
    with default_storage.open(path, 'w') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'device_id', 'data_created_time', 'lat', 'long', 'pm_25', 'pm_10', 'no2', 'co', 'co2', 'ch4', 'temp', 'rh'])  # CSV header

        for obj in queryset:
            writer.writerow([obj.id, obj.device_id, obj.data_created_time, obj.lat, obj.long, obj.pm_25, obj.pm_10, obj.no2, obj.co, obj.co2, obj.ch4, obj.temp, obj.rh])

    # Get current site domain
    # domain = Site.objects.get_current().domain
    # Construct the download link
    download_url = f"{config.DOMAIN_NAME}{reverse('download_file', args=[path])}"

    # Send an email notification with the download link
    send_mail(
                {
                    'email_from': settings.FROM_EMAIL,
                    'subject': 'Your data export is ready',
                    'email_to': [user_email],
                    'message': f'Your data export is ready. Download it here: {download_url}'
                }
            )

    return path

@shared_task
def insert_data_download_csv():
    current_month = datetime.date.today()

    district_names = Device.objects.all().values_list('city', flat=True).distinct('city')
    try:
        DownloadMonthYear.objects.get(month=current_month.strftime("%B"), year=current_month.year)
    except DownloadMonthYear.DoesNotExist:
        DownloadMonthYear.objects.create(
            month = current_month.strftime("%B"),
            year=current_month.year
        )

    for dis in district_names:
        if dis:
            for device_type in ['static', 'dynamic']:
                # Query the database
                data = Data.objects.filter(
                    data_created_time__month=current_month.month,
                    data_created_time__year=current_month.year,
                    device_id__city=dis,
                    device_id__device_type=1 if device_type=='static' else 2
                    ).order_by('id')
                # Define the CSV file path
                file_name = f'vayu_{dis}_{device_type}_sensor_data_{current_month.strftime("%B")}_{current_month.year}.csv'  # Replace with your desired file path
                with open(file_name, 'a', newline='') as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow(['id', 'device_name', 'lat', 'long', 'pm_25', 'pm_10', 'no2', 'co', 'co2', 'ch4', 'temp', 'rh', 'data_created_time'])  # Add your model's fields

                    for item in data:
                        writer.writerow(
                            [item.id, 
                            item.device_id.device_name, 
                            item.lat,
                            item.long,
                            item.pm_25,
                            item.pm_10,
                            item.no2,
                            item.co,
                            item.co2,
                            item.ch4,
                            item.temp,
                            item.rh,
                            item.data_created_time,
                            ])  # Adjust as needed
                        
                # Replace with your actual connection string
                connection_string = config.AZURE_CONNECTION_STRING
                container_name = "data/Downloads"
                blob_name = f"{dis}/sensor-data/data-{device_type}-sensor/{file_name}"
                local_file_path = file_name
                        
                # Initialize the BlobServiceClient
                blob_service_client = BlobServiceClient.from_connection_string(connection_string)

                # Get a reference to the container
                container_client = blob_service_client.get_container_client(container_name)

                # Get a reference to the blob (file) you want to upload/replace
                blob_client = container_client.get_blob_client(blob_name)

                # Upload the file, replacing it if it already exists
                with open(local_file_path, "rb") as data:
                    blob_client.upload_blob(data, overwrite=True)

                # print(f"File {blob_name} uploaded/replaced successfully.")

                os.remove(file_name)

    return {"success":True,"message":"Monthwise CSV File uploaded/replaced successfully."}

class Median(Aggregate):
        function = 'PERCENTILE_CONT'
        name = 'median'
        output_field = FloatField()
        template = '%(function)s(0.5) WITHIN GROUP (ORDER BY %(expressions)s)'

@shared_task
def insert_data_trend(): 
    cities = Device.objects.filter(status=True).values_list('city', flat=True).distinct('city')
    # previous date data needed
    # this task is running next day
    current_date = datetime.datetime.now().date()
    
    for city in cities:
        if city:
            device_lst = Device.objects.filter(status=True, city=city)
            for device in device_lst:
                filter_qs = Data.objects.filter(data_created_time__date=current_date,
                                            device_id__device_name=device.device_name,
                                            device_id__city=city)
                
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
                
                DataTrend.objects.create(
                    device_id = device,
                    city = city, 
                    sensor_type = 'static' if device.device_type==1 else "dynamic", 
                    pm_25_max = data['pm_25_max'], 
                    pm_25_min = data['pm_25_min'], 
                    pm_25_avg = data['pm_25_avg'],
                    pm_25_var = data['pm_25_var'],
                    pm_25_stdev = data['pm_25_stdev'],
                    pm_25_median = data['pm_25_median'],
                    pm_10_max = data['pm_10_max'], 
                    pm_10_min = data['pm_10_min'], 
                    pm_10_avg = data['pm_10_avg'],
                    pm_10_var = data['pm_10_var'],
                    pm_10_stdev = data['pm_10_stdev'],
                    pm_10_median = data['pm_10_median'],
                    no2_max = data['no2_max'], 
                    no2_min = data['no2_min'], 
                    no2_avg = data['no2_avg'],
                    no2_var = data['no2_var'],
                    no2_stdev = data['no2_stdev'],
                    no2_median = data['no2_median'],
                    co_max = data['co_max'], 
                    co_min = data['co_min'], 
                    co_avg = data['co_avg'],
                    co_var = data['co_var'],
                    co_stdev = data['co_stdev'],
                    co_median = data['co_median'],
                    co2_max = data['co2_max'], 
                    co2_min = data['co2_min'], 
                    co2_avg = data['co2_avg'],
                    co2_var = data['co2_var'],
                    co2_stdev = data['co2_stdev'],
                    co2_median = data['co2_median'],
                    ch4_max = data['ch4_max'], 
                    ch4_min = data['ch4_min'], 
                    ch4_avg = data['ch4_avg'],
                    ch4_var = data['ch4_var'],
                    ch4_stdev = data['ch4_stdev'],
                    ch4_median = data['ch4_median'],
                    temp_max = data['temp_max'], 
                    temp_min = data['temp_min'], 
                    temp_avg = data['temp_avg'],
                    temp_var = data['temp_var'],
                    temp_stdev = data['temp_stdev'],
                    temp_median = data['temp_median'],
                    rh_max = data['rh_max'], 
                    rh_min = data['rh_min'], 
                    rh_avg = data['rh_avg'],
                    rh_var = data['rh_var'],
                    rh_stdev = data['rh_stdev'],
                    rh_median = data['rh_median'],
                    data_created_date = current_date,
                    data_count = filter_qs.count()
                )
        
    return {"success":True,"message":"Data Trend uploaded successfully."}

@shared_task
def insert_daily_data_download_csv():
    current_month = datetime.date.today()- datetime.timedelta(days=1)

    district_names = Device.objects.all().values_list('city', flat=True).distinct('city')

    for dis in district_names:
        if dis:
            for device_type in ['static', 'dynamic']:
                # Query the database
                data = Data.objects.filter(
                    data_created_time__date=current_month,
                    device_id__city=dis,
                    device_id__device_type=1 if device_type=='static' else 2
                    ).order_by('id')
                # Define the CSV file path
                file_name = f'vayu_{dis}_{device_type}_sensor_data_{current_month}.csv'  # Replace with your desired file path
                with open(file_name, 'a', newline='') as csvfile:
                    writer = csv.writer(csvfile)
                    writer.writerow(['id', 'device_name', 'lat', 'long', 'pm_25', 'pm_10', 'no2', 'co', 'co2', 'ch4', 'temp', 'rh', 'data_created_time'])  # Add your model's fields

                    for item in data:
                        writer.writerow(
                            [item.id, 
                            item.device_id.device_name, 
                            item.lat,
                            item.long,
                            item.pm_25,
                            item.pm_10,
                            item.no2,
                            item.co,
                            item.co2,
                            item.ch4,
                            item.temp,
                            item.rh,
                            item.data_created_time,
                            ])  # Adjust as needed

                # Replace with your actual connection string
                connection_string = config.AZURE_CONNECTION_STRING
                container_name = "data/Downloads"
                blob_name = f"{dis}/daily-sensor-data/data-{device_type}-sensor/{file_name}"
                local_file_path = file_name

                # Initialize the BlobServiceClient
                blob_service_client = BlobServiceClient.from_connection_string(connection_string)

                # Get a reference to the container
                container_client = blob_service_client.get_container_client(container_name)

                # Get a reference to the blob (file) you want to upload/replace
                blob_client = container_client.get_blob_client(blob_name)

                # Upload the file, replacing it if it already exists
                with open(local_file_path, "rb") as data:
                    blob_client.upload_blob(data, overwrite=True)

                # print(f"File {blob_name} uploaded/replaced successfully.")

                os.remove(file_name)

    return {"success":True,"message":"Dailywise CSV File uploaded/replaced successfully."}
