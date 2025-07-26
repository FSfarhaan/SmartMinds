import { Notice } from '@/types/NoticeTypes';
import { Student } from '@/types/StudentTypes';
import axios from 'axios';

const baseURL = 'http://192.168.67.209:3000/api';

// api/students
export const postStudent = async (payload: Omit<Student, "_id">) => {
  const res = await axios.post(`${baseURL}/students`, payload);
  return res.data;
};

// api/notices
export const postNotices = async (payload: Omit<Notice, "_id">) => {
  const res = await axios.post(`${baseURL}/notices`, payload);
  return res.data;
};
