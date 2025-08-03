import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import AppTextR from './poppins/AppTextR';
import AppTextB from './poppins/AppTextB';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AppTextSB from './poppins/AppTextSB';

interface DashboardHeaderProps {
    isAdmin: boolean;
    selected: string;
    name: string;
    uri: string;
    setSelected: (value: string) => void;
    options: {key: string, icon: string} [];
}

// "https://via.placeholder.com/40"

const DashboardHeader = ({ isAdmin, selected, setSelected, name, uri, options }: DashboardHeaderProps) => {
    return (
      <View className="w-full">
        {/* Header */}
        <View className="flex-row justify-between items-center p-6">
          <View>
            <AppTextR
              className="text-unselected-light text-xl pt-10">
              Hello there
            </AppTextR>
            <AppTextB
              className="text-3xl text-unselected-dark"
            >
              {name}
            </AppTextB>
          </View>
          <Image
            source={{ uri }} // Replace with actual user photo
            className="w-10 h-10 rounded-full"
          />
        </View>
  
        {isAdmin && <View
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
        </View>}
  
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
                  className={`py-5 px-6 rounded-3xl mb-1 border-unselected-dark ${isActive ? "bg-[#E2EDFD] border border-blue-500" : "bg-white"
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

        <AppTextSB
          className="p-6 pb-3 text-4xl text-unselected-dark" >
          {selected}
        </AppTextSB>
      </View>
    );
  };

export default DashboardHeader