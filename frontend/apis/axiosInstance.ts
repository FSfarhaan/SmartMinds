import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.baseUrl || Constants.manifest?.extra?.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
