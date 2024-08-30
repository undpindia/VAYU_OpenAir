import './Header.scss';
import VayuLogo from '../../assets/images/header/vayu.svg';
import UndpLogo from '../../assets/images/partners/undp.svg';

const Header = ({ toggleMenu, isActive }) => {
  // console.log('isActive', isActive);
  return (
    <header className="fixed z-[50] top-0 w-full flex justify-between items-center px-10 sm:px-12 md:px-16 lg:px-20 xl:px-24 bg-white">
      <div className="mt-6">
        <img src={VayuLogo} alt="Vayu Logo" />
      </div>

      <div className="flex">
        <img src={UndpLogo} alt="UNDP Logo" />
        <div onClick={toggleMenu} className="header-button">
          <div
            className={`header-burger ${isActive ? 'header-burgerActive' : ''}`}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
