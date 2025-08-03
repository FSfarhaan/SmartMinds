import { View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import AppTextSB from './poppins/AppTextSB';
import AppTextR from './poppins/AppTextR';

const TileDueFees = ( { title, content, status } : { title: string, content: string, status: string }) => {
  const color = status === "neg" ? "#dc2626" :"#16a34a"
  return(
    <View className={`bg-${status === "neg" ? "red": "green"}-100 border-l-4  border-${status === "neg" ? "red": "green"}-500 rounded-xl px-4 py-3 mb-4 flex-row items-center w-full`}>
      <Ionicons name={`${status === "neg" ?  "alert-circle" : "checkmark-circle"}`} size={28} color={color} className="mr-3" />
      <View className="flex-1">
        <AppTextSB className={`text-${status === "neg" ? "red": "green"}-700 text-lg mb-1`}>{title}</AppTextSB>
        <AppTextR className={`text-${status === "neg" ? "red": "green"}-700 text-sm`}>{content}</AppTextR>
      </View>
    </View>
  );
};

export default TileDueFees