import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextSB from "@/components/poppins/AppTextSB";
import AppTextR from "@/components/poppins/AppTextR";
import AppTextB from "@/components/poppins/AppTextB";
import TilePieChart from "@/components/TilePieChart";
import { FeeData } from "@/types/FeesTypes";
import ShowMoreLess from "@/components/ShowMoreLess";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type FeeStatus = "Paid" | "Pending" | "Due";
type ActiveTab = "All" | "Paid" | "Pending" | "Due";

type MonthFilter = "Show all" | (typeof monthNames)[number];

// Generate sample data for each month up to current month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonthIndex = now.getMonth();
const monthsUpToNow = monthNames.slice(0, currentMonthIndex + 1);

const sampleFeeData: FeeData[] = monthsUpToNow.flatMap((month, idx) => [
  {
    id: `${idx + 1}-1`,
    name: `Farhaan Shaikh`,
    avatar: `https://randomuser.me/api/portraits/men/${idx + 1}.jpg`,
    status: "Paid",
    amount: 10000 + idx * 1000,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-10`,
  },
  {
    id: `${idx + 1}-2`,
    name: `Aditya Jambhale`,
    avatar: `https://randomuser.me/api/portraits/women/${idx + 1}.jpg`,
    status: "Pending",
    amount: 9000 + idx * 900,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-15`,
  },
  {
    id: `${idx + 1}-3`,
    name: `Sejal Khilari`,
    avatar: `https://randomuser.me/api/portraits/women/${idx + 11}.jpg`,
    status: "Paid",
    amount: 8000 + idx * 800,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-20`,
  },
  {
    id: `${idx + 1}-4`,
    name: `Atharva Khond`,
    avatar: `https://randomuser.me/api/portraits/men/${idx + 11}.jpg`,
    status: "Due",
    amount: 8000 + idx * 800,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-20`,
  },
  {
    id: `${idx + 1}-5`,
    name: `Tamasi Ghosh`,
    avatar: `https://randomuser.me/api/portraits/women/${idx + 10}.jpg`,
    status: "Due",
    amount: 8000 + idx * 800,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-20`,
  },
  {
    id: `${idx + 1}-6`,
    name: `Aniket Salvi`,
    avatar: `https://randomuser.me/api/portraits/men/${idx + 7}.jpg`,
    status: "Paid",
    amount: 8000 + idx * 800,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-20`,
  },
  {
    id: `${idx + 1}-7`,
    name: `Diksha Tamhankar`,
    avatar: `https://randomuser.me/api/portraits/women/${idx + 7}.jpg`,
    status: "Pending",
    amount: 8000 + idx * 800,
    dueDate: `${currentYear}-${String(idx + 1).padStart(2, "0")}-20`,
  },
]);

