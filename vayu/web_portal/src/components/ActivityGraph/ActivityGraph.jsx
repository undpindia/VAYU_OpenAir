// import CalendarHeatmap from 'react-calendar-heatmap';
// import 'react-calendar-heatmap/dist/styles.css';
// import './ActivityGraph.scss';
// import { Fragment, useEffect, useRef, useState } from 'react'; //useMemo
// import moment from 'moment';
// import { Button } from '../ui/button';
// import { ArrowLeft, ArrowRight } from 'lucide-react';

// const colorScaleSummary = (number) => {
//   if (number <= 500) return 'color-scale-0';
//   if (number <= 1000) return 'color-scale-1';
//   if (number <= 1500) return 'color-scale-2';
//   if (number <= 2000) return 'color-scale-3';
//   if (number <= 2500) return 'color-scale-4';
//   if (number <= 3000) return 'color-scale-5';
//   if (number <= 3500) return 'color-scale-6';
//   if (number <= 4000) return 'color-scale-7';
//   if (number <= 4500) return 'color-scale-8';
//   if (number <= 5000) return 'color-scale-9';
//   if (number <= 5500) return 'color-scale-10';
//   if (number <= 6000) return 'color-scale-11';
//   if (number <= 6500) return 'color-scale-12';
//   if (number <= 7000) return 'color-scale-13';
//   if (number <= 7500) return 'color-scale-14';
//   return 'color-scale-15'; // Darkest shade for numbers above 7500
// };

// const ActivityGraph = ({ data }) => {
//   const currentYear = new Date().getFullYear();
//   const [selectedYear] = useState(currentYear); //setSelectedYear
//   const selectedData =
//     data.find((yearData) => yearData.year === selectedYear) || data[0];

//   // Function to get start and end dates of a month
//   const getMonthDates = (year, month) => {
//     const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
//     const startDate = new Date(year, monthIndex, 1);
//     const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month
//     return { startDate, endDate };
//   };

//   // const ranges = [
//   //   { min: 0, max: 500, colorClass: 'color-scale-0' },
//   //   { min: 501, max: 1000, colorClass: 'color-scale-1' },
//   //   { min: 1001, max: 1500, colorClass: 'color-scale-2' },
//   //   { min: 1501, max: 2000, colorClass: 'color-scale-3' },
//   //   { min: 2001, max: 2500, colorClass: 'color-scale-4' },
//   //   { min: 2501, max: 3000, colorClass: 'color-scale-5' },
//   //   { min: 3001, max: 3500, colorClass: 'color-scale-6' },
//   //   { min: 3501, max: 4000, colorClass: 'color-scale-7' },
//   //   { min: 4001, max: 4500, colorClass: 'color-scale-8' },
//   //   { min: 4501, max: 5000, colorClass: 'color-scale-9' },
//   //   { min: 5001, max: 5500, colorClass: 'color-scale-10' },
//   //   { min: 5501, max: 6000, colorClass: 'color-scale-11' },
//   //   { min: 6001, max: 6500, colorClass: 'color-scale-12' },
//   //   { min: 6501, max: 7000, colorClass: 'color-scale-13' },
//   //   { min: 7001, max: 7500, colorClass: 'color-scale-14' },
//   //   { min: 7501, max: Infinity, colorClass: 'color-scale-15' },
//   // ];

//   // const getColor = (colorClass) => {
//   //   const colorMap = {
//   //     'color-scale-0': '#D7EED2', // 0 to 500
//   //     'color-scale-1': '#D1ECC8', // 501 to 1000
//   //     'color-scale-2': '#CBEAC5', // 1001 to 1500
//   //     'color-scale-3': '#B5E1B0', // 1501 to 2000
//   //     'color-scale-4': '#AEDDA9', // 2001 to 2500
//   //     'color-scale-5': '#93CF91', // 2501 to 3000
//   //     'color-scale-6': '#75BD78', // 3001 to 3500
//   //     'color-scale-7': '#80C481', // 3501 to 4000
//   //     'color-scale-8': '#6CB771', // 4001 to 4500
//   //     'color-scale-9': '#61B068', // 4501 to 5000
//   //     'color-scale-10': '#59AA62', // 5001 to 5500
//   //     'color-scale-11': '#4FA25A', // 5501 to 6000
//   //     'color-scale-12': '#3D944E', // 6001 to 6500
//   //     'color-scale-13': '#2D8643', // 6501 to 7000
//   //     'color-scale-14': '#1A6F33', // 7001 to 7500
//   //     'color-scale-15': '#1A6F33', // 7501 to Infinity
//   //     'color-empty': '#ECF2EA', // Default or empty
//   //   };
//   //   return colorMap[colorClass] || '#ECF2EA';
//   // };

