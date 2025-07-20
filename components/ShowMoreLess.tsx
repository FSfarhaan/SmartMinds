import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AppTextSB from './poppins/AppTextSB'
import { Student } from '../types/StudentTypes';
import { FeeData } from '../types/FeesTypes';

type StudentShift = {
    id: string;
    name: string;
    shift: string;
}

type ShowProps = {
    visibleCount: number;
    filteredData: Student[] | FeeData[] | StudentShift[];
    setVisibleCount : React.Dispatch<React.SetStateAction<number>>;
    sampleData: Student[] | FeeData[] | StudentShift[];
}

const ShowMoreLess = ({ visibleCount, filteredData, setVisibleCount, sampleData } : ShowProps) => {
  return (
    <View className="items-center my-2">
        {visibleCount < filteredData.length ? (
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
              onPress={() => setVisibleCount(sampleData.length)}
            >
              <AppTextSB className="text-sm text-center text-white">
                Show All
              </AppTextSB>
            </TouchableOpacity>
          </View>
        ) : filteredData.length > 5 ? (
          <TouchableOpacity
            className="w-full px-4 py-2 bg-transparent rounded-xl border-redShade-dark border"
            onPress={() => setVisibleCount(5)}
          >
            <AppTextSB className="text-sm text-center text-redShade-dark">
              Show less
            </AppTextSB>
          </TouchableOpacity>
        ) : null}
      </View>
  )
}

export default ShowMoreLess