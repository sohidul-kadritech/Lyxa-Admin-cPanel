import axios from 'axios';
import getCookiesAsObject from '../helpers/cookies/getCookiesAsObject';
import { API_URL } from './Api';

const AXIOS = axios.create({
  baseURL: API_URL,
});
/**
 * Interceptor for all requests
 */
AXIOS.interceptors.request.use(
  async (config) => {
    /**
     * Add your request interceptor logic here: setting headers, authorization etc.
     */
    let accessToken = null;

    if (document.cookie.length > 0) {
      const { access_token } = getCookiesAsObject();
      accessToken = access_token || null;
    }

    config.headers['Content-Type'] = 'application/json';
    if (!config?.noAuth) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    /**
     * Add your error handlers here
     */
    console.log('error:', error);
    return Promise.reject(error);
  }
);
/**
 * Interceptor for all responces
 */
AXIOS.interceptors.response.use(
  (response) =>
    /**
     * Add logic for successful response
     */
    response?.data || {},
  (error) => {
    /**
     * Add logic for any error from backend
     */
    console.log('backend error:', error);
    return Promise.reject(error);
  }
);

export default AXIOS;