//   // Get the active ranges based on the actual data
//   // const activeRanges = useMemo(() => {
//   //   const counts = Object.values(selectedData.data)
//   //     .flat()
//   //     .map((d) => d.count);
//   //   const min = Math.min(...counts);
//   //   const max = Math.max(...counts);

//   //   return ranges.filter(
//   //     (range) =>
//   //       (range.min <= max && range.max >= min) ||
//   //       (range.min >= min && range.max <= max)
//   //   );
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [selectedData]);

//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     x: 0,
//     y: 0,
//     content: '',
//   });

//   const handleMouseOver = (event, value) => {
//     if (value && value.date) {
//       const rect = event.target.getBoundingClientRect();
//       const tooltipX = rect.left + window.scrollX;
//       const tooltipY = rect.top + window.scrollY;

//       setTooltip({
//         visible: true,
//         x: tooltipX,
//         y: tooltipY,
//         content: `Date : ${moment(value.date).format(
//           'DD.MM.YYYY'
//         )}  |  Count : ${value.count}`,
//       });
//     } else {
//       const rect = event.target.getBoundingClientRect();
//       const tooltipX = rect.left + window.scrollX;
//       const tooltipY = rect.top + window.scrollY;

//       setTooltip({
//         visible: true,
//         x: tooltipX,
//         y: tooltipY,
//         content: `No data available`,
//       });
//     }
//   };

//   const handleMouseLeave = () => {
//     setTooltip({ visible: false, x: 0, y: 0, content: '' });
//   };

//   const getDateRange = (selectedData) => {
//     if (!selectedData || selectedData.length === 0)
//       return { startDate: '', endDate: '' };

//     const months = Object.keys(selectedData.data);

//     // Determine the first and last months
//     const firstMonth = months[0];
//     const lastMonth = months[months.length - 1];

//     // Define the year
//     const year = selectedData.year;

//     // Get the first date of the first month
//     const startDate = new Date(`${year}-${firstMonth}-01`);

//     // Get the last date of the last month
//     const endDate = new Date(`${year}-${lastMonth}-01`);
//     endDate.setMonth(endDate.getMonth() + 1);
//     endDate.setDate(0); // Set to the last day of the previous month

//     // Function to format the date as "01 Jun 2024"
//     const formatDate = (date) => {
//       const options = { day: '2-digit', month: 'short', year: 'numeric' };
//       return date.toLocaleDateString('en-GB', options);
//     };

//     return {
//       startDate: formatDate(startDate), // "01 Jun 2024"
//       endDate: formatDate(endDate), // "31 Aug 2024"
//     };
//   };

//   const { startDate, endDate } = getDateRange(selectedData);

//   // SCROLL EFFECT USING BUTTONS
//   const scrollContainerRef = useRef(null);
//   const [isAtStart, setIsAtStart] = useState(true);
//   const [isAtEnd, setIsAtEnd] = useState(false);

//   // Scroll to the left
//   const scrollLeft = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   // Scroll to the right
//   const scrollRight = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   // Update button states based on scroll position
//   const updateScrollState = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } =
//         scrollContainerRef.current;

//       setIsAtStart(scrollLeft === 0);
//       // setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
//       setIsAtEnd(scrollLeft + clientWidth + 100 >= scrollWidth);
//     }
//   };

//   // Add scroll listener
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       container.addEventListener('scroll', updateScrollState);
//       updateScrollState(); // Initial check

//       return () => {
//         container.removeEventListener('scroll', updateScrollState);
//       };
//     }
//   }, []);

//   return (
//     <Fragment>
//       <div className="p-4 flex items-center justify-end">
//         <p className="font-medium text-[20px] leading-[25.1px] text-[#434343]">
//           {startDate} - {endDate}
//         </p>
//       </div>

//       <div className="flex items-center space-x-2">
//         <Button
//           onClick={scrollLeft}
//           disabled={isAtStart}
//           className={`bg-[#2D8643] text-white p-3 w-11 h-11 rounded-full transform -translate-y-1/2 focus:outline-none hover:bg-[#61B068] ${
//             isAtStart ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           style={{ position: 'sticky', left: 0 }}
//         >
//           <ArrowLeft size={20} />
//         </Button>

