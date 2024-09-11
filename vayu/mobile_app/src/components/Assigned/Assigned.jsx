import { useState, useEffect, useRef, Fragment } from 'react';
import Header from '../UI/Header/Header';
import { Tab, Tabs } from 'react-bootstrap';
import AssignedNew from './AssignedNew';
import AssignedCompleted from './AssignedCompleted';
import image from '../../assets/img/images/assigned.svg';
import { getAssignedRecord } from '../../api/ApiService';
import OfflineScreen from '../UI/OfflineScreen/OfflineScreen';
import CircularLoader from '../UI/CircularLoader/CircularLoader';

const Assigned = () => {
  const [key, setKey] = useState('new');
  const user_id = localStorage.getItem('user_id');
  const [isLoading, setIsLoading] = useState(false);

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  // console.log('isOnline', isOnline);

  const [newRecords, setNewRecords] = useState([]);
  const [completedRecords, setCompletedRecords] = useState([]);

  const getAssigned = useRef(async () => {
    const bodyparam = {
      user_id: user_id,
    };
    try {
      const response = await getAssignedRecord(
        localStorage.getItem('access_token'),
        bodyparam
      );

      const newData = response.data.data || [];

      const newItems = newData.filter((item) => item.status === 'New');
      const completeItems = newData.filter(
        (item) => item.status === 'Complete'
      );

      // Set the state or perform further operations as needed
      setNewRecords(newItems);
      setCompletedRecords(completeItems);
      setIsLoading(true);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  });

  useEffect(() => {
    getAssigned.current();
  }, []);

  const refreshAssignedData = async () => {
    await getAssigned.current();
  };

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

  return (
    <Fragment>
      <Header heading="Assigned" />
      {isOnline ? (
        isLoading ? 
        <div className="assigned-container">
          <div>
            <div className="assigned-tab-btn">
              <Tabs
                className="controlled-tabs"
                id="controlled-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
              >
                <Tab eventKey="new" title="New"></Tab>
                <Tab eventKey="completed" title="Completed"></Tab>
              </Tabs>
            </div>

            {key === 'new' &&
              (newRecords && newRecords.length > 0 ? (
                <AssignedNew
                  data={newRecords}
                  refreshAssignedData={refreshAssignedData}
                />
              ) : (
                <div className="assigned-img-container">
                  <img src={image} alt="image" className="assigned-img" />
                </div>
              ))}

            {key === 'completed' &&
              (completedRecords && completedRecords.length > 0 ? (
                <AssignedCompleted
                  data={completedRecords}
                  refreshAssignedData={refreshAssignedData}
                />
              ) : (
                <div className="assigned-img-container">
                  <img src={image} alt="image" className="assigned-img" />
                </div>
              ))}
          </div>
        </div>
        :
        <><CircularLoader/></>
      ) : (
        <div className="assigned-container">
          <OfflineScreen />
        </div>
      )}
    </Fragment>
  );
};

export default Assigned;
