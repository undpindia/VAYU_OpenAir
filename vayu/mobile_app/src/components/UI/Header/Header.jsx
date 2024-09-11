import BellIcon from '../../../assets/img/header-icons/bell-icon.svg';
import DotsIcon from '../../../assets/img/header-icons/dots-icon.svg';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';


const Header = ({ heading, subtext = '' }) => {
  const navigate = useNavigate();
  const gotoNotification = () => {
    navigate('/notification');
  };

  const logoutClick = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="header-container__heading-section">
        <h1>{heading}</h1>
        {subtext !== '' && <h3>{subtext}</h3>}
      </div>

      <div className="header-container__icon-section">
        <div className="header-container__icon-section__icon">
          <img src={BellIcon} alt="Bell Icon" onClick={gotoNotification} />
        </div>
        <div
          className="header-container__icon-section__icon"
        ><Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <img src={DotsIcon} alt="Dots Icon" />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="dropdown-menu-item" onClick={() => {
            logoutClick();
          }}>Logout</Dropdown.Item>
            {/* Add other dropdown options */}
          </Dropdown.Menu>
        </Dropdown>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  heading: PropTypes.string.isRequired,
  subtext: PropTypes.string,
};

export default Header;
