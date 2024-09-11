import ApiHelper from './ApiHelper';

// auth
export const logIn = (data) => {
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/api/v1/login`,
    data
  );
};

// profile
export const getProfile = (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.get(
    `${import.meta.env.VITE_REACT_API_URL}/user/api/v1/profile`,
    { headers }
  );
};

// get-device-data

export const getDeviceData = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/device/api/v1/get-device-data`,
    data,
    { headers }
  );
};

// get devices

export const getDevice = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/device/api/v1/get-devices`,
    data,
    { headers }
  );
};

// get activity

export const getActivity = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/get-activity`,
    data,
    { headers }
  );
};

// add-record

export const addRecord = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/add-record`,
    data,
    { headers }
  );
};

// get assigned records

export const getAssignedRecord = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/get-assigned-records`,
    data,
    { headers }
  );
};

// mark task as completed

export const taskCompleted = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/mark-task-complete`,
    data,
    { headers }
  );
};

// notification

export const getNotification = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/get-notifications`,
    data,
    { headers }
  );
};

// data-captured-list

export const getDataCapturedList = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.post(
    `${import.meta.env.VITE_REACT_API_URL}/mobile/api/v1/get-captured-data`,
    data,
    { headers }
  );
};

// data-captured

export const getDataCaptured = (token, data) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.get(
    `${
      import.meta.env.VITE_REACT_API_URL
    }/mobile/api/v1/get-captured-data/${data}`,
    { headers }
  );
};

// approval

export const getApproved = (token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return ApiHelper.get(
    `${import.meta.env.VITE_REACT_API_URL}/user/api/v1/approval`,
    { headers }
  );
};
