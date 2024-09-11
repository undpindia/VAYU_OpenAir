import { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import LocMarker from '../../../../src/assets/img/marker-icons/activity-marker.svg';
import L from 'leaflet';
import PropTypes from 'prop-types';

function MapActivityComponent({ style, markers }) {
  const mapRef = useRef();
  const [mapBounds, setMapBounds] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: LocMarker,
    iconSize: [18, 18],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (markers.length > 0) {
      const markerPositions = markers.map((marker) => marker.position);
      const bounds = L.latLngBounds(markerPositions);
      setMapBounds(bounds);
    }
  }, [markers]);

  useEffect(() => {
    if (mapBounds && mapRef.current) {
      mapRef.current.fitBounds(mapBounds);
    }
  }, [mapBounds]);

  return (
    <div>
      {markers.length > 0 && (
        <MapContainer
          center={[0, 0]}
          zoom={13}
          style={style}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, index) => (
            <Marker
              position={marker.position}
              icon={customIcon}
              key={index}
            ></Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

MapActivityComponent.propTypes = {
  style: PropTypes.object,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

export default MapActivityComponent;
