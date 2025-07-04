import { View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import AppTextSB from './poppins/AppTextSB';
import AppTextR from './poppins/AppTextR';

const TileDueFees = ( { content } : { content: string }) => (
    <View className="bg-red-100 border-l-4 border-red-500 rounded-xl px-4 py-3 mb-4 flex-row items-center w-full">
      <Ionicons name="alert-circle" size={28} color="#dc2626" className="mr-3" />
      <View className="flex-1">
        <AppTextSB className="text-red-700 text-lg mb-1">Due fees</AppTextSB>
        <AppTextR className="text-red-700 text-sm">{content}</AppTextR>
      </View>
    </View>
  );

export default TileDueFees