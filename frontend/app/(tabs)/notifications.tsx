import React, { useState } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AppTextB from "../../components/poppins/AppTextB";
import AppTextR from "../../components/poppins/AppTextR";
import { ScrollView } from "react-native-gesture-handler";

const today = new Date();
const yesterday = new Date(Date.now() - 86400000);
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const startOfYear = new Date(today.getFullYear(), 0, 1);

const notificationsData = [
  // Today
  {
    id: "1",
    user: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "Student Priya Sharma paid the April fees.",
    time: "2 hours ago",
    date: new Date(),
    unread: true,
    highlight: true,
  },
  {
    id: "2",
    user: "Rohan Patel",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "Parent of Rohan Patel requested a class reschedule.",
    time: "3 hours ago",
    date: new Date(),
    unread: true,
    highlight: true,
  },
  // Yesterday
  {
    id: "3",
    user: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message: "Class for Std 10 shifted to 5:00 PM today.",
    time: "5 hours ago",
    date: new Date(Date.now() - 86400000),
    unread: false,
    highlight: false,
  },
  {
    id: "4",
    user: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    message: "Student Priya Sharma was marked absent.",
    time: "08:10 AM",
    date: new Date(Date.now() - 86400000),
    unread: false,
    highlight: false,
  },
  // This week (not today/yesterday)
  {
    id: "5",
    user: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message: "Fee reminder sent to all parents.",
    time: "Monday, 10:00 AM",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1), // Monday
    unread: false,
    highlight: false,
  },
  // This month (not this week)
  {
    id: "6",
    user: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message: "April monthly report generated.",
    time: "April 2, 09:00 AM",
    date: new Date(today.getFullYear(), today.getMonth(), 2),
    unread: false,
    highlight: false,
  },
  // This year (not this month)
  {
    id: "7",
    user: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    message: "Happy New Year! Classes resume from Jan 3.",
    time: "Jan 1, 10:00 AM",
    date: new Date(today.getFullYear(), 0, 1),
    unread: false,
    highlight: false,
  },
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isYesterday(date: Date) {
  return isSameDay(date, yesterday);
}
function isToday(date: Date) {
  return isSameDay(date, today);
}
function isThisWeek(date: Date) {
  return date >= startOfWeek && date < startOfMonth && !isToday(date) && !isYesterday(date);
}
function isThisMonth(date: Date) {
  return date >= startOfMonth && date < startOfYear && !isThisWeek(date) && !isToday(date) && !isYesterday(date);
}
function isThisYear(date: Date) {
  return date >= startOfYear && date < today && !isThisMonth(date) && !isThisWeek(date) && !isToday(date) && !isYesterday(date);
}

function groupNotifications(notifs: typeof notificationsData) {
  const todayArr = [];
  const yesterdayArr = [];
  const weekArr = [];
  const monthArr = [];
  const yearArr = [];
  for (const n of notifs) {
    if (isToday(n.date)) todayArr.push(n);
    else if (isYesterday(n.date)) yesterdayArr.push(n);
    else if (isThisWeek(n.date)) weekArr.push(n);
    else if (isThisMonth(n.date)) monthArr.push(n);
    else if (isThisYear(n.date)) yearArr.push(n);
  }
  return {
    today: todayArr,
    yesterday: yesterdayArr,
    week: weekArr,
    month: monthArr,
    year: yearArr,
  };
}

const NotificationItem = ({ item, onPress }: { item: typeof notificationsData[0]; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`flex-row border-unselected-light items-start mb-3 ${item.highlight ? "bg-blue-50" : "bg-white"} rounded-2xl px-3 py-3`}
    style={{ minHeight: 70, borderWidth: .2 }}
  >
    <Image source={{ uri: item.avatar }} className="w-10 h-10 rounded-full mr-3 mt-1" />
    <View className="flex-1">
      <AppTextR className="text-md text-unselected-dark font-medium mb-1">{item.message}</AppTextR>
      <View className="flex-row items-center mt-1">
        {item.unread && (
          <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
        )}
        <Ionicons name="time-outline" size={14} color="#A0AEC0" className="mr-1" />
        <AppTextR className="text-xs text-unselected-light">{item.time}</AppTextR>
      </View>
    </View>
  </TouchableOpacity>
);

const Section = ({ title, data, onPress }: { title: string; data: typeof notificationsData; onPress: (id: string) => void }) => {
  if (!data.length) return null;
  return (
    <View className="mb-2">
      <AppTextR className="text-xs text-unselected-light mb-2 ml-1 uppercase tracking-widest">{title}</AppTextR>
      {data.map((item) => <NotificationItem key={item.id} item={item} onPress={() => onPress(item.id)} />)}
    </View>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const grouped = groupNotifications(notifications);

  const handlePress = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, unread: false, highlight: false } : n
      )
    );
  };

  const height = Dimensions.get("window").height / 2;
  return (
    <SafeAreaView className="bg-background p-6 pb-28 flex-1">
      <AppTextR className="text-xl text-unselected-light">
        {today.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
      </AppTextR>
      <AppTextB className="text-3xl text-unselected-dark mb-4">Notifications</AppTextB>
      <ScrollView className="pb-28 overflow-hidden " showsVerticalScrollIndicator={false}>
        <Section title="Today" data={grouped.today} onPress={handlePress} />
        <Section title="Yesterday" data={grouped.yesterday} onPress={handlePress} />
        <Section title="This Week" data={grouped.week} onPress={handlePress} />
        <Section title="This Month" data={grouped.month} onPress={handlePress} />
        <Section title="This Year" data={grouped.year} onPress={handlePress} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;