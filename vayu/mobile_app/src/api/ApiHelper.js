import Axios from 'axios';
// import { toast } from 'react-hot-toast';
const axiosApiInstance = Axios.create();

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access_token');
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      JSON.parse(localStorage.getItem('keepLoggedIn'))
    ) {
      originalRequest._retry = true;
      const token = localStorage.getItem('refresh_token');
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await Axios.post(
        `${import.meta.env.VITE_REACT_API_URL}/new_token`,
        '',
        config
      ).then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('access_token', res.data.access_token);
          Axios.defaults.headers.common['Authorization'] =
            'Bearer ' + res.data.access_token;
          axiosApiInstance(originalRequest);
          window.location.reload();
        }
        // window.location.reload();
      });
    } else if (error.response.status === 401) {
      localStorage.clear();
      localStorage.removeItem('persistentState');
      localStorage.removeItem('access_token');
      // toast.error('Session expired. Please login again.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
    return Promise.reject(error);
  }
);

const handleError = async (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Cant load data! Please check internet connection');
  }
};

let ApiHelper = {
  // Api get function
  get: async (url) => {
    return axiosApiInstance.get(url).catch((error) => {
      handleError(error.response);
      return error.response;
    });
  },

  // Api post function
  post: async (url, data) => {
    return axiosApiInstance.post(url, data).catch((error) => {
      handleError(error.response);
      return error.response;
    });
  },

  // Api put function
  put: async (url, data) => {
    return axiosApiInstance.put(url, data).catch((error) => {
      handleError(error.response);
      return error.response;
    });
  },

  // Api delete function
  delete: async (url) => {
    return axiosApiInstance.delete(url).catch((error) => {
      handleError(error.response);
      return error.response;
    });
  },
};

export default ApiHelper;
