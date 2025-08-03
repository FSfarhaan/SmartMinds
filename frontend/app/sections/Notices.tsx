import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextR from "../../components/poppins/AppTextR";
import AppTextSB from "../../components/poppins/AppTextSB";
import { Notice } from "../../types/NoticeTypes";
import { usePostData } from "@/hooks/usePostData";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { postNotices } from "@/apis/postRequest";
import { getAllNotices } from "@/apis/getRequests";
import { useFetchData } from "@/hooks/useFetchData";

const sampleNotices: Notice[] = [
  {
    _id: "1",
    title: "Holiday and Vacation Notices",
    date: "2025-02-14",
    subtitle: "Valentine's Day",
    content:
      "The school will remain closed on 14th Feb 2025 on account of Valentine's Day. We hope you enjoy the holiday with your loved ones.",
  },
  {
    _id: "2",
    title: "Event Invitations",
    date: "2025-06-28",
    subtitle: "Behdienkhlam Festival",
    content:
      "You are cordially invited to the Behdienkhlam Festival celebration at our school auditorium. The event will feature traditional dances, music, and food.",
  },
  {
    _id: "3",
    title: "Fee Payment",
    date: "2025-06-10",
    subtitle: "Upcoming Deadline",
    content:
      "We hope this message finds you in good health and high spirits. Circulars reminding students and parents about upcoming fee payment deadlines is on 20-07-2025.",
  },
];

