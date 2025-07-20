import React, { useState } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Modal, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextR from "../../components/poppins/AppTextR";
import AppTextSB from "../../components/poppins/AppTextSB";
import StudentTableRow from "../../components/StudentTableRow";
import { Student, StudentFilterState, StudentSortState } from "../../types/StudentTypes";
import ShowMoreLess from "../../components/ShowMoreLess";

const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Anderson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    gender: "M",
    std: "10",
    school: "DFS",
    phone: "1234567890",
    shift: "Shift 1",
    joiningDate: "2022-01-10",
    leavingDate: "",
    feesTotal: 12000,
  },
  {
    id: "2",
    name: "Beckett",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    gender: "F",
    std: "9",
    school: "DFS",
    phone: "1234567891",
    shift: "Shift 2",
    joiningDate: "2022-02-15",
    leavingDate: "2023-03-01",
    feesTotal: 11000,
  },
  {
    id: "3",
    name: "Carter",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    gender: "M",
    std: "8",
    school: "DFS",
    phone: "1234567892",
    shift: "Shift 1",
    joiningDate: "2023-05-12",
    leavingDate: "",
    feesTotal: 9500,
  },
  {
    id: "4",
    name: "Diana",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    gender: "F",
    std: "10",
    school: "DFS",
    phone: "1234567893",
    shift: "Shift 2",
    joiningDate: "2021-06-25",
    leavingDate: "",
    feesTotal: 13000,
  },
  {
    id: "5",
    name: "Elijah",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    gender: "M",
    std: "9",
    school: "DFS",
    phone: "1234567894",
    shift: "Shift 1",
    joiningDate: "2022-11-01",
    leavingDate: "",
    feesTotal: 11500,
  },
  {
    id: "6",
    name: "Fiona",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    gender: "F",
    std: "8",
    school: "DFS",
    phone: "1234567895",
    shift: "Shift 2",
    joiningDate: "2023-01-10",
    leavingDate: "",
    feesTotal: 9800,
  },
  {
    id: "7",
    name: "George",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    gender: "M",
    std: "7",
    school: "DFS",
    phone: "1234567896",
    shift: "Shift 1",
    joiningDate: "2022-04-18",
    leavingDate: "",
    feesTotal: 8900,
  },
  {
    id: "8",
    name: "Hannah",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    gender: "F",
    std: "9",
    school: "DFS",
    phone: "1234567897",
    shift: "Shift 2",
    joiningDate: "2023-07-20",
    leavingDate: "",
    feesTotal: 11200,
  },
  {
    id: "9",
    name: "Isaac",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    gender: "M",
    std: "10",
    school: "DFS",
    phone: "1234567898",
    shift: "Shift 1",
    joiningDate: "2021-09-03",
    leavingDate: "",
    feesTotal: 12500,
  },
  {
    id: "10",
    name: "Jasmine",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    gender: "F",
    std: "7",
    school: "DFS",
    phone: "1234567899",
    shift: "Shift 2",
    joiningDate: "2023-03-30",
    leavingDate: "",
    feesTotal: 8700,
  },
  {
    id: "11",
    name: "Karan",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    gender: "M",
    std: "8",
    school: "DFS",
    phone: "1234567800",
    shift: "Shift 1",
    joiningDate: "2022-08-10",
    leavingDate: "",
    feesTotal: 9400,
  },
  {
    id: "12",
    name: "Liana",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    gender: "F",
    std: "9",
    school: "DFS",
    phone: "1234567801",
    shift: "Shift 2",
    joiningDate: "2023-01-25",
    leavingDate: "",
    feesTotal: 10800,
  },
  {
    id: "13",
    name: "Mohit",
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    gender: "M",
    std: "10",
    school: "DFS",
    phone: "1234567802",
    shift: "Shift 1",
    joiningDate: "2021-12-05",
    leavingDate: "",
    feesTotal: 13500,
  },
  {
    id: "14",
    name: "Nisha",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    gender: "F",
    std: "7",
    school: "DFS",
    phone: "1234567803",
    shift: "Shift 2",
    joiningDate: "2023-09-14",
    leavingDate: "",
    feesTotal: 8500,
  },
  {
    id: "15",
    name: "Omkar",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    gender: "M",
    std: "8",
    school: "DFS",
    phone: "1234567804",
    shift: "Shift 1",
    joiningDate: "2022-06-22",
    leavingDate: "",
    feesTotal: 9900,
  },
];

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

