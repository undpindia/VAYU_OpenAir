import os
import logging
import subprocess
import json
import datetime

from .models import Record

from azure.storage.blob import BlobServiceClient
from django.core.management.base import BaseCommand

from celery import shared_task

import config


logger = logging.getLogger(__name__)


@shared_task
def insert_record_pmtiles():
    patna_lat_extent = config.PATNA_LAT_EXTENT
    patna_long_extent = config.PATNA_LONG_EXTENT

    gurugram_lat_extent = config.GURUGRAM_LAT_EXTENT
    gurugram_long_extent = config.GURUGRAM_LONG_EXTENT

    for dis in ['Patna', 'Gurugram']:
        if dis == 'Patna':
            record_datas = Record.objects.filter(lat__range=patna_lat_extent,
                                                 long__range=patna_long_extent)
        if dis == 'Gurugram':
            record_datas = Record.objects.filter(lat__range=gurugram_lat_extent,
                                                 long__range=gurugram_long_extent)

        feature_rec = []
        for rec in record_datas:
            feature_rec.append(
                { 
                    "type": "Feature", 
                    "properties": 
                    { 
                        "id": rec.id, 
                        "user_id": rec.user_id.id if rec.user_id else None,
                        "data_id": rec.data_id.id if rec.data_id else None, 
                        "task_id": rec.task_id.id if rec.task_id else None, 
                        "location": rec.location, 
                        "lat": rec.lat, 
                        "long": rec.long, 
                        "description": rec.description, 
                        "category": rec.category, 
                        "created_at": datetime.datetime.strftime(rec.created_at, "%Y/%m/%d %H:%M:%S.000"), 
                        "updated_at": datetime.datetime.strftime(rec.updated_at, "%Y/%m/%d %H:%M:%S.000")
                        }, 
                        "geometry": 
                        { 
                            "type": "Point", 
                            "coordinates": 
                            [ rec.long, rec.lat ] 
                        } 
                }
            )
        json_data = {
            "type": "FeatureCollection",
            "name": "recorddata",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": feature_rec
        }
        record_json = json.dumps(json_data, indent=4)
        
        pmtiles_file = 'recorddata.pmtiles'
        geojson_file = f"{dis.lower()}_recorddata.json"
        
        with open(geojson_file, "w") as outfile:
            outfile.write(record_json)


        subprocess.run(['tippecanoe', '-z10', '--projection=EPSG:4326', '-o', pmtiles_file, '-l', 'zcta', geojson_file])

        

        # Replace with your actual connection string
        connection_string = "DefaultEndpointsProtocol=https;AccountName=undpin176st003;AccountKey=Vkp8VRfCtT5nMpOHD1ZO22psRyVVTowUIWCPWcZGT2kKHXAGn5q1GXBgQ5azJoNcOMHOxys0nNtz+AStCjUCkA==;EndpointSuffix=core.windows.net"
        container_name = "data/Layers"
        blob_name = f"{dis.lower()}/recorddata/recorddata.pmtiles"
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

    return {"success":True,"message":"Record pmtiles file uploaded/replaced successfully."}