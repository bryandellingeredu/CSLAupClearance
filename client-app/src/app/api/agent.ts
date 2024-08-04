import axios, { AxiosResponse } from 'axios';
import { User } from '../models/user';
import { store } from '../stores/store';
import { EventUser } from '../models/eventUser';
import { Event } from '../models/event';

const protocol = window.location.protocol;

axios.defaults.baseURL = protocol === 'https:' ?  import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_HTTP;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.userStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) =>
      axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  };

  const Account = {
    login: (token: string) => requests.post<User>('/account/login', { token }),
    current: () => requests.get<User>('/account'),
  };

  const EventUsers = {
    list: () => requests.get<EventUser[]>('/eventUsers'),
    update: (id: number, cleared: boolean) => axios.put<void>(`/eventUsers/${id}`, {cleared}),
  }

  const Events = {
    list: () => requests.get<Event[]>('/events'),
  }

  const agent = {
    Account,
    EventUsers,
    Events
  }

  export default agent;

