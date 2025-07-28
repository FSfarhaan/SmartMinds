import { useState, useMemo, useRef, useEffect, act } from 'react';
import { View, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AppTextSB from '../../components/poppins/AppTextSB';
import AppTextR from '../../components/poppins/AppTextR';
import ShowMoreLess from '../../components/ShowMoreLess';
import { useFetchData } from '@/hooks/useFetchData';
import { getAllAttendances } from '@/apis/getRequests';
import { Student } from '@/types/StudentTypes';
import axios from 'axios';
import { postAttendance } from '@/apis/postRequest';
import { deleteAttendance } from '@/apis/deleteRequests';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonthIndex = now.getMonth();
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const shifts = ['Shift 1', 'Shift 2', 'Shift 3'];

const cellWidth = 36;
const nameColWidth = 120;
const totalColWidth = 60;
const rowHeight = 44;

const transformAttendanceData = (rawStudents: Student[]) => {
  const structured: {
    [monthIndex: number]: {
      [studentId: string]: {
        [day: number]: 'P' | 'A' | '';
      };
    };
  } = {};

  rawStudents.forEach((student) => {
    student.attendance?.forEach((record) => {
      const date = new Date(record.date);
      const monthIdx = date.getMonth(); // 0 = Jan, 6 = July
      const day = date.getDate();       // 1–31

      if (!structured[monthIdx]) structured[monthIdx] = {};
      if (!structured[monthIdx][student._id]) structured[monthIdx][student._id] = {};

      structured[monthIdx][student._id][day] = record.present ? 'P' : 'A';
    });
  });

  return structured;
}

const AttendanceSection = () => {
  const [activeShift, setActiveShift] = useState(shifts[0]);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(monthNames[currentMonthIndex]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState(() => transformAttendanceData(attendanceData));

  useEffect(() => {
    console.log("attendanceData", attendanceData);
    console.log("attendance", attendance);
  }, [attendanceData, attendance]);

  let shiftNumber;
  const fetchData = async() => {
    shiftNumber = activeShift.split(" ")[1];
    console.log(activeShift);
    const response = await getAllAttendances(shiftNumber, selectedMonth);
    return response;
  }

  const { data, loading, error } = useFetchData(fetchData, [activeShift, selectedMonth]);

  useEffect(() => {
    if(data) {
      console.log("Run hona chahiye");
      setAttendanceData(data);
      setAttendance(transformAttendanceData(data));
    } 
  }, [activeShift, data, selectedMonth]);
  

  // Only months up to current
  const monthOptions = monthNames.slice(0, currentMonthIndex + 1);
  const selectedMonthIdx = monthNames.indexOf(selectedMonth);
  const numDays = daysInMonth(currentYear, selectedMonthIdx);

  // Filter students by shift
  const filteredStudents = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) return [];
    return attendanceData.filter((s) => "Shift " + s.shiftNumber === activeShift);
  }, [attendanceData, activeShift]);
  
  const studentsToShow = filteredStudents?.slice(0, visibleCount);

  // Handle cell click: cycle 'P', 'A', '' for selected month
  const handleCellPress = async (studentId: string, day: number, value: string) => {
    // let next: 'P' | 'A' | '' = '';
    //   if (curr === '') next = 'P';
    //   else if (curr === 'P') next = 'A';
    //   else if (curr === 'A') next = '';
    const fDay = day < 10 ? "0" + day : day
    const fMonth = selectedMonthIdx + 1 < 10 ? `0${selectedMonthIdx + 1}` : selectedMonthIdx + 1;
    const date = `${now.getFullYear()}-${fMonth}-${fDay}`;

    const next: 'P' | 'A' | '' = value === '' ? 'P' : value === 'P' ? 'A' : '';

  try {
    if (next === '') {
      await deleteAttendance(studentId, date);
    } else {
      await postAttendance({ studentId, date, present: next === 'P' });
    }
  } catch (err) {
    console.log(err);
  }

  // Update local state
  setAttendance(prev => {
    const monthData = prev[selectedMonthIdx] || {};
    const studentData = monthData[studentId] || {};
    return {
      ...prev,
      [selectedMonthIdx]: {
        ...monthData,
        [studentId]: {
          ...studentData,
          [day]: next,
        },
      },
    };
  });
  };

  // Calculate total presents for each student for selected month
  const getTotal = (studentId: string) => {
    let total = 0;
    const monthData = attendance && attendance[selectedMonthIdx];
    for (let d = 1; d <= numDays; d++) {
      if (monthData[studentId]?.[d] === 'P') total++;
    }
    return total;
  };

  const leftListRef = useRef<ScrollView>(null);
  const rightListRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);

  // Table header row for right part (days + total)
  const renderHeaderRight = () => (
    <View style={{ flexDirection: 'row', height: rowHeight }} className='bg-blue-50'>
      {[...Array(numDays)].map((_, i) => (
        <View key={i + 1} style={{ width: cellWidth, justifyContent: 'center', alignItems: 'center' }}>
          <AppTextSB>{i + 1}</AppTextSB>
        </View>
      ))}
      <View style={{ width: totalColWidth, justifyContent: 'center', alignItems: 'center' }}>
        <AppTextSB>Total</AppTextSB>
      </View>
    </View>
  );

  // Table row for names (left, sticky)
  const renderRowLeft = (student: Student, idx: number) => {
    // console.log("Sab barorbar hai");
    return (
    <View key={student._id} style={{ width: nameColWidth, height: rowHeight, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 8, backgroundColor: idx % 2 === 0 ? '#fff' : '#eff6ff', borderBottomWidth: 0.5, borderColor: '#e0e0e0' }}>
      <AppTextR numberOfLines={1}>{student.name}</AppTextR>
    </View>)
  };

  // Table row for right part (days + total)
  const renderRowRight = (student: Student, idx: number) => {
    if (!attendance || !attendance[selectedMonthIdx]) return null;
    
    const monthData = attendance[selectedMonthIdx] || {};

    return (
      <View key={student._id} style={{ flexDirection: 'row', height: rowHeight, backgroundColor: idx % 2 === 0 ? '#fff' : '#eff6ff' }}>
        {[...Array(numDays)].map((_, d) => {
          const day = d + 1;
          const value = monthData[student._id]?.[day] || '';
          let cellColor = '#fff';
          if (value === 'P') cellColor = '#e6f7e6';
          if (value === 'A') cellColor = '#fdeaea';
          return (
            <TouchableOpacity
              key={day}
              style={{ width: cellWidth, height: rowHeight, justifyContent: 'center', alignItems: 'center', backgroundColor: cellColor, borderWidth: 0.5, borderColor: '#e0e0e0' }}
              onPress={() => handleCellPress(student._id, day, value)}
              activeOpacity={0.7}
            >
              <AppTextSB style={{ color: value === 'P' ? '#2e7d32' : value === 'A' ? '#c62828' : '#888' }}>{value}</AppTextSB>
            </TouchableOpacity>
          );
        })}
        <View style={{ width: totalColWidth, justifyContent: 'center', alignItems: 'center' }}>
          <AppTextSB>{getTotal(student._id)}</AppTextSB>
        </View>
      </View>
    );
  };

  // Synchronize vertical scroll between left and right
  const onLeftScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setScrollY(y);
    if (rightListRef.current) {
      rightListRef.current.scrollTo({ y, animated: false });
    }
  };
  const onRightScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setScrollY(y);
    if (leftListRef.current) {
      leftListRef.current.scrollTo({ y, animated: false });
    }
  };

  return (
    <View className="w-full p-6 pt-2">
      {/* Top Bar: Shift Tabs & Month Dropdown */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center">
          {shifts.map((shift) => (
            <TouchableOpacity
              key={shift}
              onPress={() => { setActiveShift(shift); setVisibleCount(5); }}
              className={`px-4 py-2 rounded-lg mr-2 ${activeShift === shift ? 'bg-primary' : 'bg-gray-200' }`}
            >
              <AppTextSB className={`text-sm ${activeShift === shift ? 'text-white' : 'text-unselected-dark' }`}>{shift}</AppTextSB>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ position: 'relative', minWidth: 120 }}>
          <TouchableOpacity
            className="flex-row justify-between items-center bg-gray-100 py-2 px-3 rounded-lg"
            onPress={() => setMonthDropdownOpen((open) => !open)}
          >
            <AppTextR className="text-sm text-unselected-dark mr-2">
              {selectedMonth}
            </AppTextR>
            <Ionicons name={"chevron-down"} size={16} color="#333" />
          </TouchableOpacity>
          {monthDropdownOpen && (
            <View style={{ position: 'absolute', top: 44, left: 0, right: 0, zIndex: 10 }} className="bg-white rounded-lg shadow shadow-black">
              {monthOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="px-4 py-2"
                  onPress={() => {
                    setSelectedMonth(option);
                    setMonthDropdownOpen(false);
                  }}
                >
                  <AppTextR className="text-unselected-dark">{option}</AppTextR>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <View className="flex-row">
        {/* Sticky Names Column */}
        <View style={{ width: nameColWidth, zIndex: 2 }}>
          {/* Header for names */}
          <View style={{ height: rowHeight, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 8, borderBottomWidth: 0.5, borderColor: '#e0e0e0' }}>
            <AppTextSB numberOfLines={1}>Names</AppTextSB>
          </View>
          <ScrollView
            ref={leftListRef}
            style={{ height: rowHeight * studentsToShow.length }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            onScroll={onLeftScroll}
            scrollEventThrottle={16}
          >
            {studentsToShow.map((student, idx) => renderRowLeft(student, idx))}
          </ScrollView>
        </View>
        {/* Attendance Table (days + total) */}
        <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ minWidth: cellWidth * numDays + totalColWidth }}>
          <View>
            {renderHeaderRight()}
            <ScrollView
              ref={rightListRef}
              style={{ height: rowHeight * studentsToShow.length }}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              onScroll={onRightScroll}
              scrollEventThrottle={16}
            >
              {studentsToShow.map((student, idx) => renderRowRight(student, idx))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      {/* Load more / Show all / Show less */}

      <ShowMoreLess filteredData={filteredStudents}  sampleData={filteredStudents} setVisibleCount={setVisibleCount} visibleCount={visibleCount}/>
    </View>
  );
};

export default AttendanceSection;