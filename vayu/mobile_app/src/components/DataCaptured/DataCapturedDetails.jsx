import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// import Icon from '../../assets/img/screen-icons/Ellipse.svg';
import Spinner from '../../assets/img/screen-icons/Spinner-Round-50.svg';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import MapViewComponent from '../UI/MapViewComponent/MapViewComponent';
import ArrowLeft from '../../assets/img/header-icons/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import Downarrow from '../../assets/img/screen-icons/arrow-down.svg';
import { getDataCaptured } from '../../api/ApiService';
import pm25 from '../../assets/img/screen-icons/PM2.5.svg';
import pm10 from '../../assets/img/screen-icons/PM10.svg';
import ch4 from '../../assets/img/screen-icons/CH4.svg';
import co from '../../assets/img/screen-icons/CO.svg';
import co2 from '../../assets/img/screen-icons/CO2.svg';
import no2 from '../../assets/img/screen-icons/NO2.svg';
import temp from '../../assets/img/screen-icons/Temperature.svg';
import rh from '../../assets/img/screen-icons/Humidity.svg';
import TickIcon from '../../assets/img/screen-icons/tick-icon.svg';
import { selectDeviceId } from '../../redux/device/deviceSlice';
import { useSelector } from 'react-redux';
import CircularLoader from '../UI/CircularLoader/CircularLoader';

