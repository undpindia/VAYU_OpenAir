import { motion, useAnimation } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import AboutUs from './AboutUs/AboutUs';
import OurPartners from './OurPartners/OurPartners';
import DataCollection from './DataCollection/DataCollection';
import Feedback from './Feedback/Feedback';
// import OpenDataStack from './OpenDataStack/OpenDataStack';
import CitizenScientist from './CitizenScientist/CitizenScientist';
// import KnowledgeHub from './KnowledgeHub/KnowledgeHub';

const Sections = () => {
  const [selectedSection, setSelectedSection] = useState(0);
  const sectionRefs = useRef([]);
  const controls = useAnimation();

  const sections = [
    {
      title: 'ABOUT PROJECT',
      content: <AboutUs />,
    },
    {
      title: 'OUR PARTNERS',
      content: <OurPartners />,
    },
    // {
    //   title: 'KNOWLEDGE HUB',
    //   content: <KnowledgeHub />,
    // },
    {
      title: 'DATA COLLECTION',
      content: <DataCollection />,
    },
    // {
    //   title: 'OPEN DATA STACK',
    //   content: <OpenDataStack />,
    // },
    {
      title: 'CITIZEN SCIENTIST VOLUNTEERS',
      content: <CitizenScientist />,
    },
    {
      title: 'FEEDBACK',
      content: <Feedback />,
    },
  ];

  const handleSectionClick = (index) => {
    setSelectedSection(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = useCallback(() => {
    const sectionPositions = sectionRefs.current.map(
      (ref) => ref.getBoundingClientRect().top
    );
    const index =
      sectionPositions.findIndex((pos) => pos > window.innerHeight / 2) - 1;
    setSelectedSection(index >= 0 ? index : sections.length - 1);
  }, [sections.length]);

  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:max-h-screen xl:max-h-screen overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden md:block md:w-1/2 bg-white">
        <div className="h-full bg-white flex flex-col items-start justify-center md:mt-6 lg:mt-0">
          <div className="space-y-6 lg:space-y-6 md:space-y-2">
            {sections.map((section, index) => (
              <h1
                key={index}
                onClick={() => handleSectionClick(index)}
                className={`text-[60px] md:text-[35px] lg:text-[55px] leading-[73.8px] lg:leading-[55px] md:leading-[40px] tracking-[0.04em] cursor-pointer font-bold `}
                style={{
                  color: selectedSection === index ? '#31572C' : '#A6C9A1',
                }}
              >
                {section.title}
              </h1>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 p-0 overflow-y-scroll scroll-container no-scrollbar">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="h-full mb-5 flex items-center justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center md:flex-row">
              <h1
                onClick={() => handleSectionClick(index)}
                className={`cursor-pointer text-2xl font-bold md:hidden ${
                  index === 0 ? 'mt-24' : 'mt-10 text-center'
                } mb-4`}
                style={{
                  color: selectedSection === index ? '#31572C' : '#A6C9A1',
                }}
              >
                {section.title}
              </h1>
              <div
                className={`${
                  section.title === 'DATA COLLECTION' &&
                  'h-full overflow-auto no-scrollbar mt-4'
                }`}
              >
                {section.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Sections;

//bg-white shadow-lg rounded-lg p-8 ->right card
