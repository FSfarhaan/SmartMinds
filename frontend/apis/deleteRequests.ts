import api from "./axiosInstance";

// api/attendance
export const deleteAttendance = async (studentId: string, date: string) => {
    try {
        const response = await api.delete(`/attendance/${studentId}/${date}`);
        return response.data;
    } catch (error) {
        console.error("Error in deleteAttendance:", error);
        throw error;
    }
}