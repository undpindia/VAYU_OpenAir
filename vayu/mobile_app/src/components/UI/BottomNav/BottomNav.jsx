import HomeIcon from '../../../assets/img/bottom-nav-icons/home.svg';
import AssignedIcon from '../../../assets/img/bottom-nav-icons/assigned.svg';
import RecordIcon from '../../../assets/img/bottom-nav-icons/record.svg';
import DataIcon from '../../../assets/img/bottom-nav-icons/data.svg';
import HomeActiveIcon from '../../../assets/img/bottom-nav-icons/home-active.svg';
import AssignedActiveIcon from '../../../assets/img/bottom-nav-icons/assigned-active.svg';
import RecordActiveIcon from '../../../assets/img/bottom-nav-icons/record-active.svg';
import DataActiveIcon from '../../../assets/img/bottom-nav-icons/data-active.svg';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setLastVisitedLink } from '../../../redux/Profile/profileSlice';

const BottomNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [active, setActive] = useState(0);

  const bottomNavMenu = useMemo(
    () => [
      {
        label: 'Home',
        link: '/home',
        icon: HomeIcon,
        activeIcon: HomeActiveIcon,
      },
      {
        label: 'Assigned',
        link: '/assigned',
        icon: AssignedIcon,
        activeIcon: AssignedActiveIcon,
      },
      {
        label: 'Record',
        link: '/record-location',
        icon: RecordIcon,
        activeIcon: RecordActiveIcon,
      },
      {
        label: 'Data',
        link: '/data-captured',
        icon: DataIcon,
        activeIcon: DataActiveIcon,
      },
    ],
    []
  );

  useEffect(() => {
    const currentPath = location.pathname;
    const foundIndex = bottomNavMenu.findIndex(
      (item) => item.link === currentPath
    );
    if (foundIndex !== -1) {
      setActive(foundIndex);
      dispatch(setLastVisitedLink(currentPath));
    }
  }, [location.pathname, bottomNavMenu, dispatch]);

  const onIconClick = (index, link) => {
    setActive(index);
    dispatch(setLastVisitedLink(link));
    navigate(link);
  };

  // console.log('active', active);

  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav-container__bottom-nav">
        {bottomNavMenu.map((item, index) => (
          <div
            className="bottom-nav-item"
            key={index}
            onClick={() => onIconClick(index, item.link)}
          >
            <div className="bottom-nav-item__icon">
              {active === index ? (
                <img src={item.activeIcon} alt={item.label} />
              ) : (
                <img src={item.icon} alt={item.label} />
              )}
            </div>
            <div
              className={
                active === index
                  ? 'bottom-nav-item__text-active'
                  : 'bottom-nav-item__text'
              }
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
