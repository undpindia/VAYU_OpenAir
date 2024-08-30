import { useState, useEffect } from 'react';
import ODSImage from '@/assets/images/common/ods.svg';

const OpenDataStack = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check screen size on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-start flex-col mt-10 pb-10">
      {!isMobile && (
        <span className="font-normal text-[20px] leading-[28.16px] p-[5px] text-justify invisible">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat,
          doloribus! Eaque ab cupiditate molestias fugiat sit facere quia.
          Facere, iure accusantium impedit voluptatibus ipsum ea modi obcaecati?
          Provident, dolorum sit!
        </span>
      )}

      <div className="p-[5px] flex justify-center w-full">
        <img src={ODSImage} alt="Data Collection" className="w-full h-auto" />
      </div>

      {!isMobile && (
        <span className="font-normal text-[20px] leading-[28.16px] p-[5px] text-justify invisible">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat,
          doloribus! Eaque ab cupiditate molestias fugiat sit facere quia.
          Facere, iure accusantium impedit voluptatibus ipsum ea modi obcaecati?
          Provident, dolorum sit!
        </span>
      )}
    </div>
  );
};

export default OpenDataStack;