const StudentData = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<StudentFilterState>({});
  const [tempFilter, setTempFilter] = useState<StudentFilterState>({});
  const [sort, setSort] = useState<StudentSortState>({ key: "name", direction: "asc" });
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const filterOptions = {
    gender: ["M", "F"],
    std: [...new Set(sampleStudents.map((s) => s.std))].sort(
      (a, b) => Number(a) - Number(b)
    ),
    school: [...new Set(sampleStudents.map((s) => s.school))],
    shift: [...new Set(sampleStudents.map((s) => s.shift))],
  };

  // Filtering
  let filteredStudents = sampleStudents.filter((s) => {
    let pass = true;
    if (filter.gender) pass = pass && s.gender === filter.gender;
    if (filter.std) pass = pass && s.std === filter.std;
    if (filter.school) pass = pass && s.school === filter.school;
    if (filter.shift) pass = pass && s.shift === filter.shift;
    return pass;
  });

  // Sorting
  filteredStudents.sort((a, b) => {
    const { key, direction } = sort;
    let aVal: string | number = a[key] ?? "";
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
            <AppTextSB className="text-xl font-bold mb-4">Filters</AppTextSB>
            <ScrollView>
              {Object.entries(filterOptions).map(([key, options]) => (
                <View key={key} className="mb-4">
                  <AppTextR className="text-base font-semibold capitalize mb-2">
                    {key}
                  </AppTextR>
                  <View className="flex-row flex-wrap gap-2">
                    {options.map((option) => (
                      <TouchableOpacity
                        key={option}
                        className={`px-4 py-2 rounded-full ${
                          tempFilter[key as keyof StudentFilterState] === option
                            ? "bg-blue-500"
                            : "bg-gray-200"
                        }`}
                        onPress={() =>
                          setTempFilter((prev) => ({ ...prev, [key]: option }))
                        }
                      >
                        <AppTextSB
                          className={`font-semibold ${
                            tempFilter[key as keyof StudentFilterState] === option
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
                className="flex-1 bg-blue-500 py-3 rounded-lg items-center"
              >
                <AppTextSB className="text-white">Apply Filters</AppTextSB>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  const renderTopBar = () => {
    return (
      <>
        <AppTextR className="text-lg font-bold text-gray-700">
          {filteredStudents.length} Students Found
        </AppTextR>
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
          <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg flex-row items-center justify-center">
            <Ionicons
              name={"person-add"}
              size={12}
              color="#ffffff"
              style={{ marginRight: 5 }}
            />
            <AppTextSB className="text-white text-sm font-semibold">
              Add Student
            </AppTextSB>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <View className="w-full rounded-2xl p-6 pt-0">
      {/* Top Bar */}
      {renderTopBar()}

      {/* Filter Modal */}
      {renderModal()}

      {/* Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: 900 }}>
        <View>
          {/* Headers */}
          {renderHeader()}

          {/* Rows */}
          <FlatList
            data={studentsToShow}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <StudentTableRow
                item={item}
                index={index}
                selected={selected}
                toggleSelect={toggleSelect}
              />
            )}
          />
        </View>
      </ScrollView>

      {/* Load more / Show less */}
      
      <ShowMoreLess filteredData={filteredStudents} sampleData={sampleStudents} setVisibleCount={setVisibleCount} visibleCount={visibleCount}/>
      {/* <View className="items-center my-2">
        {visibleCount < filteredStudents.length ? (
          <View className="flex flex-row gap-x-2">
            <TouchableOpacity
              className="flex-1 px-4 py-2 bg-transparent rounded-xl border-primary border"
              onPress={() => setVisibleCount((c) => c + 5)}
            >
              <AppTextSB className="text-sm text-center text-blue-700">
                Load more
              </AppTextSB>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 px-4 py-2 bg-primary rounded-xl"
              onPress={() => setVisibleCount(sampleStudents.length)}
            >
              <AppTextSB className="text-sm text-center text-white border border-primary">
                Show All
              </AppTextSB>
            </TouchableOpacity>
          </View>
        ) : filteredStudents.length > 5 ? (
          <TouchableOpacity
            className="w-full px-4 py-2 bg-transparent rounded-xl border-redShade-dark border"
            onPress={() => setVisibleCount(5)}
          >
            <AppTextSB className="text-sm text-center text-redShade-dark">
              Show less
            </AppTextSB>
          </TouchableOpacity>
        ) : null}
      </View> */}
    </View>
  );
};

export default StudentData;
