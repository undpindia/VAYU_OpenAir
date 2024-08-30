import { Fragment, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from '../BottomNav/BottomNav';
import DataSyncOnline from '../OfflineScreen/DataSyncOnline';
// import { selectOfflineData } from '../../../redux/offlineData/offlineDataSlice';
import { useSelector } from 'react-redux';
import { selectUserApproved } from '../../../redux/userApproval/userApproval';
const Layout = () => {
  const location = useLocation();
  // const offlineData = useSelector(selectOfflineData);
  const isApproved = useSelector(selectUserApproved);
  // console.log('offlineData', offlineData);

  const [offlineFormDataArray, setOfflineFormDataArray] = useState([]);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncPopupOpen, setIsSyncPopupOpen] = useState(false);
  const routes = useMemo(
    () => [
      '/home',
      '/assigned',
      '/data-captured',
    ],
    []
  );
  // console.log('isSyncPopupOpen', isSyncPopupOpen);
  const fetchOfflineFormDataFromLocalStorage = () => {
    // Retrieve the array of serialized FormData entries from localStorage
    const storedSerializedFormDataArray =
      JSON.parse(localStorage.getItem('formDataArray')) || [];

    setOfflineFormDataArray(storedSerializedFormDataArray);
  };
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setIsSyncPopupOpen(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setIsSyncPopupOpen(true);
      fetchOfflineFormDataFromLocalStorage();
    };
    if (navigator.onLine) {
      fetchOfflineFormDataFromLocalStorage();
      setIsSyncPopupOpen(true);
    } else {
      console.log();
    }
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return routes.includes(location.pathname) ? (
    <Fragment>
      {isSyncPopupOpen &&
        !isOffline &&
        offlineFormDataArray?.length > 0 &&
        routes.includes(location.pathname) && (
          <DataSyncOnline
            setIsSyncPopupOpen={setIsSyncPopupOpen}
            setOfflineFormDataArray={setOfflineFormDataArray}
          />
        )}

      <Outlet />
      {isApproved === true || isApproved === null ? <BottomNav /> : null}
    </Fragment>
  ) : (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};
export default Layout;
