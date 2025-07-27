import { useState, useMemo, useRef, useEffect, act } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AppTextSB from '../../components/poppins/AppTextSB';
import AppTextR from '../../components/poppins/AppTextR';
import ShowMoreLess from '../../components/ShowMoreLess';
import { useFetchData } from '@/hooks/useFetchData';
import { getAllAttendances } from '@/apis/getRequests';
import { Student } from '@/types/StudentTypes';
import axios from 'axios';
import { postAttendanec } from '@/apis/postRequest';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonthIndex = now.getMonth();
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const shifts = ['Shift 1', 'Shift 2', 'Shift 3'];

// const students = [
//     { id: '1', name: 'Farhaan Shaikh', shift: 'Shift 1' },
//     { id: '2', name: 'Aditya Jambhale', shift: 'Shift 2' },
//     { id: '3', name: 'Sejal Khilary', shift: 'Shift 3' },
//     { id: '4', name: 'John Carter', shift: 'Shift 1' },
//     { id: '5', name: 'Emily Watson', shift: 'Shift 2' },
//     { id: '6', name: 'Michael Brown', shift: 'Shift 3' },
//     { id: '7', name: 'Sophia Miller', shift: 'Shift 1' },
//     { id: '8', name: 'Liam Johnson', shift: 'Shift 2' },
//     { id: '9', name: 'Olivia Taylor', shift: 'Shift 3' },
//     { id: '10', name: 'Noah Wilson', shift: 'Shift 1' },
//     { id: '11', name: 'Ava Moore', shift: 'Shift 2' },
//     { id: '12', name: 'Lucas Martin', shift: 'Shift 3' },
//     { id: '13', name: 'Mia Anderson', shift: 'Shift 1' },
//     { id: '14', name: 'Ethan Thomas', shift: 'Shift 2' },
//     { id: '15', name: 'Charlotte White', shift: 'Shift 3' },
//     { id: '16', name: 'James Harris', shift: 'Shift 1' },
//     { id: '17', name: 'Amelia Clark', shift: 'Shift 2' },
//     { id: '18', name: 'Benjamin Lewis', shift: 'Shift 3' },
//     { id: '19', name: 'Harper Young', shift: 'Shift 1' },
//     { id: '20', name: 'Alexander Hall', shift: 'Shift 2' },
//     { id: '21', name: 'Evelyn Scott', shift: 'Shift 3' },
//     { id: '22', name: 'Henry Green', shift: 'Shift 1' },
//     { id: '23', name: 'Abigail Adams', shift: 'Shift 2' },
//     { id: '24', name: 'Daniel Baker', shift: 'Shift 3' },
//     { id: '25', name: 'Scarlett Nelson', shift: 'Shift 1' },
//     { id: '26', name: 'Logan Roberts', shift: 'Shift 2' },
//     { id: '27', name: 'Grace Turner', shift: 'Shift 3' },
//     { id: '28', name: 'Jackson Phillips', shift: 'Shift 1' },
//     { id: '29', name: 'Chloe Campbell', shift: 'Shift 2' },
//     { id: '30', name: 'Sebastian Parker', shift: 'Shift 3' },
//     { id: '31', name: 'Lily Evans', shift: 'Shift 1' },
//     { id: '32', name: 'Jayden Edwards', shift: 'Shift 2' },
//     { id: '33', name: 'Hannah Collins', shift: 'Shift 3' },
//     { id: '34', name: 'Matthew Stewart', shift: 'Shift 1' },
//     { id: '35', name: 'Zoey Morris', shift: 'Shift 2' },
//     { id: '36', name: 'Jack Rogers', shift: 'Shift 3' },
//     { id: '37', name: 'Riley Cook', shift: 'Shift 1' },
//     { id: '38', name: 'Nathan Reed', shift: 'Shift 2' },
//     { id: '39', name: 'Avery Morgan', shift: 'Shift 3' },
//     { id: '40', name: 'Elijah Bell', shift: 'Shift 1' },
//     { id: '41', name: 'Layla Murphy', shift: 'Shift 2' },
//     { id: '42', name: 'Samuel Bailey', shift: 'Shift 3' },
//     { id: '43', name: 'Nora Rivera', shift: 'Shift 1' },
//     { id: '44', name: 'Owen Cooper', shift: 'Shift 2' },
//     { id: '45', name: 'Lillian Richardson', shift: 'Shift 3' },
//     { id: '46', name: 'Gabriel Cox', shift: 'Shift 1' },
//     { id: '47', name: 'Aria Howard', shift: 'Shift 2' },
//     { id: '48', name: 'David Ward', shift: 'Shift 3' },
//     { id: '49', name: 'Eleanor Torres', shift: 'Shift 1' },
//     { id: '50', name: 'Julian Peterson', shift: 'Shift 2' }
//   ];

