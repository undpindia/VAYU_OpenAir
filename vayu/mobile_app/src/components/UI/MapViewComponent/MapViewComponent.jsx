// import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; //Popup
import LocMarker from '../../../../src/assets/img/marker-icons/loc-marker.svg';
import L from 'leaflet';
import PropTypes from 'prop-types';

function MapViewComponent({ style , latitude, longitude}) {
  const customIcon = new L.Icon({
    iconUrl: LocMarker,
    iconSize: [26, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return (
    <div>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={style}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
        </Marker>
      </MapContainer>
    </div>
  );
}

MapViewComponent.propTypes = {
  style: PropTypes.object,
};

export default MapViewComponent;
