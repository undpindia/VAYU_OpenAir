import { Fragment, useEffect, useRef, useState } from 'react';
import Header from '../UI/Header/Header';
import DeviceIcon from '../../assets/img/screen-icons/device-connected.svg';
import MapActivityComponent from '../UI/MapActivityComponent/MapActivityComponent';
import { useNavigate } from 'react-router-dom';
import {
  getProfile,
  getDevice,
  getActivity,
  getAssignedRecord,
  getApproved,
} from '../../api/ApiService';
import { setProfileName } from '../../redux/Profile/profileSlice';
import { useDispatch } from 'react-redux';
import { selectProfileName } from '../../redux/Profile/profileSlice';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import OfflineScreen from '../UI/OfflineScreen/OfflineScreen';
import ApprovalScreen from '../UI/ApprovalScreen/Approval';
import { setUserApproved } from '../../redux/userApproval/userApproval';
import { selectOfflineData } from '../../redux/offlineData/offlineDataSlice';
import { setDeviceName, setDeviceId, setIsDevAvailable } from '../../redux/device/deviceSlice';
import CircularLoader from '../UI/CircularLoader/CircularLoader';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_id = localStorage.getItem('user_id');
  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [assignedRecords, setAssignedRecords] = useState([]);
  const [mapActivity, setMapActivity] = useState([]);
  const profile_name = useSelector(selectProfileName);
  const [IsApproved, setIsApproved] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // console.log('offlineData', offlineData);

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const offlineData = useSelector(selectOfflineData);
  console.log('offlineData', offlineData);

  const recorddata = () => {
    //title, latitude, longitude

    navigate('/data-captured');
  };

  const assigned = () => {
    navigate('/assigned');
  };

  const record = () => {
    if (!isOnline) {
      navigate('/record-data');
      return;
    }
    navigate('/record-location');
  };

  const fetchData = useRef(async () => {
    try {
      const response = await getProfile(localStorage.getItem('access_token'));
      // setProfile(response.data.data);
      dispatch(setProfileName(response.data.data.full_name));
    } catch (error) {
      console.log('Error fetching profile');
    }
  });

  const fetchDevice = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const res = await getDevice(
        localStorage.getItem('access_token'),
        bodyparam
      );
      if (res.data.code === 200 && Object.keys(res.data.data).length > 0) {
        setDevice(res.data.data);
        dispatch(setDeviceName(res.data.data.device_name));
        dispatch(setDeviceId(res.data.data.id));
        localStorage.setItem("device_name",res.data.data.device_name)
        localStorage.setItem("device_id",res.data.data.id)
        setLoading(false);
        dispatch(setIsDevAvailable(true))
      } else {
        console.log('');
        setDevice({});
        setLoading(false);
        dispatch(setIsDevAvailable(false))
      }
    } catch (error) {
      console.log('Error fetching profile', error);
      setLoading(false);
    }
  });

  const fetchActivity = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const res = await getActivity(
        localStorage.getItem('access_token'),
        bodyparam
      );
      // console.log('res==>map', res);
      if (res.data.code === 200) {
        setMapActivity(res.data);
        setMapLoading(false);
      } else {
        console.log('');
      }
    } catch (error) {
      console.log('Error fetching profile', error);
    }
  });

  const fetchAssignedRecords = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const response = await getAssignedRecord(
        localStorage.getItem('access_token'),
        bodyparam
      );
      // console.log('response', response);
      if (response.status === 200 && response.data.data.length > 0) {
        setAssignedRecords(response.data.data);
      }
      // setData(response.data);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  });
  const fetchApproved = useRef(async () => {
    try {
      const response = await getApproved(localStorage.getItem('access_token'));
      if (response.status === 200 && response.data.success === true) {
        setIsApproved(response.data.approval);
        dispatch(setUserApproved(response.data.approval));
        setTimeout(() => {
          setIsLoading(true);
      }, 500);
      } 
    } catch (error) {
      console.log('Error fetching');
    }
  });
  useEffect(() => {
    fetchApproved.current();
    fetchData.current();
    fetchDevice.current();
    fetchActivity.current();
    fetchAssignedRecords.current();
  }, [isOnline]);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
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
  }, [isOnline]);

  // console.log('isOnline', isOnline);

  // console.log('device', device);
  // console.log('mapActivity', mapActivity);
  // console.log('assignedRecords', assignedRecords);
  console.log(IsApproved);

  return (
    <Fragment>
      <Header heading="Welcome Back" subtext={profile_name} />

      {isOnline ? (
        isLoading ? 
        IsApproved === true || IsApproved === null ? (
          <div className="home-container">
            {mapLoading ? (
              <></>
            ) : mapActivity.data === undefined ? (
              <div className="home-container__no-activity">
                <div className="records-card">
                  <h1>No records found</h1>
                </div>
              </div>
            ) : (
              <div className="home-container__top-cards">
                <div className="records-card" onClick={recorddata}>
                  <h1>Records</h1>
                  <span>{mapActivity.data.length}</span>
                </div>

                <div className="records-card" onClick={assigned}>
                  <h1>Assigned</h1>
                  <span>
                    {assignedRecords.length > 0 ? assignedRecords?.length : '-'}
                  </span>
                </div>
              </div>
            )}

            <div className="home-container__connected-device">
              <h1>Device Connected</h1>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div
                  className="devices"
                  style={{
                    justifyContent:
                      Object.keys(device).length > 0
                        ? 'space-between'
                        : 'center',
                    height: Object.keys(device).length > 0 ? 'auto' : '50px',
                  }}
                >
                  {Object.keys(device).length > 0 ? (
                    <>
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="devices__icon">
                          <img src={DeviceIcon} alt="Device Icon" />
                        </div>
                        <div className="devices__content">
                          <h1>{device.id}</h1>
                          <h3>{device.device_name}</h3>
                          <span>
                            Last Connected{' '}
                            {device.date_time === undefined
                              ? ''
                              : moment(device.date_time).format(
                                  'DD MMM YYYY h:mm A'
                                )}
                          </span>
                        </div>
                      </div>
                      <div
                        className={
                          device.active ? '' : 'devices__status-inactive'
                        }
                      >
                        <span>{device.active ? '' : 'Offline'}</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="devices__no-data-span">
                        No Devices Found
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="home-container__map-activity">
              <h1>Your Activity</h1>
              <div className="home-container__map-activity--map-container">
                {mapLoading ? (
                  <div>Loading...</div>
                ) : mapActivity.data === undefined ? (
                  <div className="home-container__map-activity--no-activity">
                    <div className="home-container__map-activity--heading">
                      No Activity
                    </div>
                    <div className="home-container__map-activity--sub-heading">
                      Record your first data
                    </div>
                    <Button
                      className="home-container__map-activity--record-btn"
                      onClick={record}
                    >
                      Record Data
                    </Button>
                  </div>
                ) : (
                  <MapActivityComponent
                    style={{ height: '200px', width: '100%' }}
                    markers={mapActivity.data.map((marker) => ({
                      position: [
                        parseFloat(marker.lat),
                        parseFloat(marker.long),
                      ],
                    }))}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="home-container">
            <ApprovalScreen />
          </div>
        )
        : <><CircularLoader/></>
      ) : (
        <div className="home-container">
          <OfflineScreen />
        </div>
      )}
    </Fragment>
  );
};

export default Home;
