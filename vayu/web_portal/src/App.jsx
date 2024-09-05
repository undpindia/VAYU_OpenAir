import { useState } from 'react';
import Layout from './components/layout/layout';
import Sections from './pages/Sections/Sections';
import Dashboard from './pages/Dashboard/Dashboard';
import { Seo } from './Seo';
import Image from './assets/images/header/logo.png'
const App = () => {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);

    // console.log('isMenuActive', isMenuActive);

    // if (isMenuActive) {
    //   window.location.reload();
    // }
  };

  return (
    <div className="no-scrollbar">
        <Seo
        title="Vayu"
        description="Hyperlocal Mapping of Air Pollution project is part of the Climate & Energy Lacuna Fund cohort of 2023."
        type="webapp"
        name="Vayu"
        image={Image}
      />
      <Layout isActive={isMenuActive} toggleMenu={toggleMenu}>
        {isMenuActive && <Sections />}
        <div
          className={
            isMenuActive
              ? 'invisible pointer-events-none overflow-hidden h-0'
              : 'visible'
          }
        >
          <Dashboard />
        </div>
      </Layout>
    </div>
  );
};

export default App;
