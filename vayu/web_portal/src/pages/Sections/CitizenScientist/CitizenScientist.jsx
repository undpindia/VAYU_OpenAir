import { useState, useEffect } from 'react';
import './CitizenScientist.scss';
import img1 from '../../../assets/images/volunteers/img1.jpeg';
import img2 from '../../../assets/images/volunteers/img2.jpeg';
import img3 from '../../../assets/images/volunteers/img3.jpeg';
import img4 from '../../../assets/images/volunteers/img4.jpeg';
import img5 from '../../../assets/images/volunteers/img5.jpeg';
import img6 from '../../../assets/images/volunteers/img6.jpeg';
import img7 from '../../../assets/images/volunteers/img7.jpeg';

const CitizenScientist = () => {
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

      <div className="image-container">
        <img src={img1} alt="Volunteer 1" />
        <img src={img2} alt="Volunteer 2" />
        <img src={img3} alt="Volunteer 3" />
        <img src={img4} alt="Volunteer 4" />
        <img src={img5} alt="Volunteer 5" />
        <img src={img6} alt="Volunteer 6" />
        <img src={img7} alt="Volunteer 7" />
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

export default CitizenScientist;
