import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

import { getWeek } from "../../utils/timeUtils";

const WeekSelector = ({ selectedRange, setSelectedRange }) => {
  const [firstDay, lastDay] = selectedRange;
  return (
    <View className="flex flex-row items-center justify-center mt-2 px-4">
      <View className=" w-full flex flex-row items-center justify-center ">
        <TouchableOpacity
          onPress={() => {
            const date = new Date(firstDay);
            date.setDate(date.getDate() - 7);
            const newFirstDay = date.toISOString().split("T")[0];
            date.setDate(date.getDate() + 6);
            const newLastDay = date.toISOString().split("T")[0];
            setSelectedRange([newFirstDay, newLastDay]);
          }}
        >
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-center mx-4">
          <Text className="text-white/80 font-manropeSemiBold text-xl inline-block ">
            {firstDay} - {lastDay}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const date = new Date(lastDay);
            date.setDate(date.getDate() + 1);
            const newFirstDay = date.toISOString().split("T")[0];
            date.setDate(date.getDate() + 6);
            const newLastDay = date.toISOString().split("T")[0];

            const [currentFirstDay, currentLastDay] = getWeek();
            if (newLastDay > currentLastDay) {
              return;
            }

            setSelectedRange([newFirstDay, newLastDay]);
          }}
          disabled={lastDay === getWeek()[1]}
        >
          {/* check */}
          <AntDesign
            name="right"
            size={20}
            style={{
              color:
                lastDay === getWeek()[1] ? "rgba(255,255,255,0.6)" : "white",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WeekSelector;
