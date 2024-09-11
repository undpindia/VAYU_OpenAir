import os
import logging
import subprocess
import json
import datetime
import csv

from .models import Data, Device, DownloadMonthYear

from azure.storage.blob import BlobServiceClient

from celery import shared_task

import config


from django.core.files.storage import default_storage
from django.conf import settings
from django.urls import reverse

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
        connection_string = "DefaultEndpointsProtocol=https;AccountName=undpin176st003;AccountKey=Vkp8VRfCtT5nMpOHD1ZO22psRyVVTowUIWCPWcZGT2kKHXAGn5q1GXBgQ5azJoNcOMHOxys0nNtz+AStCjUCkA==;EndpointSuffix=core.windows.net"
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
                    device_id__device_type=1 if 'Static' else 2
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
                connection_string = "DefaultEndpointsProtocol=https;AccountName=undpin176st003;AccountKey=Vkp8VRfCtT5nMpOHD1ZO22psRyVVTowUIWCPWcZGT2kKHXAGn5q1GXBgQ5azJoNcOMHOxys0nNtz+AStCjUCkA==;EndpointSuffix=core.windows.net"
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
