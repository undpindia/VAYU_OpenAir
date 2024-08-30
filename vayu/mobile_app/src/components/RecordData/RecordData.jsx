import { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Header2 from '../UI/Header/Header_2';
import Dropdown from '../UI/Dropdown/Dropdown';
// import Spinner from '../../assets/img/screen-icons/Spinner-Round-50.svg';
import TickIcon from '../../assets/img/screen-icons/tick-icon.svg';
import { useSelector } from 'react-redux';
import { Button, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Downarrow from '../../assets/img/screen-icons/arrow-down.svg';
import { getDeviceData, addRecord } from '../../api/ApiService';
import pm25 from '../../assets/img/screen-icons/PM2.5.svg';
import pm10 from '../../assets/img/screen-icons/PM10.svg';
import ch4 from '../../assets/img/screen-icons/CH4.svg';
import co from '../../assets/img/screen-icons/CO.svg';
import co2 from '../../assets/img/screen-icons/CO2.svg';
import no2 from '../../assets/img/screen-icons/NO2.svg';
import temp from '../../assets/img/screen-icons/Temperature.svg';
import rh from '../../assets/img/screen-icons/Humidity.svg';
// import { selectUid } from '../../redux/auth/authSlice';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {
  selectOfflineData,
  setofflineData,
} from '../../redux/offlineData/offlineDataSlice';
import { useNavigate } from 'react-router-dom';
import {
  // selectDeviceName,
  selectIsDevAvailable,
} from '../../redux/device/deviceSlice';

const DataParameterCard = ({ parameter }) => {
  return (
    <Card className="param-card" style={{ backgroundColor: parameter.color }}>
      <Card.Body className="param-card__body">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-start">
            <div className="param-card__icon">
              <img src={parameter.icon} alt="icon" />
            </div>
            <div className="param-card__content">
              <span>{parameter.label}</span>
              <h1>{parameter.value}</h1>
            </div>
          </div>
          <div className="param-card__spinner">
            <img src={TickIcon} alt="spinner" width={30} height={30} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const RecordData = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const offlineData = useSelector(selectOfflineData);
  // console.log('offlineData', offlineData);
  // const device_name = useSelector(selectDeviceName);
  const btnDisabled = useSelector(selectIsDevAvailable);

  const { locationName, userLocation } = location.state || {};
  const [category, setCategory] = useState('');
  const [deviceData, setdeviceData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [isDataCollapseOpen, setIsDataCollapseOpen] = useState(false);
  const [parameterCards, setParameterCards] = useState([]);
  const [offlineLocation, setOfflineLocation] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [isButton, setIsButton] = useState(true);
  const [time, setTime] = useState("");

  // const [recordData, setRecordData] = useState(
  //   offlineData.addRecordFormData ? offlineData.addRecordFormData : []
  // );

  const user_id = localStorage.getItem('user_id');
  const dataId = localStorage.getItem('data_id');
  // const [dataId, setDataId] = useState(1);
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  useEffect(() => {
    if (!isOnline) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOfflineLocation([latitude, longitude]);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
        }
      );
      setParameterCards(offlineData?.parameterCards);
    }
  }, [isOnline, offlineData]);

  const fetchDeviceData = useRef(async () => {
    const bodyparam = {
      device_id: localStorage.getItem('device_name'),
    };

    try {
      const response = await getDeviceData(
        localStorage.getItem('access_token'),
        bodyparam
      );

      // console.log('response', response);
      // Check if data is present in the response
      if (response.data.data.length > 0) {
        setIsButton(response.data.success);
        const lastDeviceData =
          response.data.data[0];
        setdeviceData(lastDeviceData);

        const deviceData = lastDeviceData;
        localStorage.setItem("data_id", deviceData.id)
        // Transform device data into parameter cards format
        const parameterCards = [
          {
            icon: pm25,
            label: 'PM 2.5',
            value: deviceData.pm_25 === null ? 'N/A' : deviceData.pm_25,
            color: deviceData.pm_25 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: pm10,
            label: 'PM 10',
            value: deviceData.pm_10 === null ? 'N/A' : deviceData.pm_10,
            color: deviceData.pm_10 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: ch4,
            label: 'CH4',
            value: deviceData.ch4 === null ? 'N/A' : deviceData.ch4,
            color: deviceData.ch4 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: co,
            label: 'CO',
            value: deviceData.co === null ? 'N/A' : deviceData.co,
            color: deviceData.co === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: co2,
            label: 'CO2',
            value: deviceData.co2 === null ? 'N/A' : deviceData.co2,
            color: deviceData.co2 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: no2,
            label: 'NO2',
            value: deviceData.no2 === null ? 'N/A' : deviceData.no2,
            color: deviceData.no2 === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: temp,
            label: 'Temperature',
            value: deviceData.temp === null ? 'N/A' : `${deviceData.temp}°C`,
            color: deviceData.temp === null ? '#ebebe4' : '#FFFFFF',
          },
          {
            icon: rh,
            label: 'Humidity',
            value: deviceData.rh === null ? 'N/A' : deviceData.rh,
            color: deviceData.rh === null ? '#ebebe4' : '#FFFFFF',
          },
        ];
        // #ebebe4
        // Set the parameter cards state
        setParameterCards(parameterCards);

        //datetime formate
        const timestamp = deviceData.data_created_time;
        const adjustedTimestamp = new Date(timestamp);
        adjustedTimestamp.setHours(adjustedTimestamp.getHours() - 5);
        adjustedTimestamp.setMinutes(adjustedTimestamp.getMinutes() - 30);
        // Formatting the date manually
        const day = adjustedTimestamp.getDate();
        const month = adjustedTimestamp.toLocaleString('en-US', { month: 'long' });
        const year = adjustedTimestamp.getFullYear();

        const formattedDate = `${day} ${month} ${year}`;
        setTime(formattedDate)

        if (!offlineData?.deviceData && !offlineData?.parameterCards) {
          console.log('inside if offlinedata');
          dispatch(
            setofflineData({
              ...offlineData,
              deviceData: deviceData,
              parameterCards: parameterCards,
            })
          );
        }
      } else {
        toast.error('No data found');
        setdeviceData([]);
      }
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  });

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result.split(',')[1]; // Get the Base64 data without the data URI prefix
        resolve(base64String);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // const processFilesAsync = async (newRecordData, formDataArray) => {
  //   // Iterate through each file asynchronously
  //   for (const file of selectedFiles) {
  //     // Read the file as Base64 asynchronously
  //     const base64String = await readFileAsBase64(file);

  //     // Create a new FormData instance for each file
  //     let newRecordFormData = new FormData();
  //     Object.keys(newRecordData).forEach((key) => {
  //       // Skip 'files' field as it's handled separately
  //       if (key !== 'files') {
  //         newRecordFormData.append(key, newRecordData[key]);
  //         delete newRecordData['files'];
  //       }
  //     });

  //     // Append the 'file' key with its Base64 value to the FormData
  //     newRecordFormData.append('file', base64String);

  //     // Push the FormData instance to formDataArray
  //     formDataArray.push(Array.from(newRecordFormData.entries()));
  //   }
  // };

  const processFilesAsync = async (newRecordData, formDataArray) => {
    // Create a new FormData instance for all files
    let newRecordFormData = new FormData();
    Object.keys(newRecordData).forEach((key) => {
      // Skip 'files' field as it's handled separately
      if (key !== 'files') {
        newRecordFormData.append(key, newRecordData[key]);
        delete newRecordData['files'];
      }
    });

    const fileBase64Array = [];
    for (const file of selectedFiles) {
      // Read each file as Base64 asynchronously
      const base64String = await readFileAsBase64(file);
      fileBase64Array.push(base64String);
    }

    console.log('fileBase64Array', fileBase64Array);

    // Store all Base64 strings in the 'file' key as an array
    newRecordFormData.append('file', fileBase64Array);

    // Push the FormData instance to formDataArray
    formDataArray.push(Array.from(newRecordFormData.entries()));
  };

  const addRecords = async () => {
    // console.log('selectedFiles', selectedFiles);

    // Validate required fields
    if (!category || !textInput || selectedFiles.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    let newRecordData = {
      user_id: user_id,
      // data_id: !isOnline ? offlineData?.deviceData?.id : deviceData?.id,
      data_id: !isOnline ? dataId : deviceData?.id,
      location: navigator.onLine ? locationName : '',
      lat: !navigator.onLine ? offlineLocation[0] : userLocation[0],
      long: !navigator.onLine ? offlineLocation[1] : userLocation[1],
      category: category,
      description: textInput,
      files: selectedFiles,
    };

    // console.log('newRecordData', newRecordData);

    // Check if lat and long are present and not empty
    if (!newRecordData.lat || !newRecordData.long) {
      toast.error('lat and long must be present and not empty.');
      return;
    }

    if (!isOnline) {
      // // Define an array to hold multiple FormData JSON strings
      let formDataArray = [];

      // newRecordData.files.forEach(async () => {
      //   let newRecordFormData = new FormData();

      //   // Append fields from newRecordData to the newRecordFormData
      //   Object.keys(newRecordData).forEach((key) => {
      //     // Skip files field as we'll handle it separately
      //     if (key !== 'files') {
      //       newRecordFormData.append(key, newRecordData[key]);
      //       delete newRecordData['files'];
      //     }
      //   });

      //   const fileBase64Array = [];
      //   for (const file of selectedFiles) {
      //     const base64String = await readFileAsBase64(file);
      //     fileBase64Array.push(base64String);
      //   }

      //   // If there are multiple files, store them as an array of Base64 strings
      //   if (fileBase64Array.length > 1) {
      //     newRecordFormData.append('file', fileBase64Array);
      //   } else if (fileBase64Array.length === 1) {
      //     // If there is only one file, store it directly as a Base64 string
      //     newRecordFormData.append('file', fileBase64Array[0]);
      //   }

      //   // Store the FormData instance directly in the array
      //   formDataArray.push(Array.from(newRecordFormData.entries()));
      // });
      // Call the async function and wait for it to finish processing files
      processFilesAsync(newRecordData, formDataArray)
        .then(() => {
          console.log('formDataArray', formDataArray);

          // Retrieve the existing array of FormData JSON strings from localStorage
          const storedFormDataArray =
            JSON.parse(localStorage.getItem('formDataArray')) || [];
          console.log('storedFormDataArray', storedFormDataArray);

          // Combine the existing array and the new array
          const combinedFormDataArray =
            storedFormDataArray.concat(formDataArray);
          console.log('combinedFormDataArray', combinedFormDataArray);

          // Store the combined array of FormData JSON strings in localStorage under the key
          localStorage.setItem(
            'formDataArray',
            JSON.stringify(combinedFormDataArray)
          );

          let recordDataForDisplay =
            JSON.parse(localStorage.getItem('recordDataForDisplay')) ?? [];

          const isNewEntry = !recordDataForDisplay.some((entry) => {
            // Check if the newRecordData already exists in recordDataForDisplay
            return (
              entry.user_id === newRecordData.user_id &&
              entry.data_id === newRecordData.data_id &&
              entry.location === newRecordData.location &&
              entry.lat === newRecordData.lat &&
              entry.long === newRecordData.long &&
              entry.category === newRecordData.category &&
              entry.description === newRecordData.description
            );
          });

          if (isNewEntry) {
            // Add the newRecordData to recordDataForDisplay only if it's a unique entry
            recordDataForDisplay.push(newRecordData);

            console.log('recordDataForDisplay', recordDataForDisplay);

            localStorage.setItem(
              'recordDataForDisplay',
              JSON.stringify(recordDataForDisplay)
            );
          } else {
            toast.error('Duplicate record found.');
            return;
          }

          return navigate(
            '/data-success?isOffline=true'
          );
        })
        .catch((error) => {
          console.error('Error processing files:', error);
        });
    } else {
      const formData = new FormData();

      formData.append(
        'record_data',
        JSON.stringify({
          user_id: user_id,
          data_id: deviceData.id,
          location: navigator.onLine ? locationName : '',
          lat: !navigator.onLine ? offlineLocation[0] : userLocation[0],
          long: !navigator.onLine ? offlineLocation[1] : userLocation[1],
          category: category,
          description: textInput,
        })
      );

      selectedFiles.forEach((file) => {
        formData.append('file', file);
      });

      // console.log(formData);

      try {
        const response = await addRecord(
          localStorage.getItem('access_token'),
          formData
        );

        if (response.status === 201 && response.data.success === true) {
          toast.success(response.data.message);
          navigate('/data-success');
          return;
        } else {
          return toast.error('Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    }
  };

  // console.log('recordData', recordData);

  useEffect(() => {
    fetchDeviceData.current();
  }, []);

  const toggleDataCollapse = () => {
    setIsDataCollapseOpen(!isDataCollapseOpen);
  };

  useEffect(() => {
    // Update network status
    const handleStatusChange = async () => {
      if (!navigator.onLine) {
        // alert('You are offline');
        setdeviceData(offlineData.deviceData);
        setParameterCards(offlineData.parameterCards);
      }

      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener('online', handleStatusChange);

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [
    isOnline,
    offlineData.deviceData,
    offlineData.parameterCards,
    navigate,
    offlineData.addRecordFormData,
  ]);

  return (
    <div className="record-container">
      <Header2 heading="Record Data" showNotification={true} />

      <div className="record-container__heading">
        <h1>{locationName ? locationName : ''}</h1>
        <div className="record">
          <div className="d-flex">
            <div className="record__latlng">
              <h1>
                {!navigator.onLine ? (
                  loading ? (
                    <div>Loading...</div>
                  ) : (
                    `${offlineLocation[0]}, ${offlineLocation[1]}`
                  )
                ) : userLocation === undefined ? (
                  ''
                ) : (
                  `${userLocation[0]}, ${userLocation[1]}`
                )}
              </h1>
            </div>
          </div>
        </div>
        <Dropdown
          options={[
            'Industrial Pollution',
            'Waste Burning',
            'Vehicle Pollution',
            'Construction & Demolition Waste',
            'Brick Kilns',
          ]}
          onSelect={(value) => setCategory(value)}
        />

        <div className="record-data" onClick={toggleDataCollapse}>
          <div className="d-flex">
            <div className="record-data__content">
              <h1>Data</h1>&nbsp;
              <span className="record-data-sub-heading">
                {deviceData.device_id}
              </span>
              <span className="record-data-down-arrow">
                <img src={Downarrow} alt="Dropdown Arrow" />
              </span>
            </div>
          </div>
          <div className="record-data__status">
          <span>Last Updated On { time }</span>
          </div>
        </div>
      </div>

      <div className="param-card-container">
        {isDataCollapseOpen && (
          <div>
            {parameterCards && parameterCards.length > 0 ? (
              parameterCards.map(
                (parameter, index) =>
                  index % 2 === 0 && (
                    <div className="param-card-row" key={index}>
                      <div className="param-card-col">
                        <DataParameterCard parameter={parameter} />
                      </div>
                      {index + 1 < parameterCards.length && (
                        <div className="param-card-col">
                          <DataParameterCard
                            parameter={parameterCards[index + 1]}
                          />
                        </div>
                      )}
                    </div>
                  )
              )
            ) : (
              <div>No Data Found</div>
            )}
          </div>
        )}
      </div>

      <div className="record-container__heading">
        <div className="record">
          <div className="d-flex">
            <div className="record__content">
              <h1>Image</h1>&nbsp;
            </div>
          </div>
        </div>
        <div className="file-upload-container">
          <div className="file-upload">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-upload-box">
                <img
                  className="uploaded-image"
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${file.name}`}
                />
                <button
                  className="remove-icon"
                  onClick={() => handleRemoveImage(index)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
            {selectedFiles.length < 3 ? (
              <div
                className="file-upload-box"
                style={{
                  width: selectedFiles.length % 2 === 0 ? '100%' : '46%',
                }}
              >
                <span className="upload-text">Add Image</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="record">
          <div className="d-flex">
            <div className="record__content">
              <h1>Description</h1>&nbsp;
            </div>
          </div>
        </div>
        <FormControl
          type="text"
          placeholder="Enter Description"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="record-textbox"
        />
        <div className="record-btn">
          <Button onClick={addRecords} disabled={!btnDisabled}>
            Submit Data
          </Button>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default RecordData;