const DataParameterCard = ({ parameter }) => {
  return (
    <Card className="data-card" style={{backgroundColor: parameter.color}}>
      <Card.Body className="data-card__body">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-start">
            <div className="data-card__icon">
              <img src={parameter.icon} alt="icon" />
            </div>
            <div className="data-card__content">
              <span>{parameter.label}</span>
              <h1>{parameter.value}</h1>
            </div>
          </div>
          <div className="data-card__spinner">
            <img src={TickIcon} alt="spinner" width={30} height={30} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const DataCapturedDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};
  const [dataCaptured, setDataCaptured] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDataCollapseOpen, setIsDataCollapseOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [parameterCards, setParameterCards] = useState([]);
  const deviceId = useSelector(selectDeviceId);

  const toggleDataCollapse = () => {
    setIsDataCollapseOpen(!isDataCollapseOpen);
  };

  const goBack = () => {
    navigate(-1);
  };

  const getData = useRef(async () => {
    try {
      const response = await getDataCaptured(
        localStorage.getItem('access_token'),
        data.dataItem.id
      );
      setDataCaptured(response.data.data);
      setSelectedFiles(response.data.data.file_data);
      const capturedData = response.data.data;

      const parameterCards = [
        { icon: pm25, label: 'PM 2.5', value: capturedData.pm_25 === null ? 'N/A' : capturedData.pm_25 , color: capturedData.pm_25 === null ? "#ebebe4" : "#FFFFFF"},
        { icon: pm10, label: 'PM 10', value: capturedData.pm_10 === null ? 'N/A' : capturedData.pm_10 , color: capturedData.pm_10 === null ? "#ebebe4" : "#FFFFFF"},
        { icon: ch4, label: 'CH4', value: capturedData.ch4 === null ? 'N/A' : capturedData.ch4 , color: capturedData.ch4 === null ? "#ebebe4" : "#FFFFFF"},
        { icon: co, label: 'CO', value: capturedData.co === null ? 'N/A' : capturedData.co , color: capturedData.co === null ? "#ebebe4" : "#FFFFFF"},
        { icon: co2, label: 'CO2', value: capturedData.co2 === null ? 'N/A' : capturedData.co2 , color: capturedData.co2 === null ? "#ebebe4" : "#FFFFFF"},
        { icon: no2, label: 'NO2', value: capturedData.no2 === null ? 'N/A' : capturedData.no2 , color: capturedData.no2 === null ? "#ebebe4" : "#FFFFFF"},
        { icon: temp, label: 'Temperature', value: capturedData.temp === null ? 'N/A' : `${capturedData.temp}°C` , color: capturedData.temp === null ? "#ebebe4" : "#FFFFFF"},
        { icon: rh, label: 'Humidity', value: capturedData.rh === null ? 'N/A' : capturedData.rh , color: capturedData.rh === null ? "#ebebe4" : "#FFFFFF"},
      ];

      // Set the parameter cards state
      setParameterCards(parameterCards);
    } catch (error) {
      console.error('Error fetching profile', error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    getData.current();
  }, []);

  return (
    <>
      <img
        src={ArrowLeft}
        alt="Left Icon"
        onClick={goBack}
        className="arrow-left"
      />
      {loading ? (
        <div><CircularLoader/></div>
      ) : (
        <div className="data-captured-details-container">
          <div className="data-captured-details-container__map-activity">
            <div className="data-captured-details-container__map-activity--map-container">
              <MapViewComponent
                style={{ height: '100%', width: '100%' }}
                latitude={dataCaptured.lat}
                longitude={dataCaptured.long}
              />
            </div>
          </div>

          <div className="data-captured-details-container__heading">
            <h1>{dataCaptured.location}</h1>
            <div className="data-captured-details-container__record">
              <div className="d-flex align-items-center justify-content-center">
                <div className="data-captured-details-container__record--latlng">
                  <h1>
                    {dataCaptured.lat}° N, {dataCaptured.long}° E
                  </h1>
                </div>
              </div>
            </div>
            <div
              className="data-captured-details-container__record-data"
              onClick={toggleDataCollapse}
            >
              <div className="d-flex align-items-center justify-content-center">
                <div className="data-captured-details-container__record-data--content">
                  <h1>Data</h1>&nbsp;
                  <span className="data-captured-details-container__record-data--record-sub-heading">
                     {/* {dataCaptured.data_id} */}
                     {deviceId}
                  </span>
                  <span className="data-captured-details-container__record-data--down-arrow">
                    <img src={Downarrow} alt="Dropdown Arrow" />
                  </span>
                </div>
              </div>
            </div>
            <div className="data-card-container">
                {isDataCollapseOpen && (
                <div>
                  {parameterCards && parameterCards.length > 0 ? (
                    parameterCards.map(
                      (parameter, index) =>
                        index % 2 === 0 && (
                          <div className="data-card-row" key={index}>
                            <div className="data-card-col">
                              <DataParameterCard parameter={parameter} />
                            </div>
                            {index + 1 < parameterCards.length && (
                              <div className="data-card-col">
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
            {/* {isDataCollapseOpen && (
              <div className="data-captured-details-container__param-card-container">
                <div className="data-captured-details-container__card-row">
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={pm25} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>PM 2.5</span>
                              <h1>{dataCaptured.pm_25}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={pm10} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>PM 10</span>
                              <h1>{dataCaptured.pm_10}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="data-captured-details-container__card-row">
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={so2} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>SO2</span>
                              <h1>{dataCaptured.ch4}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={co} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>CO</span>
                              <h1>{dataCaptured.co}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="data-captured-details-container__card-row">
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={o3} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>Ozone</span>
                              <h1>{dataCaptured.co2}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={no2} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>NO2</span>
                              <h1>{dataCaptured.no2}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="data-captured-details-container__card-row">
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={temp} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>Temperature</span>
                              <h1>{dataCaptured.temp}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="data-captured-details-container__card-col">
                    <Card className="param-card">
                      <Card.Body className="param-card__body">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center justify-content-start">
                            <div className="param-card__icon">
                              <img src={rh} alt="icon" />
                            </div>
                            <div className="param-card__content">
                              <span>Humidity</span>
                              <h1>{dataCaptured.rh}</h1>
                            </div>
                          </div>
                          <div className="param-card__spinner">
                            <img src={Spinner} alt="spinner" />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          </div>
          
          <div className="data-captured-details-container__images-container">
            <h1>Image</h1>

            <div className="data-captured-details-container__images-container--uploaded-images">
              <div className="image-uploaded">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="image-uploaded__box">
                    <img
                      className="image-uploaded__box--uploaded-image"
                      src={file.file}
                      alt={`Uploaded ${file.file}`}
                    />
                  </div>
                ))}

                {/* <div
                className="image-uploaded__box"
                style={{
                  width: selectedFiles.length % 2 === 0 ? "100%" : "46%",
                }}
              >
                <span className="upload-text">Add Image</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  readOnly
                />
              </div> */}
              </div>
            </div>
          </div>

          <div className="data-captured-details-container__description">
            <h1>Description</h1>

            <FormControl
              type="text"
              placeholder="Enter Description"
              value={data.dataItem.description}
              readOnly={true}
              className="description-textbox"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DataCapturedDetails;
