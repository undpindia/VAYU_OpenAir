import './Header.scss';
import VayuLogo from '../../assets/images/header/vayu.svg';
import UndpLogo from '../../assets/images/partners/undp.svg';
import { Info } from 'lucide-react';

const Header = ({ toggleMenu, isActive, onHelpClick }) => {
  // console.log('isActive', isActive);
  return (
    <header className="fixed z-[50] top-0 w-full flex justify-between items-center pr-0 px-4 sm:px-12 md:px-16 lg:px-20 xl:px-24 bg-white">
      <div className="mt-6 mb-4">
        <img src={VayuLogo} alt="Vayu Logo" />
      </div>

      <div className="flex">
        <div className="header-button">
          <img src={UndpLogo} alt="UNDP Logo" />
        </div>
        <div className="header-button" onClick={onHelpClick}>
          <Info size={25} color="#31572c" className="border-0" />
        </div>

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
