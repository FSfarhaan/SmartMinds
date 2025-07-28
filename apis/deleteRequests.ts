import axios from "axios";

const baseURL = 'http://192.168.67.209:3000/api';

// api/attendance
export const deleteAttendance = async (studentId: string, date: string) => {
    const response = await axios.delete(`${baseURL}/attendance/${studentId}/${date}`)
    return response.data;
}