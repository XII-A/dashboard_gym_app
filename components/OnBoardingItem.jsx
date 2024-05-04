import { View, Text, Image, useWindowDimensions } from "react-native";
import React from "react";

const OnBoardingItem = ({ item }) => {
  const { width } = useWindowDimensions();
  return (
    <View style={{ width }} className="">
      <Image
        source={item.image}
        style={{ width, resizeMode: "contain" }}
        className="flex flex-[0.7] justify-center "
      />
      <View className="flex flex-[0.3]">
        <Text className="text-3xl font-manropeBold text-blue-text mb-2 text-center">
          {item.title}
        </Text>
        <Text className="text-lg text-center text-gray-500">
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default OnBoardingItem;
