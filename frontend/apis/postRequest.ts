import { Notice } from '@/types/NoticeTypes';
import { Student } from '@/types/StudentTypes';
import api from "./axiosInstance";

type markAttendance = { 
  studentId: string,
  present: boolean,
  date: string
}

// api/students
export const postStudent = async (payload: Omit<Student, "_id">) => {
  try {
    const res = await api.post(`/students`, payload);
    return res.data;
  } catch (error) {
    console.error("Error in postStudent:", error);
    throw error;
  }
};

// api/notices
export const postNotices = async (payload: Omit<Notice, "_id">) => {
  try {
    const res = await api.post(`/notices`, payload);
    return res.data;
  } catch (error) {
    console.error("Error in postNotices:", error);
    throw error;
  }
};

// api/attendance
export const postAttendance = async (payload: markAttendance) => {
  try {
    const res = await api.post(`/attendance/mark`, payload);
    return res.data;
  } catch (error) {
    console.error("Error in postAttendance:", error);
    throw error;
  }
};


