import csv

from sensor.serializers import IOTDataSerializer


def insert_data(csv_file_path, data):
    file_exists = False
    try:
        with open(csv_file_path, 'r'):
            file_exists = True
    except FileNotFoundError:
        pass
    fields = ['device_id', 'data_created_time', 'lat', 'long', 'pm_25', 'pm_10', 'no2', 'co', 'co2', 'ch4', 'temp', 'rh']
    with open(csv_file_path, mode='a', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        if not file_exists:
            # Write header row if the file is newly created
            writer.writeheader()
            
        writer.writerow(data)