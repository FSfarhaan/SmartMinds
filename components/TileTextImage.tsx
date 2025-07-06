import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import React from "react";
import AppTextR from "./poppins/AppTextR";
import AppTextSB from "./poppins/AppTextSB";

type TileData = {
  title: string;
  content: string;
  image: ImageSourcePropType;
  flag: boolean
};

const TileTextImage = ({ item }: { item: TileData }) => {  

  return (
    <View
      className="m-2 p-4 rounded-xl bg-white justify-between flex-1 border-unselected-dark"
      style={{ borderWidth: .2 }}
    >
      <AppTextR className="text-lg text-unselected-dark">{item.title}</AppTextR>
      <Image
        source={item.image}
        className="w-full h-40 rounded-md"
        resizeMode="center"
      />
      <AppTextSB className={`text-unselected-dark ${item.flag ? "" : "text-xl"}`}>{item.content}</AppTextSB>
    </View>
  );
};

export default TileTextImage;
