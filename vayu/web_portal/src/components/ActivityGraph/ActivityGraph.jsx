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

  // const isLeapYear = (year) => {
  //   return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  // };

  const getStartAndEndDates = (data) => {
    let startDate = null;
    let endDate = null;

    data.forEach((yearData) => {
      const { data: monthsData } = yearData;

      Object.keys(monthsData).forEach((month) => {
        const dates = monthsData[month].map((entry) => entry.date);

        // Update startDate if it's earlier than the current startDate
        dates.forEach((date) => {
          if (!startDate || new Date(date) < new Date(startDate)) {
            startDate = date;
          }
        });

        // Update endDate if it's later than the current endDate
        dates.forEach((date) => {
          if (!endDate || new Date(date) > new Date(endDate)) {
            endDate = date;
          }
        });
      });
    });

    return { startDate, endDate };
  };

  const { startDate, endDate } = getStartAndEndDates(data);

  const hasMoreThanThreeObjects = (data) => {
    let totalObjects = 0;

    // Iterate through each year entry
    data.forEach((yearData) => {
      const { data: monthsData } = yearData;

      // Add the number of months (keys) to the total count
      totalObjects += Object.keys(monthsData).length;
    });

    // Check if the total count exceeds 3
    return totalObjects > 3;
  };

  const isMobileOrTablet = () => {
    return window.matchMedia('(max-width: 1024px)').matches; // Adjust the breakpoint as needed
  };

  const showScrollButtons = isMobileOrTablet() || hasMoreThanThreeObjects(data);

  return (
    <Fragment>
      <div className="p-4 flex items-center justify-end">
        <p className="font-medium text-[20px] leading-[25.1px] text-[#434343]">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </div>

      <div
        className={`flex items-center space-x-2 ${
          showScrollButtons ? 'justify-start' : 'justify-center'
        }`}
      >
        {showScrollButtons && (
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
        )}

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
                      startDate={startDate - 1}
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

        {showScrollButtons && (
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
        )}
      </div>

      <div className="flex flex-col items-center relative">
        <div className="relative flex items-center w-[50%] h-4 border border-gray-300 rounded-sm">
          <div
            className="w-full h-full rounded-sm"
            style={{
              background: `linear-gradient(to right, #ECF2EA,  #D7EED2,  #D1ECC8, #CBEAC5,  #B5E1B0, #AEDDA9,  #93CF91,  #75BD78,  #80C481,  #6CB771,  #61B068,  #59AA62,  #4FA25A, #3D944E,  #2D8643,  #1A6F33,  #1A6F33)`,
            }}
          ></div>
        </div>
        <div className="relative flex justify-between w-[50%] mt-2 text-sm">
          <span>Low</span>

          <span>High</span>
        </div>
      </div>
    </Fragment>
  );
};

export default ActivityGraph;
