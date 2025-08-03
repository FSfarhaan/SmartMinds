import api from "./axiosInstance";

// api/dashboard
export const getStats = async () => {
    try {
        const response = await api.get(`/dashboard/stats`);
        return response.data;
    } catch (error) {
        console.error("Error in getStats:", error);
        throw error;
    }
};
export const getFeesSummary = async () => {
    try {
        const response = await api.get(`/dashboard/fees-summary`);
        return response.data;
    } catch (error) {
        console.error("Error in getFeesSummary:", error);
        throw error;
    }
};
export const getFeesCollected = async () => {
    try {
        const response = await api.get(`/dashboard/fees-collected`);
        return response.data;
    } catch (error) {
        console.error("Error in getFeesCollected:", error);
        throw error;
    }
};
export const getFeesDue = async () => {
    try {
        const response = await api.get(`/dashboard/fees-due`);
        return response.data;
    } catch (error) {
        console.error("Error in getFeesDue:", error);
        throw error;
    }
};
  

// api/student
export const getAllStudents = async () => {
    const response = await api.get(`/students`);
    return response.data;
};


// api/notices
export const getAllNotices = async () => {
    const response = await api.get(`/notices`);
    return response.data;
};


// api/fees
export const getFeesPie = async (month: string) => {
    const response = await api.get(`/fees/summary?month=${month}`);
    return response.data;
};

export const getStudentFees = async (month: string, status: string) => {
    const response = await api.get(`/fees/students?month=${month}&status=${status}`);
    return response.data;
};


// api/attendance
export const getAllAttendances = async (shift: string, month: string) => {
    const response = await api.get(`/attendance?month=${month}&shift=${shift}`);
    return response.data;
};