//         <div
//           className="flex justify-start items-center space-x-8 overflow-x-auto py-4 no-scrollbar"
//           ref={scrollContainerRef}
//         >
//           {Object.entries(selectedData.data).map(([month, monthData]) => {
//             const { startDate, endDate } = getMonthDates(selectedYear, month);

//             return (
//               <div key={month} className="flex flex-col items-center">
//                 <div className="w-[300px] h-[300px] flex flex-col justify-between">
//                   <CalendarHeatmap
//                     startDate={startDate - 1}
//                     endDate={endDate}
//                     values={monthData}
//                     onClick={(value) => console.log(value)}
//                     gutterSize={3}
//                     classForValue={(value) => {
//                       if (!value) {
//                         return 'color-empty';
//                       }
//                       return colorScaleSummary(value?.count);
//                     }}
//                     showMonthLabels={false}
//                     showWeekdayLabels={false}
//                     onMouseOver={handleMouseOver}
//                     onMouseLeave={handleMouseLeave}
//                   />
//                   {tooltip.visible && (
//                     <div
//                       className="absolute z-50 px-3 py-2 bg-gray-700 text-white text-sm rounded"
//                       style={{
//                         top: tooltip.y - 160, // Adjust to position above the tile
//                         left: tooltip.x,
//                         transform: 'translateX(-50%)',
//                       }}
//                     >
//                       <span className="text-[18px]">{tooltip.content}</span>
//                     </div>
//                   )}
//                 </div>
//                 <h1 className="mt-2 text-lg font-normal">
//                   {month} {selectedYear}
//                 </h1>
//               </div>
//             );
//           })}
//         </div>

//         <Button
//           onClick={scrollRight}
//           disabled={isAtEnd}
//           className={`bg-[#2D8643] text-white p-3 w-11 h-11 rounded-full transform -translate-y-1/2 focus:outline-none hover:bg-[#61B068] ${
//             isAtEnd ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           style={{ position: 'sticky', right: 0 }}
//         >
//           <ArrowRight size={20} />
//         </Button>
//       </div>
//       <div className="flex flex-col items-center relative">
//         {/* <div className="mb-2 text-center text-lg font-normal">
//           Data Point Trends
//         </div> */}
//         <div className="relative flex items-center w-[50%] h-4 border border-gray-300 rounded-sm">
//           {/* <div
//             className="w-full h-full rounded-sm"
//             style={{
//               background: `linear-gradient(to right, #ECF2EA, ${activeRanges
//                 .map((range) => `${getColor(range.colorClass)}`)
//                 .join(', ')})`,
//             }}
//           ></div> */}

//           <div
//             className="w-full h-full rounded-sm"
//             style={{
//               background: `linear-gradient(to right, #ECF2EA,  #D7EED2,  #D1ECC8, #CBEAC5,  #B5E1B0, #AEDDA9,  #93CF91,  #75BD78,  #80C481,  #6CB771,  #61B068,  #59AA62,  #4FA25A, #3D944E,  #2D8643,  #1A6F33,  #1A6F33)`,
//             }}
//           ></div>

//           {/* Markers for each range */}
//           {/* {activeRanges.map((range, index) => (
//             <div
//               key={index}
//               className="absolute h-5 w-0.5 bg-[#444950] top-0"
//               style={{
//                 left: `${(index / (activeRanges.length - 1)) * 100}%`,
//                 transform: 'translateX(-60%)',
//               }}
//             ></div>
//           ))} */}
//           {/* Middle Marker */}
//           {/* <div
//             className="absolute h-5 w-0.5 bg-[#444950] top-0"
//             style={{
//               left: '50%',
//               transform: 'translateX(-50%)',
//             }}
//           ></div> */}
//         </div>
//         <div className="relative flex justify-between w-[50%] mt-2 text-sm">
//           {/* <span>{activeRanges[0]?.min || 0}</span>
//           <span>
//             {activeRanges[Math.floor(activeRanges.length / 2)]?.min || 0}
//           </span>
//           <span>{activeRanges[activeRanges.length - 1]?.max || 0}</span> */}

//           <span>Low</span>

//           <span>High</span>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default ActivityGraph;

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './ActivityGraph.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const colorScaleSummary = (number) => {
  if (number <= 500) return 'color-scale-0';
  if (number <= 1000) return 'color-scale-1';
  if (number <= 1500) return 'color-scale-2';
  if (number <= 2000) return 'color-scale-3';
  if (number <= 2500) return 'color-scale-4';
  if (number <= 3000) return 'color-scale-5';
  if (number <= 3500) return 'color-scale-6';
  if (number <= 4000) return 'color-scale-7';
  if (number <= 4500) return 'color-scale-8';
  if (number <= 5000) return 'color-scale-9';
  if (number <= 5500) return 'color-scale-10';
  if (number <= 6000) return 'color-scale-11';
  if (number <= 6500) return 'color-scale-12';
  if (number <= 7000) return 'color-scale-13';
  if (number <= 7500) return 'color-scale-14';
  return 'color-scale-15';
};

