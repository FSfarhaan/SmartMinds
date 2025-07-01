// QuickTiles.tsx
import { View, Text, FlatList, Image, ImageSourcePropType } from "react-native";
import React from "react";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

type TileData = {
  title: string;
  type: "text" | "image" | "bar" | "pie";
  content?: string;
  image?: ImageSourcePropType;
  chartData?: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  pieData?: {
    name: string;
    value: number;
    color: string;
    legendFontColor?: string;
    legendFontSize?: number;
  }[];
};

const screenWidth = Dimensions.get("window").width;
const tileSize = screenWidth / 2 - 30;

const QuickTiles = ({ tiles }: { tiles: TileData[] }) => {
  const renderTile = ({ item }: { item: TileData }) => {
    return (
      <View
        className="m-2 p-4 rounded-xl shadow-md bg-white"
        style={{ width: tileSize }}
      >
        <Text className="text-lg font-semibold mb-2">{item.title}</Text>

        {/* Text with Image */}
        {item.type === "text" && item.image && (
          <>
            <Image
              source={item.image}
              className="w-full h-36 rounded-md"
              resizeMode="center"
            />
            <Text className="text-gray-600">{item.content}</Text>
          </>
        )}

        {/* Bar Chart */}
        {item.type === "bar" && item.chartData && (
          <BarChart
            data={item.chartData}
            width={tileSize - 10}
            height={150}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#f0f0f0",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={{ borderRadius: 10 }}
            yAxisSuffix=""
          />
        )}

        {/* Pie Chart with Legends Below */}
        {item.type === "pie" && item.pieData && (
          <View>
            <PieChart
              data={item.pieData}
              width={tileSize}
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
            <View className="mt-2 flex-wrap flex-row gap-x-3 gap-y-1">
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
                  <Text className="text-sm text-gray-800">{legendItem.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={tiles}
      renderItem={renderTile}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

export default QuickTiles;
