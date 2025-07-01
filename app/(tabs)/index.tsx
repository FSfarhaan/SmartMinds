import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import QuickTiles from "@/components/QuickTiles";
import TileTextImage from "@/components/TileTextImage";
import TilePieChart from "@/components/TilePieChart";
import TileBarChart from "@/components/TileBarChart";
import AppTextSB from "@/components/poppins/AppTextSB";
import AppTextB from "@/components/poppins/AppTextB";
import AppTextR from "@/components/poppins/AppTextR";
import TileDueFees from "@/components/TileDueFees";
import TableStudentData from "@/components/TableStudentData";
import NoticeBlock from "@/components/NoticeBlock";
import TileMoney from "@/components/TileMoney";
import FeesSection from "@/components/FeesSection";

const options = [
  { key: "Dashboard", icon: "grid-outline" },
  { key: "Students", icon: "person-outline" },
  { key: "Notices", icon: "megaphone-outline" },
  { key: "Fees", icon: "business-outline" },
  { key: "Attendance", icon: "calendar-outline" },
];

interface DashboardGridProps {
  selected: string;
  setSelected: (value: string) => void;
}

const DashboardGrid = ({ selected, setSelected }: DashboardGridProps) => {
  return (
    <View className="w-full">
      {/* Header */}
      <View className="flex-row justify-between items-center p-6">
        <View>
          <AppTextR
            className="text-unselected-light text-xl">
            Hello there
          </AppTextR>
          <AppTextB
            className="text-3xl text-unselected-dark"
          >
            Farhaan Shaikh
          </AppTextB>
        </View>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} // Replace with actual user photo
          className="w-10 h-10 rounded-full"
        />
      </View>

      {/* Search bar */}
      <View
        className="flex-row items-center bg-white px-6 py-2 rounded-full shadow-sm border-unselected-dark mx-6 mb-2"
        style={{ borderWidth: 0.2 }}
      >
        <Ionicons name="search-outline" size={24} color="#999" />
        <TextInput
          placeholder="Search student by name"
          placeholderTextColor="#999"
          style={{ fontFamily: "Poppins_400Regular"}}
          className="flex-1 pb-2 px-2 text-gray-700"
        />
        <Ionicons name="mic-outline" size={24} color="#999" />
      </View>

      {/* Grid */}
      <ScrollView className="mt-6 w-full" horizontal showsHorizontalScrollIndicator={false}>
        {options.map((item) => {
          const isActive = selected === item.key;
          return (
            <View
              key={item.key}
              className="w-32 aspect-square flex items-center justify-center" >
              <TouchableOpacity
                onPress={() => setSelected(item.key)}
                style={{ borderWidth: 0.2 }}
                className={`py-5 px-6 rounded-3xl mb-1 border-unselected-dark ${isActive ? "bg-blue-100 border border-blue-500" : "bg-white"
                  } shadow-sm`}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={isActive ? "#007bff" : "#404454"}
                />
              </TouchableOpacity>
              <AppTextR
                className={`mt-1 text-sm ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"
                  }`}
              >
                {item.key}
              </AppTextR>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function Index() {
  const { isAdmin, name, logout } = useAuthStore();
  const [selected, setSelected] = useState("Dashboard");

  return (
    <SafeAreaView className="flex-1 bg-background pb-28">
      <ScrollView>
        <DashboardGrid selected={selected} setSelected={setSelected} />
        <AppTextSB
          className="p-6 pb-3 text-4xl text-unselected-dark" >
          {selected}
        </AppTextSB>


        {selected === "Dashboard" && <View className="px-4 flex flex-row flex-wrap justify-center">
          <TileTextImage item={{
            title: "No. of students",
            content: "Male: 30, Female: 20,\nTotal: 50",
            image: require('@/assets/images/personImage.png'
            )
          }} />

          <TilePieChart item={{
            title: "Fees paid",
            pieData: [
              {
                name: "Paid: " + 30,
                value: 30,
                color: "#4CAF50",
              },
              {
                name: "Pending: " + 10,
                value: 10,
                color: "#404454",
              },
              {
                name: "Due: " + 10,
                value: 10,
                color: "#F44336",
              },
            ],
          }} />

          <TileBarChart item={{
            title: "Fees collected (2025)",
            barData: {
              labels: ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
              datasets: [{ data: [45000, 30000, 35000, 40000, 50000, 38000, 42000, 47000, 31000, 44000, 39000, 46000] }],
            },
            color: "rgba(22, 114, 236, 1)"
          }} />

          <TileDueFees dues={[
            { name: "Ali Asghar", dueInDays: 5 }
          ]} />
        </View>}

        {selected === "Students" && <View className="px-4 flex flex-row flex-wrap justify-center">
          <TableStudentData />
          </View>}

        {selected === "Notices" && <NoticeBlock />}

        {selected === "Fees" && <View className="px-4 flex flex-row flex-wrap justify-center">
          {/* <TileMoney item={{
            title: "Total Fees",
            content: "₹50,000"
          }} />
          <TileMoney item={{
            title: "Fees Collected",
            content: "₹30,000"
          }} /> */}

          <FeesSection />
          
          </View> }


      </ScrollView>
    </SafeAreaView>
  );
}
