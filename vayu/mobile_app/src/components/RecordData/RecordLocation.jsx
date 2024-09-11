import Sheet from 'react-modal-sheet';
import React, { useEffect, useState } from 'react';
import ArrowLeft from '../../assets/img/header-icons/arrow-left.svg';
import {
  MapContainer,
  TileLayer,
  Marker,
  // Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Button } from 'react-bootstrap';
import L from 'leaflet';
import axios from 'axios';
import LocMarker from '../../assets/img/marker-icons/loc-marker.svg';
import { useNavigate } from 'react-router-dom';
import CircularLoader from '../UI/CircularLoader/CircularLoader';
import { useDispatch } from 'react-redux';
import { setlocationData } from '../../redux/locationData/locationDataSlice';

const RecordLocation = () => {
  const [isOpen, setOpen] = React.useState(false);
  const ref = React.useRef();
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    if (!isOnline) {
      return navigate('/record-data');
    }
  }, [isOnline, navigate]);

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

  const goBack = () => {
    navigate(-1);
  };
  const customIcon = new L.Icon({
    iconUrl: LocMarker,
    iconSize: [26, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const MapEvents = () => {
    const map = useMap();

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      setUserLocation([lat, lng]);
      retrieveLocationName([lat, lng]);
      setOpen(true);
    };

    useMapEvents({
      click: handleMapClick,
    });
    useEffect(() => {
      if (userLocation) {
        const maxZoomLevel = 18;
        map.flyTo(userLocation, maxZoomLevel, { duration: 1 });
        retrieveLocationName(userLocation);
        setOpen(true);
      }
    }, [map]);

    return null;
  };
  const retrieveLocationName = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[0]}&lon=${location[1]}`
      );
      if (response.data && response.data.address) {
        const { village, suburb, town, city, county, state } =
          response.data.address;
        const firstComponent =
          village || suburb || town || city || county || state || '';
        setLocationName(firstComponent.trim());
        dispatch(
          setlocationData({
            locationName: firstComponent.trim(),
            userLocation: location,
          })
        );
      }
    } catch (error) {
      console.error('Error retrieving location name:', error.message);
    }
  };
  const handleRecordData = () => {
    if (locationName.trim() !== '' && userLocation !== null) {
      navigate('/record-data', {
        state: { locationName, userLocation },
      });
    } else {
      console.error(
        'Invalid record data. Please make sure to select a location.'
      );
    }
  };
  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting user location:', error.message);
        setIsLoading(false);
      }
    );
  }, []);

  return isLoading ? (
    <CircularLoader />
  ) : (
    <>
      <div className="record-location-container">
        <img
          src={ArrowLeft}
          alt="Left Icon"
          onClick={goBack}
          className="record-location-container__arrow-left"
        />
        <div className="record-location-container__map-activity">
          <div className="record-location-container__map-activity--map-container">
            <MapContainer
              zoom={6}
              center={userLocation || [35.6894875, 139.6917064]}
              style={{ height: '100vh', width: '100%' }}
              zoomControl={false}
            >
              <MapEvents />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={customIcon}
                  onClick={() => setOpen(true)}
                  draggable={true}
                  eventHandlers={{
                    dragend: (e) => {
                      const { lat, lng } = e.target.getLatLng();
                      setUserLocation([lat, lng]);
                      retrieveLocationName([lat, lng]);
                    },
                  }}
                ></Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
      <Sheet
        ref={ref}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[200, 100, 0]}
        initialSnap={0}
        springConfig={{
          stiffness: 150,
          damping: 15,
          mass: 0.3,
        }}
      >
        <Sheet.Container>
          <Sheet.Header></Sheet.Header>
          <Sheet.Content>
            <div className="sheet-location-name">{locationName}</div>
            <div>
              <div className="sheet-location-btn">
                <Button className="location-btn" onClick={handleRecordData}>
                  Record Data
                </Button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default RecordLocation;
