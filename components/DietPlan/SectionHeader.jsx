import { View, Text } from "react-native";
import React from "react";

const SectionHeader = ({ title, totalCalories }) => {
  return (
    <View className="flex flex-row justify-between  px-4 py-4 bg-blue-default rounded">
      <Text className="text-2xl font-manropeBold text-white">{title}</Text>
      <Text className="text-2xl font-manropeSemiBold text-white/80">
        {totalCalories}
      </Text>
    </View>
  );
};

export default SectionHeader;