const ActivityGraph = ({ data }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  const handleMouseOver = (event, value) => {
    if (value && value.date) {
      const rect = event.target.getBoundingClientRect();
      const tooltipX = rect.left + window.scrollX;
      const tooltipY = rect.top + window.scrollY;

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        content: `Date : ${moment(value.date).format(
          'DD.MM.YYYY'
        )}  |  Count : ${value.count}`,
      });
    } else {
      const rect = event.target.getBoundingClientRect();
      const tooltipX = rect.left + window.scrollX;
      const tooltipY = rect.top + window.scrollY;

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        content: `No data available`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  };

  const scrollContainerRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth + 100 >= scrollWidth);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollState);
      updateScrollState();

      return () => {
        container.removeEventListener('scroll', updateScrollState);
      };
    }
  }, []);

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getStartAndEndDates = (data) => {
    const months = {
      January: 31,
      February: 28, // Default days for February, will adjust for leap years
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };

    let startDate = null;
    let endDate = null;

    data.forEach((yearData) => {
      const { year, data: monthsData } = yearData;

      // Adjust February for leap years
      if (isLeapYear(year)) {
        months['February'] = 29;
      } else {
        months['February'] = 28;
      }

      Object.keys(monthsData).forEach((month, index) => {
        if (!startDate) {
          startDate = `${year}-${String(index + 1).padStart(2, '0')}-01`;
        }
        const lastDay = months[month];
        endDate = `${year}-${String(index + 1).padStart(2, '0')}-${lastDay}`;
      });
    });

    return { startDate, endDate };
  };

  const { startDate, endDate } = getStartAndEndDates(data);

  return (
    <Fragment>
      <div className="p-4 flex items-center justify-end">
        <p className="font-medium text-[20px] leading-[25.1px] text-[#434343]">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={scrollLeft}
          disabled={isAtStart}
          className={`bg-[#2D8643] text-white p-3 w-11 h-11 rounded-full transform -translate-y-1/2 focus:outline-none hover:bg-[#61B068] ${
            isAtStart ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ position: 'sticky', left: 0 }}
        >
          <ArrowLeft size={20} />
        </Button>

        <div
          className="flex justify-start items-center space-x-8 overflow-x-auto py-4 no-scrollbar"
          ref={scrollContainerRef}
        >
          {data.map((yearData) => {
            return Object.entries(yearData.data).map(([month, monthData]) => {
              const startDate = new Date(`${yearData.year}-${month}-01`);
              const endDate = new Date(
                yearData.year,
                startDate.getMonth() + 1,
                0
              );

              return (
                <div
                  key={`${yearData.year}-${month}`}
                  className="flex flex-col items-center"
                >
                  <div className="w-[300px] h-[300px] flex flex-col justify-between">
                    <CalendarHeatmap
                      startDate={startDate}
                      endDate={endDate}
                      values={monthData}
                      onClick={(value) => console.log(value)}
                      gutterSize={3}
                      classForValue={(value) => {
                        if (!value) {
                          return 'color-empty';
                        }
                        return colorScaleSummary(value?.count);
                      }}
                      showMonthLabels={false}
                      showWeekdayLabels={false}
                      onMouseOver={handleMouseOver}
                      onMouseLeave={handleMouseLeave}
                    />
                    {tooltip.visible && (
                      <div
                        className="absolute z-50 px-3 py-2 bg-gray-700 text-white text-sm rounded"
                        style={{
                          top: tooltip.y - 160,
                          left: tooltip.x,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <span className="text-[18px]">{tooltip.content}</span>
                      </div>
                    )}
                  </div>
                  <h1 className="mt-2 text-lg font-normal">
                    {month} {yearData.year}
                  </h1>
                </div>
              );
            });
          })}
        </div>

        <Button
          onClick={scrollRight}
          disabled={isAtEnd}
          className={`bg-[#2D8643] text-white p-3 w-11 h-11 rounded-full transform -translate-y-1/2 focus:outline-none hover:bg-[#61B068] ${
            isAtEnd ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ position: 'sticky', right: 0 }}
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </Fragment>
  );
};

export default ActivityGraph;
