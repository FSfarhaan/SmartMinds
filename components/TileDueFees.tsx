import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextR from "./poppins/AppTextR";
import AppTextSB from "./poppins/AppTextSB";
import AppTextB from "./poppins/AppTextB";

interface DueStudent {
  name: string;
  dueInDays: number;
}

interface TileDueFeesProps {
  dues: DueStudent[];
}

const TileDueFees: React.FC<TileDueFeesProps> = ({ dues }) => {
  return (
    <View className="mt-2 bg-redShade-light rounded-2xl w-full border-redShade-dark"
    style={{ borderWidth: .2}}>
      <View className="flex-row justify-between items-center px-4 pt-3">
        <AppTextR className="text-base font-semibold text-[#F04438]">Due Fees</AppTextR>
        <TouchableOpacity>
          <AppTextSB className="text-sm font-semibold text-[#F04438]">See all</AppTextSB>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={dues}
        keyExtractor={(item, idx) => item.name + idx}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            className="flex-row items-center rounded-2xl px-4 py-3 mb-2"
            style={{ minHeight: 56 }}
          >
            <Ionicons
              name="warning"
              size={28}
              color="#F04438"
              style={{ marginRight: 12 }}
            />
            <View>
              <AppTextR className="text-base text-unselected-dark">
                {item.name} has fees due of <AppTextSB>{item.dueInDays} days</AppTextSB>
              </AppTextR>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TileDueFees; 