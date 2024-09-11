import PmIcon from '../assets/images/icons/pm25.svg';
import Pm10Icon from '../assets/images/icons/pm10.svg';
import No2Icon from '../assets/images/icons/no2.svg';
import CoIcon from '../assets/images/icons/co.svg';
import Co2Icon from '../assets/images/icons/co2.svg';
import Ch4Icon from '../assets/images/icons/ch4.svg';
import TempIcon from '../assets/images/icons/temp.svg';
import RhIcon from '../assets/images/icons/rh.svg';

import ChartIcon from '../assets/images/common/chart-placeholder.svg';

const pollutants = [
  {
    key: 'pm_25',
    data: 'PM2.5',
    long_desc: 'Particulate Matter - 2.5 (μg/m3)',
    icon: PmIcon,
    unit: 'μg/m3',
  },
  {
    key: 'pm_10',
    data: 'PM10',
    long_desc: 'Particulate Matter - 10 (μg/m3)',
    icon: Pm10Icon,
    unit: 'μg/m3',
  },
  {
    key: 'no2',
    data: 'NO2',
    long_desc: 'Nitrogen Dioxide (μg/m3)',
    icon: No2Icon,
    unit: 'μg/m3',
  },
  {
    key: 'co',
    data: 'CO',
    long_desc: 'Carbon Monoxide (µg/m3)',
    icon: CoIcon,
    unit: 'µg/m3',
  },
  {
    key: 'co2',
    data: 'CO2',
    long_desc: 'Carbon Dioxide (ppb)',
    icon: Co2Icon,
    unit: 'ppb',
  },
  {
    key: 'ch4',
    data: 'CH4',
    long_desc: 'Methane (ppb)',
    icon: Ch4Icon,
    unit: 'ppb',
  },
  {
    key: 'temp',
    data: 'Temperature',
    long_desc: 'Ambient Temperature (°C)',
    icon: TempIcon,
    unit: '°C',
  },
  {
    key: 'rh',
    data: 'Relative Humidity',
    long_desc: 'Humidity percentage in air (%)',
    icon: RhIcon,
    unit: '%',
  },
];

const dummyDataTrend = [
  {
    id: 1,
    data: 'PM2.5',
    icon: PmIcon,
    avg: 219,
    min: 100,
    max: 300,
    med: 300,
    var: 200,
    stdev: 100,
    chartPlaceholder: ChartIcon,
  },
];

export const generateDummySkeletonTrend = (count) => {
  const baseData = dummyDataTrend[0];
  const newDataTrend = [];

  for (let i = 0; i < count; i++) {
    newDataTrend.push({ ...baseData, id: i + 1 });
  }

  return newDataTrend;
};

// export const convertTrendDataResponse = (apiData) => {
//   return pollutants.map((pollutant, index) => ({
//     id: index + 1,
//     key: pollutant.key,
//     data: pollutant.data,
//     icon: pollutant.icon,
//     desc: pollutant.long_desc,
//     avg: formatNumberToK((apiData[`${pollutant.key}_avg`] ?? 0).toFixed(1)),
//     min: formatNumberToK((apiData[`${pollutant.key}_min`] ?? 0).toFixed(1)),
//     max: formatNumberToK((apiData[`${pollutant.key}_max`] ?? 0).toFixed(1)),
//     med: formatNumberToK((apiData[`${pollutant.key}_median`] ?? 0).toFixed(1)),
//     var: formatNumberToK((apiData[`${pollutant.key}_var`] ?? 0).toFixed(1)),
//     stdev: formatNumberToK((apiData[`${pollutant.key}_stdev`] ?? 0).toFixed(1)),
//     unit: pollutant.unit,
//     chartPlaceholder: ChartIcon,
//   }));
// };

export const convertTrendDataResponse = (apiData) => {
  return pollutants.map((pollutant, index) => ({
    id: index + 1,
    key: pollutant.key,
    data: pollutant.data,
    icon: pollutant.icon,
    desc: pollutant.long_desc,
    avg: formatNumberToK(
      apiData[`${pollutant.key}_avg`] !== null &&
        apiData[`${pollutant.key}_avg`] !== undefined &&
        apiData[`${pollutant.key}_avg`] !== 0
        ? apiData[`${pollutant.key}_avg`].toFixed(1)
        : 'N/A'
    ),
    min: formatNumberToK(
      apiData[`${pollutant.key}_min`] !== null &&
        apiData[`${pollutant.key}_min`] !== undefined &&
        apiData[`${pollutant.key}_min`] !== 0
        ? apiData[`${pollutant.key}_min`].toFixed(1)
        : 'N/A'
    ),
    max: formatNumberToK(
      apiData[`${pollutant.key}_max`] !== null &&
        apiData[`${pollutant.key}_max`] !== undefined &&
        apiData[`${pollutant.key}_max`] !== 0
        ? apiData[`${pollutant.key}_max`].toFixed(1)
        : 'N/A'
    ),
    med: formatNumberToK(
      apiData[`${pollutant.key}_median`] !== null &&
        apiData[`${pollutant.key}_median`] !== undefined &&
        apiData[`${pollutant.key}_median`] !== 0
        ? apiData[`${pollutant.key}_median`].toFixed(1)
        : 'N/A'
    ),
    var: formatNumberToK(
      apiData[`${pollutant.key}_var`] !== null &&
        apiData[`${pollutant.key}_var`] !== undefined &&
        apiData[`${pollutant.key}_var`] !== 0
        ? apiData[`${pollutant.key}_var`].toFixed(1)
        : 'N/A'
    ),
    stdev: formatNumberToK(
      apiData[`${pollutant.key}_stdev`] !== null &&
        apiData[`${pollutant.key}_stdev`] !== undefined &&
        apiData[`${pollutant.key}_stdev`] !== 0
        ? apiData[`${pollutant.key}_stdev`].toFixed(1)
        : 'N/A'
    ),
    unit: pollutant.unit,
    chartPlaceholder: ChartIcon,
  }));
};

export const transformActivityDataResponse = (apiResponse) => {
  // Map month numbers to month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Transform the response
  return apiResponse.map((yearData) => {
    const transformedData = {};

    for (const [month, data] of Object.entries(yearData.data)) {
      const monthIndex = parseInt(month) - 1;
      if (data.length > 0) {
        transformedData[monthNames[monthIndex]] = data;
      }
    }

    return {
      year: yearData.year,
      data: transformedData,
    };
  });
};

export const processTrendGraphApiResponse = (data) => {
  const result = {};

  // Initialize result object with empty arrays
  pollutants.forEach((pollutant) => {
    result[pollutant.key] = [];
  });

  data.forEach((item) => {
    pollutants.forEach((pollutant) => {
      const avgKey = `${pollutant.key}_avg`;
      if (item[avgKey] !== null) {
        const value = parseFloat(item[avgKey].toFixed(0)); // Fixing to 3 decimal places
        result[pollutant.key].push({ date: item.date, value });
      }
    });
  });

  return result;
};

export const formatNumberToK = (number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2).replace(/\.?0+$/, '') + 'B';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2).replace(/\.?0+$/, '') + 'K';
  } else {
    return number.toString();
  }
};
