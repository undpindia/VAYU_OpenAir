# Vayu Data Download API

## Overview

The Vayu Data Download API provides access to monthly air quality data collected from various devices across different cities in India. This API is part of the UNDP's initiative to monitor and improve air quality in urban areas.

## API Endpoint

- **Description**: Download Monthly Data
- **URL**: `https://vayuapi.undp.org.in/device/api/v1/sensor_data_download`
- **Method**: POST
- **Response Format**: CSV

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
import json

url = "https://vayuapi.undp.org.in/device/api/v1/data-download-blob"

payload = json.dumps({
  "month": "june",
  "year": "2024",
  "city": "patna",
  "device_type": "dynamic",
  "name": "John Doe",
  "email": "john@example.com",
  "usage_type": "non-commercial",
  "purpose": "academic"
})

headers = {
  'accept': 'application/json',
  'Content-Type': 'application/json'
}

response = requests.post(url, headers=headers, data=payload)

print(response.text)
```

## Note

This API is provided by the United Nations Development Programme (UNDP) as part of their efforts to monitor and improve air quality in Indian cities. Please use the data responsibly and in accordance with the purpose you've specified in your request.

For more information about the Vayu project or UNDP's environmental initiatives, please visit [Vayu - Open Air](https://www.in.undp.org/).

## Support

If you encounter any issues or have questions about using this API, please contact the UNDP India team at parvathy.krishnan@undp.org
