import { Fragment } from 'react';
import DataSuccessImg from '../../assets/img/images/tick-green.svg';
import DataSuccessImgOffline from '../../assets/img/images/tick-yellow.svg';

import Header2 from '../UI/Header/Header_2';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
// import { selectOfflineData } from '../../redux/offlineData/offlineDataSlice';
// import { useSelector } from 'react-redux';

const RecordDataSuccess = () => {
  const navigate = useNavigate();

  const search = useLocation().search;
  const isOffline = new URLSearchParams(search).get('isOffline') || false;

  // console.log('isOffline', isOffline);

  // const offlineData = useSelector(selectOfflineData);
  // console.log('offlineData', offlineData);

  return (
    <Fragment>
      <Header2 heading="Record Data" showNotification={true} />
      <div className="data-success-container">
        <div className="data-success-container__img-wrapper">
          {isOffline ? (
            <img src={DataSuccessImgOffline} alt="offline" />
          ) : (
            <img src={DataSuccessImg} alt="online" />
          )}
        </div>

        <div className="data-success-container__message">
          <h1>Data Saved</h1>
          <span>
            {isOffline
              ? 'Your data has been captured successfully! The data will be synced once the device is connected to the internet.'
              : 'Your data has been captured successfully!'}
          </span>
        </div>

        <div className="data-success-container__btn-wrapper">
          <Button
            className="data-success-container__btn-wrapper--button"
            onClick={() =>
              navigate('/record-location')
            }
          >
            Record Another Data
          </Button>

          <Button
            className="data-success-container__btn-wrapper--button"
            style={{
              backgroundColor: '#fff',
              color: '#31572c',
            }}
            onClick={() =>
              navigate('/data-captured')
            }
          >
            Go to Data Captured
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default RecordDataSuccess;