const StatusTag = ({ status }: { status: FeeStatus }) => {
  const bgColor =
    status === "Paid"
      ? "bg-green-100"
      : status === "Due"
      ? "bg-red-100"
      : "bg-gray-100";
  const textColor =
    status === "Paid"
      ? "text-green-700"
      : status === "Due"
      ? "text-red-700"
      : "text-gray-700";

  return (
    <View className={`px-3 py-1 rounded-full ${bgColor}`}>
      <AppTextSB className={`font-semibold text-xs ${textColor}`}>
        {status}
      </AppTextSB>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const pieChartSize = screenWidth - 64;

const FeesSection = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("All");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>(
    monthNames[currentMonthIndex]
  );
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  // Dropdown options: Show all + months up to current
  const monthOptions: MonthFilter[] = [...monthsUpToNow];

  // Filter by month
  const monthFilteredData = useMemo(() => {
    if (monthFilter === "Show all") return sampleFeeData;
    const monthIdx = monthNames.indexOf(monthFilter);
    return sampleFeeData.filter((item) => {
      const itemMonth = new Date(item.dueDate).getMonth();
      return itemMonth === monthIdx;
    });
  }, [monthFilter]);

  // Filter by status tab
  const filteredData = useMemo(() => {
    if (activeTab === "Paid")
      return monthFilteredData.filter((item) => item.status === "Paid");
    if (activeTab === "Pending")
      return monthFilteredData.filter((item) => item.status === "Pending");
    if (activeTab === "Due")
      return monthFilteredData.filter((item) => item.status === "Due");
    return monthFilteredData;
  }, [activeTab, monthFilteredData]);

  const dataToShow = filteredData.slice(0, visibleCount);

  // Pie chart data
  const { totalFees, totalPaid, totalDue, pieData } = useMemo(() => {
    const paid = monthFilteredData
      .filter((f) => f.status === "Paid")
      .reduce((sum, f) => sum + f.amount, 0);
    const due = monthFilteredData
      .filter((f) => f.status === "Due")
      .reduce((sum, f) => sum + f.amount, 0);
    const pending = monthFilteredData
      .filter((f) => f.status === "Pending")
      .reduce((sum, f) => sum + f.amount, 0);
    const total = paid + due + pending;
    return {
      totalFees: total,
      totalPaid: paid,
      totalDue: due,
      pieData: [
        { name: "Paid", value: paid, color: "#4CAF50" },
        { name: "Pending", value: pending, color: "#404454" },
        { name: "Due", value: due, color: "#F44336" },
      ],
    };
  }, [monthFilteredData]);

  const renderHeader = () => {
    return (
      <View className="w-full flex-row justify-between items-center">
        <AppTextR className="text-lg font-normal text-unselected-dark">
          Fees Collection
        </AppTextR>
        <View style={{ position: "relative", minWidth: 100 }}>
          <TouchableOpacity
            className="flex-row justify-between items-center bg-gray-100 py-2 px-3 rounded-lg"
            onPress={() => setMonthDropdownOpen((open) => !open)}
          >
            <AppTextR className="text-base text-unselected-dark mr-2">
              {monthFilter}
            </AppTextR>
            <Ionicons name={"chevron-down"} size={16} color="#333" />
          </TouchableOpacity>
          {monthDropdownOpen && (
            <View
              style={{
                position: "absolute",
                top: 44,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
              className="bg-white rounded-lg shadow shadow-black"
            >
              {monthOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="px-4 py-2"
                  onPress={() => {
                    setMonthFilter(option);
                    setMonthDropdownOpen(false);
                  }}
                >
                  <AppTextR className=" text-unselected-dark">
                    {option}
                  </AppTextR>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLegend = (background: string, title: string) => {
    return (
      <View className="items-center">
        <View className="flex-row items-center">
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: background,
              borderRadius: 5,
              marginRight: 5,
            }}
          />
          <AppTextR className="text-gray-500 text-sm">{title}</AppTextR>
        </View>
        <AppTextSB className={`text-base`} style={{ color: background }}>
          ${totalPaid.toFixed(2)}
        </AppTextSB>
      </View>
    );
  };

  const renderRow = (item: FeeData, index: number) => {
    return (
      <View
        className={`flex-row items-center ${
          index % 2 !== 0 ? "bg-blue-50" : "bg-white"
        }  rounded-2xl p-4 mb-3 border-unselected-dark`}
        style={{ borderWidth: 0.2 }}
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-10 h-10 rounded-full mr-4"
        />
        <View className="flex-1">
          <AppTextSB className=" text-base text-unselected-dark">
            {item.name}
          </AppTextSB>
          <AppTextR className="text-sm text-unselected-light">
            Due on {item.dueDate}
          </AppTextR>
        </View>
        <StatusTag status={item.status} />
      </View>
    );
  };

  return (
    <View className="p-6 pt-2 w-full">
      <View
        className="bg-white rounded-2xl p-4 pt-2 items-center justify-center mb-6 border-unselected-dark"
        style={{ borderWidth: 0.2 }}
      >
        {/* Header */}
        {renderHeader()}

        <TilePieChart
          item={{
            pieData,
            width: pieChartSize,
            height: pieChartSize / 2,
            //@ts-ignore
            pLeft: pieChartSize / 4,
            showLegends: false,
          }}
        />

        <AppTextB className="text-3xl text-unselected-dark">
          ${totalFees.toFixed(2)}
        </AppTextB>
        <AppTextR className="text-sm text-gray-500 mb-4">Total fees</AppTextR>
        <View className="flex-row justify-around w-full">
          {renderLegend("#4CAF50", "Paid")}
          {renderLegend("#404454", "Pending")}
          {renderLegend("#F44336", "Due")}
        </View>
      </View>

      {/* Fees Data List */}
      <AppTextSB className="text-2xl mb-3 text-unselected-dark">
        Fees Data
      </AppTextSB>
      <View
        className="flex-row mb-4"
        style={{ borderBottomWidth: 0.2, borderBottomColor: "gray" }}
      >
        {["All", "Paid", "Pending", "Due"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as ActiveTab)}
            className="mr-4"
            style={{
              borderBottomWidth: activeTab === tab ? 2 : 0,
              borderBottomColor: "#1672EC",
            }}
          >
            <AppTextR
              className={`text-base font-semibold ${
                activeTab === tab ? "text-primary" : "text-unselected-light"
              }`}
            >
              {tab}
            </AppTextR>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item, index }) => renderRow(item, index)}
      />

      <ShowMoreLess 
        filteredData={filteredData} 
        sampleData={sampleFeeData} 
        setVisibleCount={setVisibleCount} 
        visibleCount={visibleCount}
      />
    
    </View>
  );
};

export default FeesSection;
