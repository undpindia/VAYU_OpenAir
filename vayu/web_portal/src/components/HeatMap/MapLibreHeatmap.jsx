import { useEffect, useState, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Protocol } from 'pmtiles';
import './HeatMap.scss';
import Patna from '../../assets/shapefiles/patna_boundary.json';
import Gurugram from '../../assets/shapefiles/gurugram_boundary.json';
import { getStaticDataPoints, getRecordData } from '@/api/ApiService';
import MarkerRed from '../../assets/images/icons/marker-red.png';
import { Images } from './ImageImports';
import moment from 'moment';
import Close from '../../assets/images/icons/close.svg';
import  Loader  from '../ui/loader';
import Basemap from "./Basemap.json"

const formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  // Set time to 00:00:00.000
  const hours = '00';
  const minutes = '00';
  const seconds = '00';
  const milliseconds = '000';

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const getBounds = (geojson) => {
  if (!geojson || !geojson.features || !Array.isArray(geojson.features)) {
    // console.error('Invalid GeoJSON data:', geojson);
    return [Infinity, Infinity, -Infinity, -Infinity];
  }

  const bbox = [Infinity, Infinity, -Infinity, -Infinity];

  geojson.features.forEach((feature) => {
    if (feature && feature.geometry && feature.geometry.coordinates) {
      const coords = feature.geometry.coordinates;

      if (feature.geometry.type === 'LineString') {
        coords.forEach(([lng, lat]) => {
          if (isFinite(lng) && isFinite(lat)) {
            bbox[0] = Math.min(bbox[0], lng);
            bbox[1] = Math.min(bbox[1], lat);
            bbox[2] = Math.max(bbox[2], lng);
            bbox[3] = Math.max(bbox[3], lat);
          }
        });
      } else if (feature.geometry.type === 'MultiLineString') {
        coords.forEach((line) => {
          line.forEach(([lng, lat]) => {
            if (isFinite(lng) && isFinite(lat)) {
              bbox[0] = Math.min(bbox[0], lng);
              bbox[1] = Math.min(bbox[1], lat);
              bbox[2] = Math.max(bbox[2], lng);
              bbox[3] = Math.max(bbox[3], lat);
            }
          });
        });
      } else if (feature.geometry.type === 'Polygon') {
        coords.forEach((ring) => {
          ring.forEach(([lng, lat]) => {
            if (isFinite(lng) && isFinite(lat)) {
              bbox[0] = Math.min(bbox[0], lng);
              bbox[1] = Math.min(bbox[1], lat);
              bbox[2] = Math.max(bbox[2], lng);
              bbox[3] = Math.max(bbox[3], lat);
            }
          });
        });
      } else if (feature.geometry.type === 'MultiPolygon') {
        coords.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach(([lng, lat]) => {
              if (isFinite(lng) && isFinite(lat)) {
                bbox[0] = Math.min(bbox[0], lng);
                bbox[1] = Math.min(bbox[1], lat);
                bbox[2] = Math.max(bbox[2], lng);
                bbox[3] = Math.max(bbox[3], lat);
              }
            });
          });
        });
      }
    }
  });

  return bbox;
};