const cellWidth = 36;
const nameColWidth = 120;
const totalColWidth = 60;
const rowHeight = 44;

type AttendanceMap = {
  [monthIndex: number]: {
    [studentId: string]: {
      [day: number]: 'P' | 'A' | '';
    };
  };
};

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


  let shiftNumber;
  const fetchData = async() => {
    shiftNumber = activeShift.split(" ")[1];
    // console.log(activeShift);
    const response = await getAllAttendances(shiftNumber, selectedMonth);
    // console.log(shiftNumber, selectedMonth)
    return response;
  }

  const { data, loading, error } = useFetchData(fetchData, [activeShift, selectedMonth]);

  useEffect(() => {
    if(data) {
      // console.log(data[0]);
      console.log("Run hona chahiye");
      setAttendanceData(data);
      // setAttendance(transformAttendanceData(data));
    } 
  }, [data, activeShift, selectedMonth]);

  
  useEffect(() => {
    setAttendance(transformAttendanceData(attendanceData));
  }, [attendanceData]);
  

  // Only months up to current
  const monthOptions = monthNames.slice(0, currentMonthIndex + 1);
  const selectedMonthIdx = monthNames.indexOf(selectedMonth);
  const numDays = daysInMonth(currentYear, selectedMonthIdx);

  // Filter students by shift
  const filteredStudents = useMemo(
    () => attendanceData?.filter((s) => "Shift " + s.shiftNumber === activeShift),
    [activeShift]
  );
  const studentsToShow = filteredStudents.slice(0, visibleCount);

  
  // console.log(activeShift);

  // Attendance state: { [monthIdx]: { [studentId]: { [day]: 'P' | 'A' | '' } } }

  // const [attendance, setAttendance] = useState(() => {
  //   const initial: Record<number, Record<string, Record<number, 'P' | 'A' | ''>>> = {};
  //   // Initialize current month
  //   initial[currentMonthIndex] = {};
  //   attendanceData.forEach((s) => {
  //     initial[currentMonthIndex][s._id] = {};
  //     for (let d = 1; d <= 31; d++) initial[currentMonthIndex][s._id][d] = '';
  //   });
  //   return initial;
  // });

  // const attendance = transformAttendanceData(attendanceData);

  console.log(attendance);

  // Ensure attendance for selected month is initialized
  // useEffect(() => {
  //   setAttendance((prev) => {
  //     if (prev[selectedMonthIdx]) return prev;
  //     const newMonth: Record<string, Record<number, 'P' | 'A' | ''>> = {};
  //     attendanceData.forEach((s) => {
  //       newMonth[s._id] = {};
  //       for (let d = 1; d <= 31; d++) newMonth[s._id][d] = '';
  //     });
  //     return { ...prev, [selectedMonthIdx]: newMonth };
  //   });
  // }, [selectedMonthIdx]);

  // Handle cell click: cycle '', 'P', 'A', '' for selected month
  const handleCellPress = async (studentId: string, day: number, value: string) => {
    // let next: 'P' | 'A' | '' = '';
    //   if (curr === '') next = 'P';
    //   else if (curr === 'P') next = 'A';
    //   else if (curr === 'A') next = '';
    let present = true;
    if(value !== 'A') {
      const fDay = day < 10 ? "0" + day : day
      const date = `${now.getFullYear()}-${selectedMonthIdx + 1}-${fDay}`;
      console.log(value);
      if(!value) present = true;
      else if(value === 'P') present = false;
      const payload = {
        studentId, date, present
      }

      // console.log(payload);

      try {
        const res = await postAttendanec(payload);
          setAttendance((prev) => {
            const monthData = prev[selectedMonthIdx] || {};
            const studentData = monthData[studentId] || {};
            const curr = studentData[day] || '';
        
            let next: 'P' | 'A' | '' = '';
            if (curr === '') next = 'P';
            else if (curr === 'P') next = 'A';
            else if (curr === 'A') next = '';
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
    
      // console.log(date);
      } catch (err) {
        console.log(err);
      }
    }
    //
  };

  

  // Calculate total presents for each student for selected month
  const getTotal = (studentId: string) => {
    let total = 0;
    const monthData = attendance[selectedMonthIdx] || {};
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
    // console.log(student._id);
    const monthData = attendance[selectedMonthIdx] || {};
    // console.log(selectedMonthIdx);
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