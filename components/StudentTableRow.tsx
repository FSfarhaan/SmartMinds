import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import AppTextSB from './poppins/AppTextSB';
import AppTextR from './poppins/AppTextR';
import { Student } from '@/types/StudentTypes';

const Col = ({ val } : { val: string | number | undefined }) => {
    return (
    <View
        style={{
          width: 120,
          paddingHorizontal: 12,
          paddingVertical: 8,
          justifyContent: "center",
        }}
      >
        <AppTextR
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: "#444" }}
        >
          {val || "-"}
        </AppTextR>
      </View>
    );
}

const StudentTableRow = ({ item, index, selected, toggleSelect }: {
    item: Student;
    index: number;
    selected: string[];
    toggleSelect: (id: string) => void;
  }) => (
    <View
      className={`flex-row items-center border-unselected-dark ${
        index % 2 === 0 ? "bg-white" : "bg-blue-50"
      } my-2 rounded-xl`}
      style={{ borderWidth: 0.2 }}
    >
      {/* Checkbox */}
      <TouchableOpacity
        style={{
          width: 50,
          alignItems: "center",
          justifyContent: "center",
          height: 48,
        }}
        onPress={() => toggleSelect(item.id)}
      >
        <Ionicons
          name={selected.includes(item.id) ? "checkbox" : "square-outline"}
          size={20}
          color={selected.includes(item.id) ? "#1672EC" : "#888"}
        />
      </TouchableOpacity>
      
      {/* Name with avatar */}
      <View
        style={{
          width: 150,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Image
          source={{
            uri: item.avatar || "https://ui-avatars.com/api/?name=" + item.name,
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 24,
            marginRight: 12,
          }}
        />
        <AppTextSB
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-unselected-dark flex-1"
        >
          {item.name}
        </AppTextSB>
      </View>

      {/* Other columns */}
      <Col val={item.gender}/>
      <Col val={item.std}/>
      <Col val={item.school}/>
      <Col val={item.phone}/>
      <Col val={item.shift}/>
      <Col val={item.joiningDate}/>
      <Col val={item.leavingDate}/>
      <Col val={item.feesTotal}/>
    </View>
  );


export default StudentTableRow