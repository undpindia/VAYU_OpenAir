import { useNavigate } from 'react-router-dom';
import BellIcon from '../../../assets/img/header-icons/bell-icon.svg';
import ArrowLeft from '../../../assets/img/header-icons/arrow-left.svg';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const Header2 = ({ heading, subtext = '', showNotification = true }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

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
    if (isOnline) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };
  const gotoNotification = () => {
    navigate('/notification');
  };
  return (
    <div className="header2-container">
      <div className="header2-container__icon-section_2">
        <div className="header-container__icon-section_2__icon">
          <img src={ArrowLeft} alt="Dots Icon" onClick={goBack} />
        </div>

        <div className="header2-container__heading-section">
          <h1>{heading}</h1>
          {subtext !== '' && <h3>{subtext}</h3>}
        </div>
        <div></div>
        <div className="header2-container__icon-section_2__icon">
          {showNotification && (
            <img src={BellIcon} alt="Bell Icon" onClick={gotoNotification} />
          )}
        </div>
      </div>
    </div>
  );
};

Header2.propTypes = {
  heading: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  showNotification: PropTypes.bool,
};

export default Header2;
