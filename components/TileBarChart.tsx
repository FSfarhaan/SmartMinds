import { View, Text, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { BarChart } from 'react-native-chart-kit';
import AppTextR from './poppins/AppTextR';

type TileData = {
    title: string;
    barData: {
      labels: string[];
      datasets: { data: number[] }[];
    };
    color: string;
  };

const screenWidth = Dimensions.get("window").width;

const TileBarChart = ({ item }: { item: TileData} ) => {
  const chartWidth = Math.max(screenWidth - 70, item.barData.labels.length * 60); // Ensure minimum width per bar
  
  return (
    <View
        className="m-2 p-4 rounded-xl  bg-white border-unselected-dark"
        style={{ borderWidth: .2}}
      >
        <AppTextR className="text-lg mb-2 text-unselected-dark">{item.title}</AppTextR>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
              data={item.barData}
              width={chartWidth}
              height={200}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => item.color, // Primary color #1672EC
                labelColor: () => "#404454",
              }}
              style={{ borderRadius: 10 }}
              yAxisSuffix=""
            />
        </ScrollView>
        </View>
  )
}

export default TileBarChart