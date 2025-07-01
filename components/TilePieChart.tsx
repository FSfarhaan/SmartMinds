import { View, Text, Dimensions } from "react-native";
import React from "react";
import { PieChart } from "react-native-chart-kit";
import AppTextR from "./poppins/AppTextR";
import AppTextSB from "./poppins/AppTextSB";

const tileSize = Dimensions.get("window").width / 2 - 30;

type PieTileData = {
  title: string;
  pieData: {
    name: string;
    value: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }[];
};

const TilePieChart = ({ item }: { item: PieTileData }) => {
  return (
    <View className="m-2 p-4 rounded-xl bg-white justify-between border-unselected-dark"
      style={{ borderWidth: .2}}>
      <AppTextR className="w-full text-left text-lg font-normal text-unselected-dark">{item.title}</AppTextR>
      <PieChart
        data={item.pieData}
        width={tileSize - 30}
        height={150}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="30"
        hasLegend={false}
      />

      {/* Manual Legends */}
      <View className="mt-2 flex-wrap flex-col gap-x-3 gap-y-1">
        {item.pieData.map((legendItem, i) => (
          <View key={i} className="flex-row items-center space-x-1">
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: legendItem.color,
                borderRadius: 5,
                marginRight: 5
              }}
            />
            <AppTextSB className="text-sm text-unselected-dark">{legendItem.name}</AppTextSB>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TilePieChart;
