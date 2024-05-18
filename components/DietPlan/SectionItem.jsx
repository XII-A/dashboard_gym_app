import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React from "react";

const SectionItem = ({ foodName, calories, carbs }) => {
  return (
    <View className="flex flex-row justify-between items-center  px-4 py-3 bg-bgColor-trinary/80 rounded">
      {/* food info */}
      <View className="flex flex-col">
        <Text className="text-base font-manropeMedium text-white">
          {foodName}
        </Text>
        <Text className="text-sm font-manropeRegular text-white/80">
          {calories ?? "-"} kcal / {carbs ?? "-"} carbs
        </Text>
      </View>
      {/* buttons */}
      <View className="flex flex-row items-center gap-3">
        <TouchableOpacity>
          <AntDesign name="pluscircleo" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectionItem;