export default function MapLibreHeatmap({
  startDate,
  endDate,
  updateMap,
  selectedCity,
  selectedType,
  onMarkerClick,
  handleZoomToBounds,
  isDensityVisible,
  isRecordVisible,
  isStaticVisible,
}) {
  const [filter, setFilter] = useState(['all']);
  const [filterPointData, setFilterPointData] = useState(['all']);
  const [geojson, setGeojson] = useState(null);
  const [points, setPoints] = useState([]);
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedSensorType, setSelectedSensorType] = useState('dynamic');
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const [recordUrl, setRecordUrl] = useState(
    'https://undpin176st003.blob.core.windows.net/data/Layers/patna/recorddata/recorddata.pmtiles'
  );
  const [heatmapUrl, setHeatMapUrl] = useState(
    'https://undpin176st003.blob.core.windows.net/data/Layers/patna/heatmap/heatmap.pmtiles'
  );
  const [popup, setPopup] = useState({
    visible: false,
    longitude: 0,
    latitude: 0,
    anchor: 'center',
    offset: 0,
  });
  const [recordCaptured, setRecordCaptured] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loaderlat, setLoaderLat] = useState('');
  const [loaderlng, setLoaderLng] = useState('');

  const dataDevices = [
    {
      id: 1,
      label: 'PM 2.5',
      value: recordCaptured.pm_25 === null ? 'N/A' : recordCaptured.pm_25,
      unit: 'µg/m3',
      icon: <img src={Images.Pm25} />,
      isData: recordCaptured.pm_25 ? true : false,
    },
    {
      id: 2,
      label: 'PM 10',
      value: recordCaptured.pm_10 === null ? 'N/A' : recordCaptured.pm_10,
      unit: 'µg/m3',
      icon: <img src={Images.Pm10} />,
      isData: recordCaptured.pm_10 ? true : false,
    },
    {
      id: 3,
      label: 'CO',
      value: recordCaptured.co === null ? 'N/A' : recordCaptured.co,
      unit: 'µg/m3',
      icon: <img src={Images.Co} />,
      isData: recordCaptured.co ? true : false,
    },
    {
      id: 4,
      label: 'CO2',
      value: recordCaptured.co2 === null ? 'N/A' : recordCaptured.co2,
      unit: 'ppb',
      icon: <img src={Images.Co2} />,
      isData: recordCaptured.co2 ? true : false,
    },
    {
      id: 5,
      label: 'CH4',
      value: recordCaptured.ch4 === null ? 'N/A' : recordCaptured.ch4,
      unit: 'ppb',
      icon: <img src={Images.Ch4} />,
      isData: recordCaptured.ch4 ? true : false,
    },
    {
      id: 6,
      label: 'NO2',
      value: recordCaptured.no2 === null ? 'N/A' : recordCaptured.no2,
      unit: 'µg/m3',
      icon: <img src={Images.No2} />,
      isData: recordCaptured.no2 ? true : false,
    },
    {
      id: 7,
      label: 'Temp.',
      value: recordCaptured.temp === null ? 'N/A' : recordCaptured.temp,
      unit: '℃',
      icon: <img src={Images.Temp} />,
      isData: recordCaptured.temp ? true : false,
    },
    {
      id: 8,
      label: 'Humidity',
      value: recordCaptured.rh === null ? 'N/A' : recordCaptured.rh,
      unit: '%',
      icon: <img src={Images.Humid} />,
      isData: recordCaptured.rh ? true : false,
    },
  ];

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);
    return () => {
      maplibregl.removeProtocol('pmtiles');
    };
  }, []);
  useEffect(() => {
    if (selectedCity === 'patna') {
      setGeojson(Patna);
      setRecordUrl(
        'https://undpin176st003.blob.core.windows.net/data/Layers/patna/recorddata/recorddata.pmtiles'
      );
      setHeatMapUrl(
        'https://undpin176st003.blob.core.windows.net/data/Layers/patna/heatmap/heatmap.pmtiles'
      );
      setLoaderLat(85.14355350866113)
      setLoaderLng(25.599150930272433)
    } else if (selectedCity === 'gurugram') {
      setGeojson(Gurugram);
      setRecordUrl(
        'https://undpin176st003.blob.core.windows.net/data/Layers/gurugram/recorddata/recorddata.pmtiles'
      );
      setHeatMapUrl(
        'https://undpin176st003.blob.core.windows.net/data/Layers/gurugram/heatmap/heatmap.pmtiles'
      );
      setLoaderLat(76.91488259904993)
      setLoaderLng(28.407760350635037)
    } else {
      setGeojson(null);
    }
  }, [updateMap]);

  useEffect(() => {
    const formatDateWithTime = (date, time) => {
      const dateObj = new Date(date);
      const [year, month, day] = [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()];
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${time}`;
    };

    let startFormatted = startDate ? formatDate(startDate) : null;
    let endFormatted = endDate ? formatDateWithTime(endDate, '23:59:59.000') : null;

    if (startFormatted && endFormatted) {
      setFilter([
        'all',
        ['>=', ['get', 'data_creat'], startFormatted],
        ['<=', ['get', 'data_creat'], endFormatted],
      ]);
      setFilterPointData([
        'all',
        ['>=', ['get', 'created_at'], startFormatted],
        ['<=', ['get', 'created_at'], endFormatted],
      ]);
    } else {
      setFilter(['all']);
      setFilterPointData(['all']);
    }
  }, [updateMap]);

  useEffect(() => {
    if (geojson && mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) {
       const fixedBounds = [75.0549968554388869,23.1036327973628808 , 88.7857496351519160,30.5138803292714975];
        const isValid = fixedBounds[0] >= -180 && fixedBounds[2] <= 180 && fixedBounds[1] >= -90 && fixedBounds[3] <= 90;

        if (isValid && fixedBounds[0] !== Infinity && fixedBounds[1] !== Infinity) {
          const extendedBounds = [
            [fixedBounds[0] , fixedBounds[1] ],
            [fixedBounds[2] , fixedBounds[3]]
          ];
          const clampedBounds = [
            [Math.max(-180, extendedBounds[0][0]), Math.max(-90, extendedBounds[0][1])],
            [Math.min(180, extendedBounds[1][0]), Math.min(90, extendedBounds[1][1])]
          ];
            map.setMaxBounds(clampedBounds);
        } else {
          console.log('Invalid bounds:', fixedBounds);
        }
      }
    }
  }, [geojson]);

  useEffect(() => {
    if (selectedType === 'static') {
      setSelectedSensorType('static');
      setPopup({
        visible: false,
        longitude: 0,
        latitude: 0,
        offset: 0,
      });
    }
    if (selectedType === 'dynamic') {
      setSelectedSensorType('dynamic');
    }
  }, [updateMap]);

  useEffect(() => {
    const bodyparam = {
      city: selectedCity,
    };
    const fetchPoints = async () => {
      setLoader(true); 
      try {
        const response = await getStaticDataPoints(bodyparam);
        if (response.data.code == 200) {
          setPoints(response.data.data);
        }
      } catch (error) {
        console.log('Failed to fetch points:', error);
      } finally{
        setLoader(false)
      }
    };
    if (selectedType === 'static') {
      fetchPoints();
    }
  }, [updateMap]);

  const handleMarkerClick = (point) => {
    setSelectedMarker(point);
    if (onMarkerClick) {
      onMarkerClick(point);
    }
  };
  const determinePopupPosition = (coordinates) => {
    const { width, height } = mapRef.current
      .getCanvas()
      .getBoundingClientRect();
    const lngLat = mapRef.current.project(coordinates);

    let anchor = 'top';
    if (lngLat.y > height / 2) anchor = 'bottom';
    if (lngLat.x > width / 2) anchor = 'left';
    if (lngLat.x < width / 2) anchor = 'right';

    const offset = 15;

    return { anchor, offset };
  };

  const handleClickOnRecordDataPoint = (event) => {
    const feature = event.features[0];
    // console.log("marker clicked")
    if (feature) {
      setSelectedFeatureId(feature.properties.id);
    }
    const coordinates = feature.geometry.coordinates.slice();
    const properties = feature.properties;
    // console.log('properties', properties);

    const { anchor, offset } = determinePopupPosition(coordinates);

    setPopup({
      visible: true,
      longitude: coordinates[0],
      latitude: coordinates[1],
      anchor,
      offset,
    });
    getData.current(feature.properties.id);
  };
  useEffect(() => {
    if (mapRef.current && selectedFeatureId !== null) {
      const map = mapRef.current.getMap();
      map.setFeatureState(
        {
          source: 'recordDataSource',
          sourceLayer: 'zcta',
          id: selectedFeatureId,
        },
        { selected: true }
      );
    }
  }, [selectedFeatureId]);

  useEffect(() => {
    if (geojson && mapRef.current) {
      const bounds = getBounds(geojson);
      const isValid =
        bounds[0] >= -180 &&
        bounds[2] <= 180 &&
        bounds[1] >= -90 &&
        bounds[3] <= 90;

      if (isValid && bounds[0] !== Infinity && bounds[1] !== Infinity) {
        const map = mapRef.current.getMap();
        map.fitBounds(bounds, { padding: 40, animate: false });
      } else {
        console.log('Invalid bounds:', bounds);
      }
    }
  }, [handleZoomToBounds]);

  const getData = useRef(async (point) => {
    try {
      const response = await getRecordData(point);
      setRecordCaptured(response.data.data);
      setSelectedFiles(response.data.data.file_data);
      const capturedData = response.data.data;
      // console.log('capturedData', capturedData);
    } catch (error) {
      console.error('Error fetching profile', error);
    } 
  });

  useEffect(() => {
    if (mapRef.current && popup.visible) {
      const map = mapRef.current.getMap();
      const popupCoordinates = [popup.longitude, popup.latitude];
      const canvas = map.getCanvas();
      const { width, height } = canvas.getBoundingClientRect();
      const popupLngLat = map.project(popupCoordinates);
      const buffer = -100; 

      let newCenter = [popup.longitude, popup.latitude];
      let newZoom = map.getZoom();

      switch (popup.anchor) {
        case 'top':
          newCenter = map.unproject([
            popupLngLat.x,
            popupLngLat.y - buffer,
          ]);
          break;
        case 'bottom':
          newCenter = map.unproject([
            popupLngLat.x,
            popupLngLat.y + buffer,
          ]);
          break;
        case 'left':
          newCenter = map.unproject([
            popupLngLat.x - buffer,
            popupLngLat.y,
          ]);
          break;
        case 'right':
          newCenter = map.unproject([
            popupLngLat.x + buffer,
            popupLngLat.y,
          ]);
          break;
        default:
          break;
      }

      map.jumpTo({
        center: newCenter,
        zoom: newZoom,
        duration: 500,
      });
    }
  }, [popup]);
  
  return (
    <div className="h-full w-full rounded-lg shadow-md">
      <Map
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        initialViewState={{
          latitude: 25.5941,
          longitude: 85.1376,
          zoom: 12,
          bearing: 0,
        }}
        mapStyle={{
          version: 8,
          sources: {
            osm: {
              type: 'vector',
              url: 'pmtiles://https://undpin176st003.blob.core.windows.net/data/Basemap/basemap.pmtiles',
            },
            protomaps: {
              type: 'vector',
              url: 'pmtiles://' + heatmapUrl,
            },
            recordDataSource: {
              type: 'vector',
              url: 'pmtiles://' + recordUrl,
            },
            geojsonSource: {
              type: 'geojson',
              data: geojson,
            },
          },
          layers: [
            ...Basemap.layers,
            ...(selectedSensorType === 'static'
              ? []
              : isDensityVisible
              ? [
                  {
                    id: 'heatmap',
                    type: 'heatmap',
                    source: 'protomaps',
                    'source-layer': 'zcta',
                    filter: filter,
                    paint: {
                      'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0,
                        'rgba(0, 0, 255, 0)',
                        0.2,
                        'rgba(0, 255, 255, 0.7)',
                        0.4,
                        'rgba(0, 255, 0, 0.7)',
                        0.6,
                        'rgba(255, 255, 0, 0.7)',
                        0.8,
                        'rgba(255, 165, 0, 0.7)',
                        1,
                        'rgb(90,34,139,0.7)',
                      ],
                      'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0,
                        1,
                        14,
                        3,
                      ],
                      'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, // At zoom level 0, the radius will be 2 pixels
                        2,
                        9, // At zoom level 9, the radius will be 20 pixels
                        20,
                      ],
                      'heatmap-opacity': 1,
                    },
                  },
                ]
              : []),
            ...(selectedSensorType === 'static'
              ? []
              : isRecordVisible
              ? [
                  {
                    id: 'recordDataPoints',
                    type: 'circle',
                    source: 'recordDataSource',
                    'source-layer': 'zcta',
                    filter: filterPointData,
                    paint: {
                      'circle-radius': [
                        'case',
                        ['==', ['get', 'id'], selectedFeatureId],
                        5,
                        3,
                      ],
                      'circle-color': '#FFF',
                      'circle-stroke-width': 3,
                      'circle-stroke-color': '#3D944E',
                    },
                    // layout: {
                    //   'icon-image': 'recordDataImage', // Use the image loaded above
                    //   'icon-size': 0.5, // Adjust the size of the icon
                    //   'icon-offset': [0, -15], // Adjust the offset if needed
                    // },
                  },
                ]
              : []),
            {
              id: 'geojson-layer',
              type: 'line',
              source: 'geojsonSource',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#888',
                'line-width': 1,
                // 'line-dasharray': [1, 2]
              },
            },
          ],
          sprite: "https://undpin176st003.blob.core.windows.net/data/Basemap/assets/sprites/v3/grayscale",
          glyphs: "https://undpin176st003.blob.core.windows.net/data/Basemap/assets/fonts/{fontstack}/{range}.pbf"
        }}
        mapLib={maplibregl}
        onLoad={(event) => {
          const map = event.target;

          map.addControl(new maplibregl.NavigationControl(), 'top-left');
          map.getCanvas().style.cursor = 'pointer';
          map.dragRotate.disable();
          map.touchZoomRotate.disableRotation();
          map.on('mouseenter', 'recordDataPoints', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.lngLat;
            // console.log('coordinates', coordinates);
          });

          map.on('mouseleave', 'recordDataPoints', () => {
            map.getCanvas().style.cursor = '';
          });
          map.on('click', 'recordDataPoints', (e) => {
            const coordinates = e.lngLat;
            const properties = e.features[0].properties;
            // console.log('properties', properties);

            if (
              coordinates &&
              !isNaN(coordinates.lng) &&
              !isNaN(coordinates.lat)
            ) {
              setPopup({
                visible: true,
                longitude: coordinates.lng,
                latitude: coordinates.lat,
                // anchor: popup.anchor,
                offset: popup.offset,
              });
            }
          });
          map.on('click', (e) => {
            if (!e.features || e.features.length === 0) {
              setPopup({
                visible: false,
                longitude: 0,
                latitude: 0,
                offset: 0,
              });
              setSelectedFeatureId('');
            }
          });
          map.on('click', 'recordDataPoints', handleClickOnRecordDataPoint);
        }}
        >{loader && selectedSensorType === 'static' && isStaticVisible &&(
          <Marker longitude={loaderlat} latitude={loaderlng}>
            <Loader /> {/* Display loader marker while fetching data */}
          </Marker>
        )}
        {isStaticVisible &&
          selectedSensorType === 'static' && !loader &&
          points.map((point, index) => (
            <Marker
              key={index}
              longitude={point.long}
              latitude={point.lat}
              onClick={() => handleMarkerClick(point)}
              anchor={popup.anchor} // Dynamically set based on logic
              offset={popup.offset}
            >
              <img
                src={MarkerRed}
                alt="Marker"
                style={{
                  width: selectedMarker === point ? '30px' : '20px', // Increase size if selected
                  height: selectedMarker === point ? '30px' : '20px',
                  transition: 'width 0.2s ease, height 0.2s ease', // Smooth transition
                  cursor: 'pointer',
                }}
              />
            </Marker>
          ))}
        {popup.visible && (
          <Popup
            longitude={popup.longitude}
            latitude={popup.latitude}
            closeButton={false}
            closeOnClick={false}
            offset={popup.offset}
            anchor={popup.anchor}
          >
            <div className="custom-popup">
              <div className="w-[600px] h-[auto] bg-[#FFF] p-1 overflow-auto no-scrollbar">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="text-lg sm:text-xl font-semibold text-custom-green mb-2.5">
                      Data
                    </div>
                    <span className="text-sm sm:text-lg mt-2 mb-2 sm:mt-0 location mr-8 flex flex-col sm:flex-row">
                      {recordCaptured.location} |{' '}
                      {moment(recordCaptured.created_at).format('DD-MM-YYYY')}
                      <img
                        src={Close}
                        alt="Close"
                        className="custom-popup-close-btn"
                        onClick={() => {
                          setPopup({
                            visible: false,
                            longitude: 0,
                            latitude: 0,
                            offset: 0,
                          });
                          setSelectedFeatureId('');
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  {dataDevices.map((device) => (
                    <div
                      key={device.id}
                      className="w-full h-[60px] bg-white p-2 rounded-lg shadow-md flex items-center"
                      // style={device.isData ? {} : {display: "none"}}
                    >
                      <div className="text-xl sm:text-2xl mr-2 w-[30px]">
                        {device.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium custom-gray1-500 param-label">
                          {device.label}
                        </span>
                        <div className="flex items-baseline">
                          <span className="text-lg font-medium text-black	param-value">
                            {device.value}
                          </span>
                          <span className="text-xs font-medium text-black ml-1">
                            {device.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <span className="flex justify-between items-center mb-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-custom-green mb-1">
                      Description
                    </h3>
                    <span className="custom-popup-description text-sm sm:text-xl font-semibold mb-1">
                      {recordCaptured.category}
                    </span>
                  </span>
                  <p className="text-sm sm:text-base description">
                    {recordCaptured.description}
                  </p>
                </div>
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '-10px' }}>
                    <h3 className="text-lg sm:text-xl font-semibold text-custom-green mb-3">
                      Images
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-1">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="w-full h-[100px] rounded-lg shadow-md"
                        >
                          <img
                            src={file.file}
                            alt={`Image ${file.file}`}
                            className="rounded-lg object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
