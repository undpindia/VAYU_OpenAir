import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './ActivityGraph.scss';
import { Fragment, useState, useMemo } from 'react';

// Function to get the color class based on the count
const colorScaleSummary = (number) => {
  switch (true) {
    case number > 1 && number <= 999:
      return 'color-scale-0';
    case number >= 1000 && number <= 5000:
      return 'color-scale-1';
    case number >= 5001 && number <= 10000:
      return 'color-scale-2';
    case number >= 10001 && number <= 15000:
      return 'color-scale-3';
    case number >= 15001 && number <= 20000:
      return 'color-scale-4';
    case number >= 20001 && number <= 25000:
      return 'color-scale-5';
    case number >= 25001 && number <= 30000:
      return 'color-scale-6';
    case number > 30000:
      return 'color-scale-7';
    default:
      return 'color-empty';
  }
};

const ActivityGraph = ({ data }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear] = useState(currentYear); //setSelectedYear
  const selectedData =
    data.find((yearData) => yearData.year === selectedYear) || data[0];

  // Function to get start and end dates of a month
  const getMonthDates = (year, month) => {
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month
    return { startDate, endDate };
  };

  const ranges = [
    { min: 0, max: 1000, colorClass: 'color-scale-0' },
    { min: 1000, max: 5000, colorClass: 'color-scale-1' },
    { min: 5001, max: 10000, colorClass: 'color-scale-2' },
    { min: 10001, max: 15000, colorClass: 'color-scale-3' },
    { min: 15001, max: 20000, colorClass: 'color-scale-4' },
    { min: 20001, max: 25000, colorClass: 'color-scale-5' },
    { min: 25001, max: 30000, colorClass: 'color-scale-6' },
    { min: 30001, max: Infinity, colorClass: 'color-scale-7' },
  ];

  const getColor = (colorClass) => {
    const colorMap = {
      'color-scale-0': '#dcf2b6',
      'color-scale-1': '#b8f357',
      'color-scale-2': '#42d40f',
      'color-scale-3': '#42b919',
      'color-scale-4': '#0ca00c',
      'color-scale-5': '#058505',
      'color-scale-6': '#036603',
      'color-scale-7': '#011001',
      'color-empty': '#d7eed2',
    };
    return colorMap[colorClass] || '#d7eed2';
  };

  // Get the active ranges based on the actual data
  const activeRanges = useMemo(() => {
    const counts = Object.values(selectedData.data)
      .flat()
      .map((d) => d.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    return ranges.filter(
      (range) =>
        (range.min <= max && range.max >= min) ||
        (range.min >= min && range.max <= max)
    );
  }, [selectedData]);

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
        content: `${value.date} has count: ${value.count}`,
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

  const getDateRange = (selectedData) => {
    if (!selectedData || selectedData.length === 0)
      return { startDate: '', endDate: '' };

    const { data } = selectedData[0];
    const months = Object.keys(data);

    if (months.length === 0) return { startDate: '', endDate: '' };

    const firstMonth = months[0];
    const lastMonth = months[months.length - 1];

    const firstDate = new Date(data[firstMonth][0].date);
    const lastDate = new Date(data[lastMonth][data[lastMonth].length - 1].date);

    const options = { year: 'numeric', month: 'short' };

    return {
      startDate: firstDate.toLocaleDateString('en-US', options),
      endDate: lastDate.toLocaleDateString('en-US', options),
    };
  };

  const { startDate, endDate } = getDateRange(data);

  return (
    <Fragment>
      <div className="p-4 flex items-center justify-end">
        <p className="font-medium text-[20px] leading-[25.1px] text-[#434343]">
          {startDate} - {endDate}
        </p>
      </div>
      <div className="flex justify-start md:justify-center items-center space-x-8 overflow-x-auto py-4 no-scrollbar">
        {Object.entries(selectedData.data).map(([month, monthData]) => {
          const { startDate, endDate } = getMonthDates(selectedYear, month);

          return (
            <div key={month} className="flex flex-col items-center">
              <div className="w-[300px] h-[300px] flex flex-col justify-between">
                <CalendarHeatmap
                  startDate={startDate - 1}
                  endDate={endDate}
                  values={monthData}
                  onClick={(value) => console.log(value)}
                  gutterSize={4}
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
                    className="absolute z-10 px-3 py-2 bg-gray-700 text-white text-sm rounded"
                    style={{
                      top: tooltip.y - 140, // Adjust to position above the tile
                      left: tooltip.x,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <span className="text-[18px]">{tooltip.content}</span>
                  </div>
                )}
              </div>
              <h1 className="mt-2 text-lg font-normal">
                {month} {selectedYear}
              </h1>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center relative">
        <div className="mb-2 text-center text-lg font-normal">
          Data Point Trends
        </div>
        <div className="relative flex items-center w-[50%] h-4 border border-gray-300 rounded-sm">
          <div
            className="w-full h-full rounded-sm"
            style={{
              background: `linear-gradient(to right, ${activeRanges
                .map((range) => `${getColor(range.colorClass)}`)
                .join(', ')})`,
            }}
            title={activeRanges
              .map((range) => `${range.min} - ${range.max}`)
              .join(', ')}
          ></div>
          {/* Markers for each range */}
          {/* {activeRanges.map((range, index) => (
            <div
              key={index}
              className="absolute h-5 w-0.5 bg-[#444950] top-0"
              style={{
                left: `${(index / (activeRanges.length - 1)) * 100}%`,
                transform: 'translateX(-60%)',
              }}
            ></div>
          ))} */}
          {/* Middle Marker */}
          {/* <div
            className="absolute h-5 w-0.5 bg-[#444950] top-0"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          ></div> */}
        </div>
        <div className="relative flex justify-between w-[50%] mt-2 text-sm">
          {/* <span>{activeRanges[0]?.min || 0}</span>
          <span>
            {activeRanges[Math.floor(activeRanges.length / 2)]?.min || 0}
          </span>
          <span>{activeRanges[activeRanges.length - 1]?.max || 0}</span> */}

          <span>Low</span>

          <span>High</span>
        </div>
      </div>
    </Fragment>
  );
};

export default ActivityGraph;
