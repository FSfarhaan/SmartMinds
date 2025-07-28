import axios from "axios";

const baseURL = 'http://192.168.67.209:3000/api';

// api/fees
export const patchAttendanceChange = async(studentId: string, month:string, status: string) => {
    const response = await axios.patch(`${baseURL}/fees/update-fee`, { studentId, month, status });
    return response.data;
}