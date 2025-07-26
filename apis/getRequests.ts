import axios from 'axios';

const baseURL = 'http://192.168.67.209:3000/api';

// api/dashboard
export const getStats = async () => {
    const response = await axios.get(`${baseURL}/dashboard/stats`);
    return response.data;
};
export const getFeesSummary = async () => {
    const response = await axios.get(`${baseURL}/dashboard/fees-summary`);
    return response.data;
};
export const getFeesCollected = async () => {
    const response = await axios.get(`${baseURL}/dashboard/fees-collected`);
    return response.data;
};
export const getFeesDue = async () => {
    const response = await axios.get(`${baseURL}/dashboard/fees-due`);
    return response.data;
};
  

// api/student
export const getAllStudents = async () => {
    const response = await axios.get(`${baseURL}/students`);
    return response.data;
};


// api/notices
export const getAllNotices = async () => {
    const response = await axios.get(`${baseURL}/notices`);
    return response.data;
};