export const formatToDateOnly = (isoString: string): string => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are 0-based
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};


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
              {formatToDateOnly(item.date)}
            </AppTextR>
          )}
        </View>
        {!isExpanded && (
          <View className="flex-row items-center mt-1">
            <AppTextR className="text-sm text-unselected-light">
            {formatToDateOnly(item.date)}
            </AppTextR>
            <AppTextR className="text-sm text-gray-500 mx-2">|</AppTextR>
            <AppTextR className="text-sm text-unselected-dark w-1/2" numberOfLines={1}>
              {item.subtitle}
            </AppTextR>
          </View>
        )}
        {isExpanded && (
          <View className="mt-3">
            <AppTextR className="text-base text-unselected-light leading-relaxed">
              {item.content}
            </AppTextR>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const NoticeModal = ({
  visible,
  onClose,
  notice = null,
  onSubmit,
  onDelete }: {
  visible: boolean;
  onClose: () => void;
  notice?: Notice | null;
  onSubmit: (noticeData: Notice) => Promise<void>;
  onDelete?: (_id: string) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: ""
  });

  const isEditing = !!notice;

  // Initialize form data when student is provided (editing mode)
  useEffect(() => {
    if (notice) {
      // Split name into first and last name
      const title = notice.title;
      const subtitle = notice.subtitle;
      const content = notice.content;

      setFormData({
        title: title,
        subtitle: subtitle,
        content: content
      });
    } else {
      // Reset form for new student
      setFormData({
        title: "",
        subtitle: "",
        content: ""
      });
    }
  }, [notice]);

  const handleSubmit = async() => {
    try {
      const noticeData = {
        _id: Date.now().toString(),
        title: formData.title,
        subtitle: formData.subtitle,
        content: formData.content,
        date: Date.now().toString()
      }

      await onSubmit(noticeData);
      setFormData({ title: "", subtitle: "", content: ""})

      onClose();
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        onPress={onClose}
      >
        <Pressable className="bg-white rounded-t-2xl p-4 absolute bottom-0 w-full max-h-[90%]">
          <View className="flex-row justify-between items-center mb-4">
            <AppTextSB className="text-xl">
              {isEditing ? "Edit Notice" : "Add New Notice"}
            </AppTextSB>
            <View className="flex-row">
              {/* {isEditing && (
                <TouchableOpacity className="mr-4" onPress={handleDelete}>
                  <Ionicons name="trash" size={24} color="#ef4444" />
                </TouchableOpacity>
              )} */}
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
              
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="max-h-[70vh]"
          >
            <>
              {/* Title Row */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Title
                  </AppTextR>
                  <TextInput
                    value={formData.title}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, title: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter title"
                    style={{ fontSize: 16 }}
                  />
                </View>
                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Subtitle
                  </AppTextR>
                  <TextInput
                    value={formData.subtitle}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, subtitle: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter Subtitle"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>


              {/* Content */}
              <View className="flex-row mt-4">
                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Content
                  </AppTextR>
                  <TextInput
                    value={formData.content}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, content: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter content"
                    style={{ fontSize: 16 }}
                  />
                </View>                
              </View>              
            </>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row mt-8 space-x-3">
            {/* <TouchableOpacity
              onPress={onClose}
              className="flex-1 border border-redShade-dark py-3 rounded-lg items-center mr-2"
            >
              <AppTextSB className="text-redShade-dark">Cancel</AppTextSB>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 bg-primary py-3 rounded-lg items-center"
            >
              <AppTextSB className="text-white">
                {isEditing ? "Save" : "Submit"}
              </AppTextSB>
            </TouchableOpacity>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
  
}


const Notices = ( { isAdmin} : { isAdmin: boolean }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noticeFilter, setNoticeFilter] = useState<
    "Show all" | "week" | "month" | "year"
  >("Show all");
  const [noticeDropdownOpen, setNoticeDropdownOpen] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [sampleNotices, setSampleNotices] = useState<Notice[]>([]);
  const filteredNotices = filterNoticesByDate(sampleNotices, noticeFilter);

  const fetchData = async () => {
    const response = await getAllNotices();
    return response;
  };

  const { data, loading, error } = useFetchData(fetchData);
  const { data: noticeData, loading: noticeLoading, error: noticeError, postData } = usePostData();

  useEffect(() => {
    if (noticeData) {
      console.log("Sab badhiya:", noticeData);
      // @ts-ignore
      setSampleNotices(prev => [...prev, noticeData]);
    }
  
    if (noticeError) {
      console.log("Gadbad hai:", noticeError);
    }
  }, [noticeData, noticeError]);

  useEffect(() => {
    if (data) {
      // console.log(data);
      setSampleNotices(data);
    }
  }, [data]);

  const handlePress = (_id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === _id ? null : _id);
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

        {isAdmin && <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg flex-row items-center justify-center"
            onPress={() => handleOpenModal()}>
          <Ionicons
            name={"document-attach"}
            size={12}
            color="#ffffff"
            style={{ marginRight: 5 }}
          />
          <AppTextSB className="text-white text-sm font-semibold">
            Add Notice
          </AppTextSB>
        </TouchableOpacity>}
      </View>
    );
  };

  const handleSubmitNotice = async (noticeData: Notice) => {
    // TODO: Implement API call to create student
    const { _id, ...actualData } = noticeData;
    console.log("Creating student:");

    await postData(() => postNotices(actualData));
    
  };

  const handleUpdateNotice = async (noticeData: Notice) => {
    // TODO: Implement API call to update student
    console.log("Updating student:", editingNotice?._id, noticeData);
    if (editingNotice) {
      setSampleNotices((prev) =>
        prev.map((notice) =>
          notice._id === editingNotice._id
            ? { ...notice, ...noticeData }
            : notice
        )
      );
    }
  };

  const handleNoticeSubmit = async (noticeData: Notice) => {
    if (editingNotice) {
      await handleUpdateNotice(noticeData);
    } else {
      await handleSubmitNotice(noticeData);
    }
  };

  const handleOpenModal = (notice?: Notice) => {
    setEditingNotice(notice || null);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingNotice(null);
  };

  return (
    <View className="p-6 pt-2 w-full">
      {/* Header with Filter and Add Button */}
      {renderHeader()}

      <NoticeModal visible={isModalVisible} onClose={handleCloseModal} onSubmit={handleNoticeSubmit} notice={editingNotice}  />

      <FlatList
        data={filteredNotices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NoticeItem
            item={item}
            isExpanded={expandedId === item._id}
            onPress={() => handlePress(item._id)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

export default Notices;
