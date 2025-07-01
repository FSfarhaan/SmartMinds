import { View } from "react-native";
import React from "react";
import AppTextR from "./poppins/AppTextR";
import AppTextB from "./poppins/AppTextB";

type TileData = {
  title: string;
  content: string;
  // image: ImageSourcePropType;
};

const TileMoney = ({ item }: { item: TileData }) => {
  return (
    <View
      className="m-2 p-4 rounded-xl bg-white justify-between flex-1 border-unselected-dark h-28"
      style={{ borderWidth: 0.2 }}
    >
      <AppTextR className="text-lg text-unselected-dark">{item.title}</AppTextR>
      <AppTextB className="text-emerald-600 text-3xl">{item.content}</AppTextB>
    </View>
  );
};

export default TileMoney;
