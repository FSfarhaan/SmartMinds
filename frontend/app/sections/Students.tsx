import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AppTextR from "../../components/poppins/AppTextR";
import AppTextSB from "../../components/poppins/AppTextSB";
import StudentTableRow from "../../components/StudentTableRow";
import {
  Student,
  StudentFilterState,
  StudentSortState,
} from "../../types/StudentTypes";
import ShowMoreLess from "../../components/ShowMoreLess";
import { getAllStudents } from "@/apis/getRequests";
import { useFetchData } from "@/hooks/useFetchData";
import { usePostData } from "@/hooks/usePostData";
import { postStudent } from "@/apis/postRequest";
import axios from "axios";

const columns = [
  { key: "name", label: "Name" },
  { key: "gender", label: "Gender" },
  { key: "std", label: "Std" },
  { key: "school", label: "School" },
  { key: "phone", label: "Phone" },
  { key: "shift", label: "Shift" },
  { key: "joiningDate", label: "Joining Date" },
  { key: "leavingDate", label: "Leaving Date" },
  { key: "feesTotal", label: "Fees Total" },
];

// Student Modal Form Component
const StudentModalForm = ({
  visible,
  onClose,
  student = null,
  onSubmit,
  onDelete,
}: {
  visible: boolean;
  onClose: () => void;
  student?: Student | null;
  onSubmit: (studentData: Student) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "male" as "male" | "female",
    std: "",
    school: "",
    phone: "",
    shiftNumber: "",
    joiningDate: "",
    feesTotal: 0,
  });

  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const shiftOptions = ["Shift 1", "Shift 2", "Shift 3"];

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Convert date to YYYY-MM-DD format
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isEditing = !!student;

  // Initialize form data when student is provided (editing mode)
  useEffect(() => {
    if (student) {
      // Split name into first and last name
      const nameParts = student.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        firstName,
        lastName,
        gender: student.gender,
        std: student.std,
        school: student.school,
        phone: student.phone,
        shiftNumber: student.shiftNumber,
        joiningDate: student.joiningDate.split("T")[0],
        feesTotal: student.feesTotal,
      });
    } else {
      // Reset form for new student
      setFormData({
        firstName: "",
        lastName: "",
        gender: "male",
        std: "",
        school: "",
        phone: "",
        shiftNumber: "",
        joiningDate: getCurrentDate(),
        feesTotal: 0,
      });
    }
  }, [student]);

  const handleSubmit = async () => {
    try {
      // Merge first and last name
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const studentData = {
        _id: Date.now().toString(),
        name,
        gender: formData.gender,
        std: formData.std,
        school: formData.school,
        phone: formData.phone,
        shiftNumber: formData.shiftNumber.split(" ")[1],
        joiningDate: formData.joiningDate,
        feesTotal: formData.feesTotal,
      };
      await onSubmit(studentData);
      setFormData({
        firstName: "",
        lastName: "",
        gender: "male",
        std: "",
        school: "",
        phone: "",
        shiftNumber: "",
        joiningDate: getCurrentDate(),
        feesTotal: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting student:", error);
    }
  };

  // const handleDelete = () => {
  //   if (!student) return;

  //   Alert.alert(
  //     "Delete Student",
  //     "Do you really want to delete this student?",
  //     [
  //       { text: "No", style: "cancel" },
  //       {
  //         text: "Yes",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             await onDelete?.(student._id);
  //             onClose();
  //           } catch (error) {
  //             console.error("Error deleting student:", error);
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };

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
              {isEditing ? "Edit Student" : "Add New Student"}
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
              {/* Name Row */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    First Name
                  </AppTextR>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, firstName: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="First name"
                    style={{ fontSize: 16 }}
                  />
                </View>
                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Last Name
                  </AppTextR>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, lastName: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Last name"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              {/* Gender */}
              <>
                <AppTextR className="text-sm  mb-2 text-gray-700">
                  Gender
                </AppTextR>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className={`flex-1 py-2 rounded-lg border mr-2 ${
                      formData.gender === "male"
                        ? "bg-primary border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, gender: "male" }))
                    }
                  >
                    <AppTextR
                      className={`text-center ${formData.gender === "male" ? "text-white" : "text-gray-700"}`}
                    >
                      Male
                    </AppTextR>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-2 rounded-lg border ${
                      formData.gender === "female"
                        ? "bg-primary border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onPress={() =>
                      setFormData((prev) => ({ ...prev, gender: "female" }))
                    }
                  >
                    <AppTextR
                      className={`text-center ${formData.gender === "female" ? "text-white" : "text-gray-700"}`}
                    >
                      Female
                    </AppTextR>
                  </TouchableOpacity>
                </View>
              </>

              {/* Joining Date */}
              <View className="flex-row space-x-3 mt-4">
                <View className="flex-1 mr-2">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Joining Date
                  </AppTextR>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white flex-row justify-between items-center"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <AppTextR
                      className="text-unselected-dark"
                      style={{ fontSize: 16 }}
                    >
                      {formData.joiningDate || "Now"}
                    </AppTextR>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>

                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Shift
                  </AppTextR>
                  <View className="relative">
                    <TouchableOpacity
                      className="border border-gray-300 rounded-lg bg-white px-3 py-3 flex-row justify-between items-center"
                      onPress={() =>
                        setIsShiftDropdownOpen(!isShiftDropdownOpen)
                      }
                    >
                      <AppTextR
                        className="text-unselected-dark"
                        style={{ fontSize: 16 }}
                      >
                        {formData.shiftNumber || "Select shift"}
                      </AppTextR>
                      <Ionicons
                        name={
                          isShiftDropdownOpen ? "chevron-up" : "chevron-down"
                        }
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>

                    {isShiftDropdownOpen && (
                      <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
                        {shiftOptions.map((shift) => (
                          <TouchableOpacity
                            key={shift}
                            className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                            onPress={() => {
                              setFormData((prev) => ({
                                ...prev,
                                shiftNumber: shift,
                              }));
                              setIsShiftDropdownOpen(false);
                            }}
                          >
                            <AppTextR
                              className="text-gray-700"
                              style={{ fontSize: 16 }}
                            >
                              {shift}
                            </AppTextR>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Standard and Shift Row */}
              <View className="flex-row space-x-3 mt-4">
                <View className="flex-1 mr-2">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Standard
                  </AppTextR>
                  <TextInput
                    value={formData.std}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, std: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 bg-white"
                    placeholder="Enter standard"
                    keyboardType="numeric"
                    style={{ fontSize: 16 }}
                  />
                </View>

                {/* Fees Total */}
                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Total Fees
                  </AppTextR>
                  <TextInput
                    value={formData.feesTotal.toString()}
                    onChangeText={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        feesTotal: Number(text) || 0,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter fees total"
                    keyboardType="numeric"
                    style={{ fontSize: 16 }}
                  />
                </View>
              </View>

              {/* School */}
              <View className="flex-row mt-4">
                <View className="flex-1 mr-2">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    School
                  </AppTextR>
                  <TextInput
                    value={formData.school}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, school: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter school name"
                    style={{ fontSize: 16 }}
                  />
                </View>

                {/* Phone */}
                <View className="flex-1">
                  <AppTextR className="text-sm  mb-2 text-gray-700">
                    Phone
                  </AppTextR>
                  <TextInput
                    value={formData.phone}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, phone: text }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-3 bg-white"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
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

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setFormData((prev) => ({
                    ...prev,
                    joiningDate: formatDate(date),
                  }));
                }
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const StudentData = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<StudentFilterState>({});
  const [tempFilter, setTempFilter] = useState<StudentFilterState>({});
  const [sort, setSort] = useState<StudentSortState>({
    key: "name",
    direction: "asc",
  });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isStudentModalVisible, setStudentModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [sampleStudents, setSampleStudent] = useState<Student[]>([]);

  const fetchData = async () => {
    const response = await getAllStudents();
    return response;
  };

  const { data, loading, error } = useFetchData(fetchData);
  const { data: stuData, loading: stuLoading, error: stuError, postData } = usePostData();

  useEffect(() => {
    if (stuData) {
      console.log("Sab badhiya:", stuData);
      // @ts-ignore
      setSampleStudent(prev => [...prev, stuData]);
    }
  
    if (stuError) {
      console.log("Gadbad hai:", stuError);
    }
  }, [stuData, stuError]);
  


  useEffect(() => {
    if (data) {
      // console.log(data);
      setSampleStudent(data);
    }
  }, [data]);

  // API Functions (to be implemented by user)
  const handleSubmitStudent = async (studentData: Student) => {
    // TODO: Implement API call to create student
    const { _id, ...actualData } = studentData;
    console.log("Creating student:");

    await postData(() => postStudent(actualData));
    
  };

  const handleUpdateStudent = async (studentData: Student) => {
    // TODO: Implement API call to update student
    console.log("Updating student:", editingStudent?._id, studentData);
    if (editingStudent) {
      setSampleStudent((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? { ...student, ...studentData }
            : student
        )
      );
    }
  };

  // const handleDeleteStudent = async (id: string) => {
  //   // TODO: Implement API call to delete student
  //   console.log("Deleting student:", id);
  //   setSampleStudent((prev) => prev.filter((student) => student._id !== id));
  // };

  const handleOpenStudentModal = (student?: Student) => {
    setEditingStudent(student || null);
    setStudentModalVisible(true);
  };

  const handleCloseStudentModal = () => {
    setStudentModalVisible(false);
    setEditingStudent(null);
  };

  const handleStudentSubmit = async (studentData: Student) => {
    if (editingStudent) {
      await handleUpdateStudent(studentData);
    } else {
      await handleSubmitStudent(studentData);
    }
  };

  const filterOptions = {
    gender: ["male", "female"],
    std: [...new Set(sampleStudents.map((s) => s.std))].sort(
      (a, b) => Number(a) - Number(b)
    ),
    school: [...new Set(sampleStudents.map((s) => s.school))],
    shift: [...new Set(sampleStudents.map((s) => s.shiftNumber))],
  };

  // Filtering
  let filteredStudents = sampleStudents.filter((s) => {
    let pass = true;
    if (filter.gender) pass = pass && s.gender === filter.gender;
    if (filter.std) pass = pass && s.std === filter.std;
    if (filter.school) pass = pass && s.school === filter.school;
    if (filter.shiftNumber) pass = pass && s.shiftNumber === filter.shiftNumber;
    return pass;
  });

  // Sorting
  filteredStudents.sort((a, b) => {
    const { key, direction } = sort;
    //@ts-ignore
    let aVal: string | number = a[key] ?? "";
    //@ts-ignore
    let bVal: string | number = b[key] ?? "";

    if (key === "std" || key === "feesTotal") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else if (typeof aVal === "string" && typeof bVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const studentsToShow = filteredStudents.slice(0, visibleCount);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleOpenFilterModal = () => {
    setTempFilter(filter);
    setFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    setFilter(tempFilter);
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setTempFilter({});
    setFilter({});
    setFilterModalVisible(false);
  };

  const toggleSortDirection = () => {
    setSort((prev) => ({
      ...prev,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderHeader = () => {
    return (
      <View
        className="flex-row items-center bg-blue-200  mb-4 border-primary rounded-xl"
        style={{ borderWidth: 0.3 }}
      >
        <View
          style={{
            width: 50,
            alignItems: "center",
            justifyContent: "center",
            height: 48,
          }}
        />
        {columns.map((col) => (
          <TouchableOpacity
            key={col.key}
            style={{
              width: col.key === "name" ? 150 : 120,
              alignItems: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
            className="justify-center flex-row items-center"
            onPress={() =>
              setSort({
                key: col.key as keyof Student,
                direction: sort.direction === "asc" ? "desc" : "asc",
              })
            }
          >
            <AppTextSB className="text-unselected-dark" numberOfLines={1}>
              {col.label}
            </AppTextSB>
            {sort.key === col.key && (
              <Ionicons
                name={sort.direction === "asc" ? "arrow-up" : "arrow-down"}
                size={12}
                color="#1672EC"
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setFilterModalVisible(false)}
        >
          <Pressable className="bg-white rounded-t-2xl p-4 absolute bottom-0 w-full">
            <AppTextSB className="text-xl mb-4">Filters</AppTextSB>
            <ScrollView>
              {Object.entries(filterOptions).map(([key, options]) => (
                <View key={key} className="mb-4">
                  <AppTextR className="text-base  capitalize mb-2">
                    {key}
                  </AppTextR>
                  <View className="flex-row flex-wrap gap-2">
                    {options.map((option) => (
                      <TouchableOpacity
                        key={option}
                        className={`px-4 py-2 rounded-full ${
                          tempFilter[key as keyof StudentFilterState] === option
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                        onPress={() =>
                          setTempFilter((prev) => ({ ...prev, [key]: option }))
                        }
                      >
                        <AppTextSB
                          className={` ${
                            tempFilter[key as keyof StudentFilterState] ===
                            option
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {option}
                        </AppTextSB>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="flex-row mt-4">
              <TouchableOpacity
                onPress={handleClearFilter}
                className="flex-1 border border-gray-300 py-3 rounded-lg mr-2 items-center"
              >
                <AppTextSB>Clear</AppTextSB>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApplyFilter}
                className="flex-1 bg-primary py-3 rounded-lg items-center"
              >
                <AppTextSB className="text-white">Apply Filters</AppTextSB>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  const renderTopBar = () => {
    return (
      <>
        <AppTextSB className="text-lg  text-gray-700">
          {filteredStudents.length} Students Found
        </AppTextSB>
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            {/* Sort By */}
            <TouchableOpacity
              onPress={toggleSortDirection}
              className="flex-row items-center mr-3"
            >
              <AppTextR className="text-sm text-gray-600 mr-1">
                Sort by: {sort.key}
              </AppTextR>
              <Ionicons
                name={
                  sort.direction === "asc"
                    ? "arrow-up-outline"
                    : "arrow-down-outline"
                }
                size={16}
                color="#333"
              />
            </TouchableOpacity>
            {/* Filter */}
            <TouchableOpacity
              onPress={handleOpenFilterModal}
              className="flex-row items-center mr-3"
            >
              <AppTextR className="text-sm text-gray-600 mr-1">Filter</AppTextR>
              <Ionicons name="filter-outline" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          {/* Add Student */}
          <TouchableOpacity
            className="bg-primary px-3 py-2 rounded-lg flex-row items-center justify-center"
            onPress={() => handleOpenStudentModal()}
          >
            <Ionicons
              name={"person-add"}
              size={12}
              color="#ffffff"
              style={{ marginRight: 5 }}
            />
            <AppTextSB className="text-white text-sm ">Add Student</AppTextSB>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View className="w-full rounded-2xl p-6 pt-0">
      {/* Top Bar */}
      {renderTopBar()}

      {/* Filter Modal */}
      {renderModal()}

      {/* Student Modal Form */}
      <StudentModalForm
        visible={isStudentModalVisible}
        onClose={handleCloseStudentModal}
        student={editingStudent}
        onSubmit={handleStudentSubmit}
        // onDelete={handleDeleteStudent}
      />

      {/* Table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ minWidth: 900 }}
      >
        <View>
          {/* Headers */}
          {renderHeader()}

          {/* Rows */}
          <FlatList
            data={studentsToShow}
            
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <StudentTableRow
                item={item}
                index={index}
                selected={selected}
                toggleSelect={toggleSelect}
                onEdit={handleOpenStudentModal}
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Load more / Show less */}

      <ShowMoreLess
        filteredData={filteredStudents}
        sampleData={sampleStudents}
        setVisibleCount={setVisibleCount}
        visibleCount={visibleCount}
      />
    </View>
  );
};

export default StudentData;
