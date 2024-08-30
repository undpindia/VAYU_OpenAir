import { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addRecord } from '../../../api/ApiService';
import toast from 'react-hot-toast';
import axios from 'axios';

const DataSyncOnline = ({ setIsSyncPopupOpen, setOfflineFormDataArray }) => {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsSyncPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsSyncPopupOpen]);

  const retrieveLocationName = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${+lat}&lon=${+long}`
      );
      if (response.data && response.data.address) {
        const { village, suburb, town, city, county, state } =
          response.data.address;
        const firstComponent =
          village || suburb || town || city || county || state || '';
        return firstComponent.trim();
      }
    } catch (error) {
      console.error('Error retrieving location name:', error.message);
    }
  };

  const processQueue = async (queue) => {
    console.log('queue', queue);

    for (const formData of queue.values()) {
      const newFormData = new FormData();

      // Get the files from the formData
      const files = formData.getAll('file');

      // Append the files to the newFormData
      files.forEach((file) => {
        newFormData.append('file', file);
      });

      // Retrieve and add location name asynchronously
      const locationName = await retrieveLocationName(
        formData.get('lat'),
        formData.get('long')
      );

      // Append record_data as JSON string to newFormData
      newFormData.append(
        'record_data',
        JSON.stringify({
          user_id: formData.get('user_id'),
          data_id: formData.get('data_id'),
          location: locationName,
          lat: formData.get('lat'),
          long: formData.get('long'),
          category: formData.get('category'),
          description: formData.get('description'),
        })
      );

      // console.log('newFormData', newFormData);

      try {
        const response = await addRecord(
          localStorage.getItem('access_token'),
          newFormData
        );

        if (response.status === 201 && response.data.success === true) {
          toast.success(response.data.message);
        } else {
          return toast.error('Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error processing record', error);
        // Handle error if needed
      }
    }

    localStorage.removeItem('formDataArray');
    localStorage.removeItem('recordDataForDisplay');
    setOfflineFormDataArray([]);
    return navigate('/data-success');
  };

  // Function to convert Base64 string to Blob
  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const handleSync = () => {
    // Retrieve the array of serialized FormData entries from localStorage
    const storedSerializedFormDataArray =
      JSON.parse(localStorage.getItem('formDataArray')) || [];

    console.log('storedSerializedFormDataArray', storedSerializedFormDataArray);

    // Create an array to hold the retrieved FormData instances
    let retrievedFormDataArray = [];

    // Loop through each stored serialized FormData entries array and create FormData instances
    storedSerializedFormDataArray.forEach((entriesArray) => {
      // Create a new FormData object for each array of entries
      const retrievedFormData = new FormData();

      // Append each key-value pair to the FormData
      entriesArray.forEach(([key, value]) => {
        // Check if the value is a string and contains ',' character
        if (key === 'file' && typeof value === 'string') {
          if (value.includes(',')) {
            // Split the value by ',' character to get multiple Base64 strings
            const base64Strings = value.split(',');
            // Convert each Base64 string back to a Blob and then to a File object
            base64Strings.forEach((base64String, index) => {
              const blob = b64toBlob(base64String, 'image/png'); // Adjust the MIME type if needed
              const file = new File([blob], `image_${index}.png`); // You can specify a file name here
              retrievedFormData.append(key, file);
            });
          } else {
            const blob = b64toBlob(value, 'image/png'); // Adjust the MIME type if needed
            const file = new File([blob], 'image.png'); // You can specify a file name here
            retrievedFormData.append(key, file);
          }
        } else {
          retrievedFormData.append(key, value);
        }
      });

      // Push the retrieved FormData into the array
      retrievedFormDataArray.push(retrievedFormData);
    });

    // Now retrievedFormDataArray contains all the retrieved FormData instances
    console.log('Retrieved FormData Array:', retrievedFormDataArray);

    if (retrievedFormDataArray.length > 0) {
      processQueue(retrievedFormDataArray);
    }
  };

  return (
    <div className="data-sync-online" ref={popupRef}>
      <h1>Sync Data?</h1>
      <span>
        Your device is online and offline data is detected. Would you like to
        sync the data?
      </span>

      <div className="data-sync-online__btn-wrapper">
        <Button
          className="data-sync-online__btn-wrapper--button"
          style={{
            backgroundColor: '#fff',
            color: '#31572c',
          }}
          onClick={() => setIsSyncPopupOpen(false)}
        >
          No
        </Button>

        <Button
          className="data-sync-online__btn-wrapper--button"
          onClick={handleSync}
        >
          Yes
        </Button>
      </div>

      <div className="data-sync-online__btn-wrapper">
        <Button
          className="data-sync-online__btn-wrapper--button"
          style={{
            backgroundColor: '#fff',
            color: '#31572c',
            border: 'none',
          }}
          onClick={() => {
            setIsSyncPopupOpen(false);
            localStorage.removeItem('formDataArray');
            localStorage.removeItem('recordDataForDisplay');
            navigate('/record-location');
            return;
          }}
        >
          Clear Offline Data / Record New
        </Button>
      </div>
    </div>
  );
};

export default DataSyncOnline;
