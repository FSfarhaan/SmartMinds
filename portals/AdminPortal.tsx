import { ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import DashboardHeader from '../components/DashboardHeader';
import Dashboard from '../app/sections/Dashboard';
import Students from '../app/sections/Students';
import Notices from '../app/sections/Notices';
import Fees from '../app/sections/Fees';
import Attendance from '../app/sections/Attendance'

const options = [
    { key: "Dashboard", icon: "grid-outline" },
    { key: "Students", icon: "person-outline" },
    { key: "Notices", icon: "megaphone-outline" },
    { key: "Fees", icon: "business-outline" },
    { key: "Attendance", icon: "calendar-outline" },
];

const AdminPortal = () => {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <SafeAreaView className="flex-1 bg-background pb-28">
      <ScrollView>
        <DashboardHeader isAdmin={true} name='Farhaan Shaikh' options={options} selected={selected} setSelected={setSelected} uri="https://via.placeholder.com/40" />

        {selected === "Dashboard" && <Dashboard />}
        {selected === "Students" && <Students />}
        {selected === "Notices" && <Notices isAdmin={true} />}
        {selected === "Fees" && <Fees />}
        {selected === "Attendance" && <Attendance />}

      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminPortal