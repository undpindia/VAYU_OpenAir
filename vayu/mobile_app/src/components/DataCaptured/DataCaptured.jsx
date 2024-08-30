import { useState, useEffect, useRef } from 'react';
import Header from '../UI/Header/Header';
import ArrowRightIcon from '../../assets/img/screen-icons/arrow-right.svg';
import { useNavigate } from 'react-router-dom';
import Filter from '../../assets/img/screen-icons/filter.svg';
import image from '../../assets/img/images/data-capture.svg';
import { getDataCapturedList } from '../../api/ApiService';
// import { selectUid } from '../../redux/auth/authSlice';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { selectOfflineData } from '../../redux/offlineData/offlineDataSlice';
import { useSelector } from 'react-redux';
import OfflineScreen from '../UI/OfflineScreen/OfflineScreen';
import CircularLoader from '../UI/CircularLoader/CircularLoader';

const DataCaptured = () => {
  const navigate = useNavigate();
  const offlineData = useSelector(selectOfflineData);

  const user_id = localStorage.getItem('user_id');
  // const [dataCaptured, setDataCaptured] = useState(
  //   offlineData?.recordDataForDisplay ?? []
  // );
  const [dataCaptured, setDataCaptured] = useState([]);
  const [dataCapturedOffline, setDataCapturedOffline] = useState([]);
  // const [success, setSuccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  // console.log('isOnline', isOnline);

  // console.log('window.navigator.onLine', window.navigator.onLine);

  // console.log('offlineData', offlineData);

  // console.log('dataCaptured', dataCaptured);

  const getOfflineDisplayData = useRef(() => {
    // Retrieve the array of serialized FormData entries from localStorage
    const storedSerializedFormDataArray =
      JSON.parse(localStorage.getItem('recordDataForDisplay')) || [];

    console.log('storedSerializedFormDataArray', storedSerializedFormDataArray);

    if (storedSerializedFormDataArray.length > 0) {
      setDataCapturedOffline(storedSerializedFormDataArray);
    }
  });

  const getData = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const response = await getDataCapturedList(
        localStorage.getItem('access_token'),
        bodyparam
      );
      setDataCaptured(response);
    } catch (error) {
      console.log('');
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    getData.current();
  }, []);

  useEffect(() => {
    if (!navigator.onLine) {
      // alert('You are offline');
      getOfflineDisplayData.current();
    }
  }, [offlineData]);

  const onDataCapturedClick = (item) => {
    navigate('/data-captured-details', {
      state: {
        dataItem: item,
      },
    });
  };
  const gotoRecord = () => {
    navigate('/record-location');
  };

  useEffect(() => {
    if (!navigator.onLine) {
      // alert('You are offline');
      // setDataCaptured(offlineData?.recordDataForDisplay);
      getOfflineDisplayData.current();
    }

    // Update network status
    const handleStatusChange = async () => {
      if (!navigator.onLine) {
        // alert('You are offline');
        // setDataCaptured(offlineData?.recordDataForDisplay);
        getOfflineDisplayData.current();
      }

      if (navigator.onLine) {
        getData.current();
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
  }, [isOnline, offlineData]);

  return (
    <div>
      <Header heading="Data Captured" />
      <div className="data-captured-container">
        {loading ? (
          <div className="data-captured-container__loader"><CircularLoader /></div>
        ) : isOnline ? (
          dataCaptured &&
          dataCaptured.data &&
          dataCaptured.data.success === true ? (
            <>
              {dataCaptured.data.data.some((item) =>
                moment(item.date_time).isSame(moment(), 'month')
              ) && (
                <>
                  <div className="data-captured-container__heading">
                    <h1>This Month</h1>
                  </div>

                  {dataCaptured.data.data
                    .sort((a, b) => {
                      return (
                        moment(b.date_time).valueOf() -
                        moment(a.date_time).valueOf()
                      );
                    })
                    .map((item, index) => {
                      const itemDate = moment(item.date_time);
                      const isCurrentMonth = itemDate.isSame(moment(), 'month');

                      if (isCurrentMonth) {
                        return (
                          <div
                            className="data-captured-container__item"
                            key={index}
                            onClick={() => onDataCapturedClick(item)}
                          >
                            <div className="data-captured-container__item--content">
                              <div className="item--content-heading">
                                <h1>{item.location}</h1>
                                <div
                                  className={
                                    'item--content-heading__status-active'
                                  }
                                >
                                  <span>Active</span>
                                </div>
                              </div>
                              <span>
                                {item?.device_id} |{' '}
                                {moment(item?.date_time).format('DD MMM YYYY')}{' '}
                                | {moment(item?.date_time).format('h:mm a')}
                              </span>
                            </div>

                            <div
                              className="data-captured-container__item--icon"
                              onClick={() => onDataCapturedClick(item)}
                            >
                              <img
                                src={ArrowRightIcon}
                                alt="Arrow Right Icon"
                              />
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                </>
              )}
              {dataCaptured.data.data.some((item) =>
                moment(item.date_time).isSame(
                  moment().subtract(1, 'month'),
                  'month'
                )
              ) && (
                <>
                  <div className="data-captured-container__heading-previous">
                    <h1>Previous Month</h1>
                  </div>

                  {dataCaptured.data.data.map((item, index) => {
                    const itemDate = moment(item.date_time);
                    const isPreviousMonth = itemDate.isSame(
                      moment().subtract(1, 'month'),
                      'month'
                    );

                    if (isPreviousMonth) {
                      return (
                        <div
                          className="data-captured-container__item"
                          key={index}
                          onClick={() => onDataCapturedClick(item)}
                        >
                          <div className="data-captured-container__item--content">
                            <div className="item--content-heading">
                              <h1>{item.location}</h1>
                              <div
                                className={
                                  'item--content-heading__status-active'
                                }
                              >
                                <span>Active</span>
                              </div>
                            </div>
                            <span>
                              {item?.device_id} |{' '}
                              {moment(item?.date_time).format('DD MMM YYYY')}
                            </span>
                          </div>

                          <div
                            className="data-captured-container__item--icon"
                            onClick={() => onDataCapturedClick(item)}
                          >
                            <img src={ArrowRightIcon} alt="Arrow Right Icon" />
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </>
              )}
              <img src={Filter} alt="filter Icon" className="filter-icon" />
            </>
          ) : (
            <div className="data-captured-img-container">
              <img src={image} alt="image" className="data-captured-img" />
              <div className="data-captured-record-container">
                <Button
                  className="data-captured-record-btn"
                  onClick={gotoRecord}
                >
                  Record Data
                </Button>
              </div>
            </div>
          )
        ) : // <>
        //     <div className="data-captured-container__heading">
        //       <h1>This Month</h1>
        //     </div>

        //     {dataCaptured.data.data.map((item, index) => (
        //       <div
        //         className="data-captured-container__item"
        //         key={index}
        //         onClick={() => onDataCapturedClick(item)}
        //       >
        //         <div className="data-captured-container__item--content">
        //           <div className="item--content-heading">
        //             <h1>{item.location}</h1>
        //             <div className={'item--content-heading__status-active'}>
        //               <span>Active</span>
        //             </div>
        //           </div>
        //           <span>
        //             {item?.device_id} |{' '}
        //             {moment(item?.date_time).format('DD MMM YYYY')}
        //           </span>
        //         </div>

        //         <div
        //           className="data-captured-container__item--icon"
        //           onClick={() => onDataCapturedClick(item)}
        //         >
        //           <img src={ArrowRightIcon} alt="Arrow Right Icon" />
        //         </div>
        //       </div>
        //     ))}
        //     <img src={Filter} alt="filter Icon" className="filter-icon" />
        //   </>
        // ) : (
        //   <div className="data-captured-img-container">
        //     <img src={image} alt="image" className="data-captured-img" />
        //     <div className="data-captured-record-container">
        //       <Button
        //         className="data-captured-record-btn"
        //         onClick={gotoRecord}
        //       >
        //         Record Data
        //       </Button>
        //     </div>
        //   </div>
        // )
        dataCapturedOffline && dataCapturedOffline.length > 0 ? (
          <>
            {/* <div className="data-captured-container__heading">
              <h1>This Month</h1>
            </div> */}

            {dataCapturedOffline.map((item, index) => (
              <div
                className="data-captured-container__item"
                key={index}
                // onClick={() => onDataCapturedClick(item)}
              >
                <div className="data-captured-container__item--content">
                  <div className="item--content-heading">
                    <h1>
                      {item?.lat}, {item?.long}
                    </h1>
                    <div className={'item--content-heading__status-inactive'}>
                      <span>Offline</span>
                    </div>
                  </div>
                  <span>
                    {item?.device_id} |{' '}
                    {moment(item?.date_time).format('DD MMM YYYY')}
                  </span>
                </div>
              </div>
            ))}
            <img src={Filter} alt="filter Icon" className="filter-icon" />
          </>
        ) : (
          <OfflineScreen />
        )}
      </div>
    </div>
  );
};

export default DataCaptured;

/**
 *
 * remove last 2 cards
 * add new icon instead of thermometer icon
 */
