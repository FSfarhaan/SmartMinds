import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AppTextSB from '../../components/poppins/AppTextSB';
import AppTextR from '../../components/poppins/AppTextR';
import { Ionicons } from '@expo/vector-icons';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonthIndex = now.getMonth();
const todayDate = now.getDate();

// Dummy attendance data for the year (replaceable with API)
const dummyAttendance: Record<number, 'P' | 'A'> = {
  1: 'P', 2: 'P', 3: 'A', 4: 'A', 5: 'A', 6: 'P', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
  11: 'P', 12: 'P', 13: 'P', 14: 'A', 15: 'A', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P',
  21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'A', 29: 'P', 30: 'P', 31: 'P',
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const StuAttendance = () => {
  // Only months up to current, but at most 4 (current and 3 before)
  const startMonth = Math.max(0, currentMonthIndex - 3);
  const monthOptions = monthNames.slice(startMonth, currentMonthIndex + 1);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(monthOptions.length - 1);
  const numDays = daysInMonth(currentYear, selectedMonthIdx);

  // For demo, use dummyAttendance for all months
  const attendance: Record<number, 'P' | 'A'> = dummyAttendance;

  // Calculate stats
  const presentDays = Object.values(attendance).filter((v, i) => i < numDays && v === 'P').length;
  const absentDays = Object.values(attendance).filter((v, i) => i < numDays && v === 'A').length;
  const presentPercent = Math.round((presentDays / numDays) * 100);
  const absentPercent = Math.round((absentDays / numDays) * 100);

  // Calendar grid logic
  // Week starts on Monday (0=Monday, 6=Sunday)
  const jsFirstDay = new Date(currentYear, selectedMonthIdx, 1).getDay(); // 0=Sunday
  const firstDay = (jsFirstDay + 6) % 7; // 0=Monday, 6=Sunday
  const daysArray = Array(numDays).fill(0).map((_, i) => i + 1);
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null); // empty slots before 1st
  }
  for (let d = 1; d <= numDays; d++) {
    calendarCells.push(d);
  }
  // Fill the rest of the last week with nulls if needed
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  return (
    <View className="p-6 py-2 flex-1 bg-[#f7fafd]">
      {/* Today Attendance Card */}
      <View className="bg-white rounded-2xl px-4 py-3 mb-4 flex-row items-center justify-between border border-[#e5e7eb]">
        <View>
          <AppTextSB className="text-base text-unselected-dark mb-1">Today Attendance</AppTextSB>
          <AppTextR className="text-xs text-unselected-light">Check In : 9:25am</AppTextR>
        </View>
        <View className="flex-row items-center gap-x-4">
          <View className="items-center">
            <AppTextSB className="text-lg text-green-600">{presentPercent}%</AppTextSB>
            <AppTextR className="text-xs text-unselected-light">Present</AppTextR>
          </View>
          <View className="items-center ml-2">
            <AppTextSB className="text-lg text-red-500">{absentPercent}%</AppTextSB>
            <AppTextR className="text-xs text-unselected-light">Absent</AppTextR>
          </View>
        </View>
      </View>

      {/* Calendar Card */}
      <View className="bg-white rounded-2xl p-4 border border-[#e5e7eb]">
        {/* Month Dropdown */}
        <View className="flex-row mb-2 items-center justify-between">
          <AppTextSB className="text-base text-unselected-dark">{monthNames[selectedMonthIdx]} {currentYear}</AppTextSB>
          <View style={{ position: 'relative', minWidth: 100 }}>
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 py-1.5 px-3 rounded-lg"
              onPress={() => setMonthDropdownOpen((open) => !open)}
            >
              <AppTextR className="text-base text-unselected-dark mr-2">
                {monthNames[selectedMonthIdx]}
              </AppTextR>
              <Ionicons name={"chevron-down"} size={16} color="#333" />
            </TouchableOpacity>
            {monthDropdownOpen && (
              <View
                style={{
                  position: 'absolute',
                  top: 38,
                  left: 0,
                  right: 0,
                  zIndex: 10
                }}
                className="bg-white rounded-lg shadow shadow-black"
              >
                {monthOptions.map((option, idx) => (
                  <TouchableOpacity
                    key={option}
                    className="px-4 py-2"
                    onPress={() => {
                      setSelectedMonthIdx(idx);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    <AppTextR className="text-unselected-dark">
                      {option}
                    </AppTextR>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        {/* Calendar Grid */}
        <View className="mt-2">
          {/* Weekdays Header */}
          <View className="flex-row justify-between mb-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <AppTextR key={i} className={`w-10 text-center text-xs ${d === 'S' ? 'text-red-400' : 'text-unselected-dark'}`}>{d}</AppTextR>
            ))}
          </View>
          {/* Days Grid: 7 columns, each row is a flex-row */}
          {Array.from({ length: calendarCells.length / 7 }).map((_, rowIdx) => (
            <View key={rowIdx} className="flex-row flex-1 justify-between">
              {calendarCells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
                if (!day) {
                  return <View key={colIdx} className="w-10 h-10" />;
                }
                const status = attendance[day];
                const isToday = selectedMonthIdx === currentMonthIndex && day === todayDate;
                return (
                  <View
                    key={colIdx}
                    className={`w-10 h-10 items-center justify-center rounded-full mb-1 ${isToday ? 'bg-blue-100 border border-blue-400' : ''} `}
                    style={{ borderWidth: isToday ? 1 : 0 }}
                  >
                    <AppTextSB
                      className={`text-sm text-center ${status === 'A' ? 'text-red-500' : 'text-unselected-dark'} ${isToday ? 'font-bold' : ''}`}
                    >
                      {day}
                    </AppTextSB>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default StuAttendance;