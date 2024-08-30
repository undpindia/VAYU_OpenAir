import Axios from 'axios';

const axiosApiInstance = Axios.create();

const handleError = async (error) => {
  if (error) {
    console.error(error);
  } else {
    console.error('Cannot load data! Please check your internet connection');
  }
};

const ApiHelper = {
  // Api get function
  get: async (url) => {
    try {
      return await axiosApiInstance.get(url);
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // get with headers
  getWithHeaders: async (url, headers) => {
    try {
      return await axiosApiInstance.get(url, { headers });
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // get with headers and data
  getWithHeadersAndData: async (url, headers, data) => {
    try {
      return await axiosApiInstance.get(url, { headers, data });
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // post with both header and data
  postWithHeaders: async (url, headers, data) => {
    try {
      return await axiosApiInstance.post(url, data, { headers });
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // post with header only
  postWithOnlyHeaders: async (url, headers) => {
    try {
      return await axiosApiInstance.post(url, {}, { headers });
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // Api post function
  post: async (url, data) => {
    try {
      return await axiosApiInstance.post(url, data);
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // Api put function
  put: async (url, data) => {
    try {
      return await axiosApiInstance.put(url, data);
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // put with headers
  putWithHeaders: async (url, headers, data) => {
    try {
      return await axiosApiInstance.put(url, data, { headers });
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },

  // Api delete function
  delete: async (url) => {
    try {
      return await axiosApiInstance.delete(url);
    } catch (error) {
      if (Axios.isAxiosError(error)) {
        await handleError(error);
        return error.response;
      } else {
        await handleError();
        return undefined;
      }
    }
  },
};

export default ApiHelper;
