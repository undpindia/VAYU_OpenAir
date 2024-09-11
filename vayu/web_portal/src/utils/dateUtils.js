import dayjs from 'dayjs';
/* import utc from 'dayjs/plugin/utc';
dayjs.extend(utc); */
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

export const forecastDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const dateWithOrdinal = (date) => {
  const d = new Date(date);
  const day = d.getDate();
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
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  const getOrdinalSuffix = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
};

export const forecastBannerDate = (date) => {
  return dayjs(date).format('YYYY/MM/DD');
};

export const outlookTableDay = (date) => {
  return dayjs(date).format('ddd');
};

export const outlookTableDate = (date) => {
  return dayjs(date).format('DD/MM/YY');
};

export const getDay = (date) => {
  return dayjs(date).format('DD');
};

export const addDays = (date, day) => {
  return dayjs(date).add(day, 'day').format('YYYY-MM-DD');
};

export const subtractDays = (date, day) => {
  return dayjs(date).subtract(day, 'day').format('YYYY-MM-DD');
};

export const foreCastTopDateFormat = (date) => {
  return dayjs(date).format('DD MMM YYYY');
};

export const graphDateFormat = (date) => {
  return dayjs(date).format('DD MMM');
};

const addExtension = (date) => {
  switch (String(date)) {
    case '01':
      return '1st';
    case '02':
      return '2nd';
    case '03':
      return '3rd';
    case '21':
      return '21st';
    case '22':
      return '22nd';
    case '23':
      return '23rd';
    case '31':
      return '31st';
    default:
      return `${date}th`;
  }
};

export const thDateFormat = (date) => {
  let formattedDate = dayjs(date).format('DD MMM');
  let splitDate = formattedDate.split(' ');
  return `${addExtension(splitDate[0])} ${splitDate[1]}`;
};

export const thDateFormatWithYear = (date) => {
  let formattedDate = dayjs(date).format('DD MMM YYYY');
  let splitDate = formattedDate.split(' ');
  return `${addExtension(splitDate[0])} ${splitDate[1]} ${splitDate[2]}`;
};

export const normalDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const pdfDateFormat = (date) => {
  return dayjs(date).format('DD-MM-YYYY');
};

export const timeOnly = (date) => {
  return dayjs(date).format('hh:mm a');
};

export const timeOnly24Hrs = (date) => {
  return dayjs(date).format('HH:mm');
};

export const hourOnly = (date) => {
  return dayjs(date).format('hh a');
};

export const timeOnlyTable = (date) => {
  return dayjs(date).format('ha');
};

export const timeStamp = (date) => {
  return dayjs(date).toDate();
};

export const dayOnly = (date) => {
  return dayjs(date).format('D');
};

export const dayOfWeek = (date) => {
  return dayjs(date).format('dddd');
};

export const convertUnixToNormalDate = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  const normalFormat = `${day}/${month}/${year}`;

  return normalFormat;
};

export const convertUnixToNormalTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  const timeFormat = `${hours}:${minutes}:${seconds}`;
  return timeFormat;
};

export const dateAndTimeFormat = (date) => {
  return dayjs(date).format('DD MMM YYYY, h:mm A');
};

export const dateAndTimeFullFormat = (date) => {
  return dayjs(date).format('DD MMM YYYY, h:mm A');
};

export const dateMonthAndYearFormat = (date) => {
  return dayjs(date).format('MMM YYYY');
};
