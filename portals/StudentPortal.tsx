import { View, Text, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader';
import Notices from '../app/sections/Notices';
import StuDashboard from '../app/sections/StuDashboard';
import StuFees from '../app/sections/StuFees';
import StuAttendance from '../app/sections/StuAttendance';

const options = [
  { key: "Dashboard", icon: "grid-outline" },
  { key: "Notices", icon: "megaphone-outline" },
  { key: "Fees", icon: "business-outline" },
  { key: "Attendance", icon: "calendar-outline" },
];

const StudentPortal = () => {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <SafeAreaView className="flex-1 bg-background pb-28">
      <ScrollView>
        <DashboardHeader isAdmin={true} name='Farhaan Shaikh' options={options} selected={selected} setSelected={setSelected} uri="https://via.placeholder.com/40" />

        {selected === "Dashboard" && <StuDashboard />}
        {/* {selected === "Students" && <Students />} */}
        {selected === "Notices" && <Notices isAdmin={false} />}
        {selected === "Fees" && <StuFees />}
        {selected === "Attendance" && <StuAttendance />}

      </ScrollView>
    </SafeAreaView>
  )
}

export default StudentPortal