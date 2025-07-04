import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextR from "@/components/poppins/AppTextR";
import AppTextSB from "@/components/poppins/AppTextSB";
import { Notice } from "@/types/NoticeTypes";

const sampleNotices: Notice[] = [
  {
    id: "1",
    title: "Holiday and Vacation Notices",
    date: "2025-02-14",
    subtitle: "Valentine's Day",
    details:
      "The school will remain closed on 14th Feb 2025 on account of Valentine's Day. We hope you enjoy the holiday with your loved ones.",
  },
  {
    id: "2",
    title: "Event Invitations",
    date: "2025-06-28",
    subtitle: "Behdienkhlam Festival",
    details:
      "You are cordially invited to the Behdienkhlam Festival celebration at our school auditorium. The event will feature traditional dances, music, and food.",
  },
  {
    id: "3",
    title: "Fee Payment",
    date: "2025-06-10",
    subtitle: "Upcoming Deadline",
    details:
      "We hope this message finds you in good health and high spirits. Circulars reminding students and parents about upcoming fee payment deadlines is on 20-07-2025.",
  },
];

const filterNoticesByDate = (
  notices: Notice[],
  filter: "Show all" | "week" | "month" | "year"
) => {
  if (filter === "Show all") return notices;
  const now = new Date();

  return notices.filter((notice) => {
    // Normalize date string: remove suffix (st, nd, rd, th) and parse to Date
    const noticeDate = new Date(notice.date); // clean ISO parsing

    if (isNaN(noticeDate.getTime())) return false; // Skip invalid dates

    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return noticeDate >= weekAgo && noticeDate <= now;
    } else if (filter === "month") {
      return (
        noticeDate.getMonth() === now.getMonth() &&
        noticeDate.getFullYear() === now.getFullYear()
      );
    } else if (filter === "year") {
      return noticeDate.getFullYear() === now.getFullYear();
    }

    return true;
  });
}

const NoticeItem = ({
  item,
  isExpanded,
  onPress,
}: {
  item: Notice;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        className={`bg-white rounded-2xl p-4 mb-4 border-unselected-dark ${
          isExpanded ? "bg-gray-50" : ""
        }`}
        style={{ borderWidth: 0.2 }}
      >
        <View className="flex-row justify-between items-start">
          <AppTextSB className="text-lg text-unselected-dark flex-1">
            {item.title}
          </AppTextSB>
          {isExpanded && (
            <AppTextR className="text-sm text-unselected-light">
              {item.date}
            </AppTextR>
          )}
        </View>
        {!isExpanded && (
          <View className="flex-row items-center mt-1">
            <AppTextR className="text-sm text-unselected-light">
              {item.date}
            </AppTextR>
            <AppTextR className="text-sm text-gray-500 mx-2">|</AppTextR>
            <AppTextR className="text-sm text-unselected-dark">
              {item.subtitle}
            </AppTextR>
          </View>
        )}
        {isExpanded && (
          <View className="mt-3">
            <AppTextR className="text-base text-unselected-light leading-relaxed">
              {item.details}
            </AppTextR>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const NoticeBlock = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noticeFilter, setNoticeFilter] = useState<
    "Show all" | "week" | "month" | "year"
  >("Show all");
  const [noticeDropdownOpen, setNoticeDropdownOpen] = useState(false);

  const filteredNotices = filterNoticesByDate(sampleNotices, noticeFilter);

  const handlePress = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderHeader = () => {
    return (
      <View className="flex-row justify-between items-center mb-4">
        <View style={{ position: "relative", width: "30%" }}>
          <TouchableOpacity
            className="flex-row items-center bg-white py-2 rounded-lg justify-around border-primary"
            style={{ borderWidth: 0.2 }}
            onPress={() => setNoticeDropdownOpen((open) => !open)}
          >
            <AppTextR className="text-base text-gray-700 mr-2">
              {noticeFilter === "Show all"
                ? "Show all"
                : noticeFilter === "week"
                ? "This Week"
                : noticeFilter === "month"
                ? "This Month"
                : "This Year"}
            </AppTextR>
            <Ionicons
              name={noticeDropdownOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#333"
            />
          </TouchableOpacity>
          {noticeDropdownOpen && (
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
              {(["Show all", "week", "month", "year"] as const).map(
                (option) => (
                  <TouchableOpacity
                    key={option}
                    className="px-4 py-2"
                    onPress={() => {
                      setNoticeFilter(option);
                      setNoticeDropdownOpen(false);
                    }}
                  >
                    <AppTextR className="text-base text-gray-700">
                      {option === "Show all"
                        ? "Show all"
                        : option === "week"
                        ? "This Week"
                        : option === "month"
                        ? "This Month"
                        : "This Year"}
                    </AppTextR>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
        </View>
        <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg flex-row items-center justify-center">
          <Ionicons
            name={"document-attach"}
            size={12}
            color="#ffffff"
            style={{ marginRight: 5 }}
          />
          <AppTextSB className="text-white text-sm font-semibold">
            Add Notice
          </AppTextSB>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="p-6 pt-0 w-full">
      {/* Header with Filter and Add Button */}
      {renderHeader()}

      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoticeItem
            item={item}
            isExpanded={expandedId === item.id}
            onPress={() => handlePress(item.id)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

export default NoticeBlock;
