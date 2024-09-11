import ApiHelper from './ApiHelper';

export const getHeatmapDataPoints = () => {
  return ApiHelper.get(`${import.meta.env.VITE_REACT_API_URL}/map-lat-long`);
};

export const getStaticDataPoints = (data) => {
  return ApiHelper.post(`${import.meta.env.VITE_REACT_API_URL}/get-static-sensor`,data);
};

export const getActivityData = (data) => {
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/data-activity`,
    data
  );
};

export const getTrendData = (data) => {
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/data-trend`,
    data
  );
};

export const getTrendGraphData = (data) => {
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/data-trend-graph`,
    data
  );
};

export const dataDownload = (data) => {
  return ApiHelper.post(`${import.meta.env.VITE_REACT_API_URL}/data-download-blob`,
  data);
};

export const getRecordData = (data) => {
  return ApiHelper.get(`${import.meta.env.VITE_REACT_API_URL2}/record-retrive-map/${data}`);
};

export const getDeviceCount = (data) => {
  return ApiHelper.post(`${import.meta.env.VITE_REACT_API_URL}/data-device-count`,data);
};

export const getMonth = () => {
  return ApiHelper.get(`${import.meta.env.VITE_REACT_API_URL}/download-month-year`);
};
