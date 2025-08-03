import api from "./axiosInstance";

// api/fees
export const patchAttendanceChange = async(studentId: string, month:string, status: string) => {
    try {
        const response = await api.patch(`/fees/update-fee`, { studentId, month, status });
        return response.data;
    } catch (error) {
        console.error("Error in patchAttendanceChange:", error);
        throw error;
    }
}