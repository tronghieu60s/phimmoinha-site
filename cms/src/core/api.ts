import axios, { AxiosRequestConfig } from 'axios';
import { isUrl } from './commonFuncs';

const APP_API_MAIN_URL = process.env.APP_API_MAIN_URL || 'http://localhost:4000/api';

export default function apiCaller(endpoint: string, config?: AxiosRequestConfig) {
  const { method = 'GET', ...restConfig } = config || {};

  let url = `${APP_API_MAIN_URL}/${endpoint}`;
  if (isUrl(endpoint)) url = endpoint;

  return axios({
    url,
    method,
    headers: { 'X-Requested-With': 'XMLHttpRequest', ...config?.headers },
    ...restConfig,
  })
    .then((res) => res.data)
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    });
}
