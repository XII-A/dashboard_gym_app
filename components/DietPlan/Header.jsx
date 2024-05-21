import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";

import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Header = ({ selectedDay, setSelectedDay }) => {
  return (
    <View className="flex flex-row items-center justify-center mt-2 px-4">
      <View className=" w-full flex flex-row items-center justify-center ">
        <TouchableOpacity
          onPress={() => {
            const index = days.indexOf(selectedDay);
            if (index === 0) {
              setSelectedDay(days[6]);
            } else {
              setSelectedDay(days[index - 1]);
            }
          }}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-center mx-4">
          <Text className="text-white/80 font-manropeSemiBold text-xl inline-block ">
            {selectedDay}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const index = days.indexOf(selectedDay);
            if (index === 6) {
              setSelectedDay(days[0]);
            } else {
              setSelectedDay(days[index + 1]);
            }
          }}
        >
          {/* check */}
          <AntDesign name="right" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
