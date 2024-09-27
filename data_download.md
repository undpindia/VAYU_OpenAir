# Vayu Data Download API

## Overview

The Vayu Data Download API provides access to monthly air quality data collected from various devices across different cities in India. This API is part of the UNDP's initiative to monitor and improve air quality in urban areas.

## API Endpoint

- **Description**: Download Monthly Data
- **URL**: `https://vayuapi.undp.org.in/device/api/v1/sensor-data-download`
- **Method**: POST
- **Output**: CSV

## Headers

- `accept: application/json`
- `Content-Type: application/json`

## Request Body Parameters

| Parameter   | Description                                                          | Example            |
|-------------|----------------------------------------------------------------------|---------------------|
| month       | Data collection month                                                | "june"              |
| year        | Data collection year                                                 | "2024"              |
| city        | City where data was collected                                        | "patna" or "gurugram" |
| device_type | Type of the monitoring device                                        | "static" or "dynamic" |


## Response

### Success Response

```json
{
    "code": 200,
    "success": true,
    "message": "Ok",
    "data": "https://undpin176st003.blob.core.windows.net/data/Downloads/Patna/sensor-data/data-dynamic-sensor/vayu_Patna_dynamic_sensor_data_September_2024.csv"
}
```

### Failure Response

```json
{
  "code": 400,
  "success": false,
  "message": "Bad Request"
}
```

## Usage Example

```python
import requests

# API endpoint
url = "https://vayuapi.undp.org.in/device/api/v1/sensor-data-download"

# Headers
headers = {
    "accept": "application/json",
    "Content-Type": "application/json"
}

# Request payload
payload = {
    "month": "September",
    "year": "2024",
    "city": "Patna",
    "device_type": "dynamic"
}

# Send POST request
response = requests.post(url, headers=headers, json=payload)

# Check the response
if response.status_code == 200:
    data = response.json()
    if data["success"]:
        download_link = data["data"]
        print(f"Data download link: {download_link}")
        
        # Download the CSV file
        csv_response = requests.get(download_link)
        if csv_response.status_code == 200:
            # Save the file with a dynamic name
            file_name = f"vayu_{payload['city']}_{payload['device_type']}_sensor_data_{payload['month']}_{payload['year']}.csv"
            with open(file_name, 'wb') as file:
                file.write(csv_response.content)
            print(f"File downloaded successfully: {file_name}")
        else:
            print(f"Failed to download CSV file from the link. Status code: {csv_response.status_code}")
    else:
        print(f"Failed to download data: {data['message']}")
else:
    print(f"Error: {response.status_code} - {response.text}")

```

## Note

This API is provided by the United Nations Development Programme (UNDP) as part of their efforts to monitor and improve air quality in Indian cities. Please use the data responsibly and in accordance with the purpose you've specified in your request.

For more information about the Vayu project or UNDP's environmental initiatives, please visit [Vayu - Open Air](https://vayu.undp.org.in/).

## Support

If you encounter any issues or have questions about using this API, please contact the UNDP India team at parvathy.krishnan@undp.org
