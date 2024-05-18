import { View, Text } from "react-native";
import React from "react";

const temp = () => {
  return (
    <View>
      {/* BreakFast */}
      <View className="flex flex-col">
        {/* List Header */}
        <View className="flex flex-row justify-between px-2 mb-2">
          <Text className="text-3xl font-manropeBold text-white">
            Breakfast
          </Text>
          <Text className="text-2xl font-manropeSemiBold text-white/80">
            355
          </Text>
        </View>
        {/* List Container */}
        <View className="flex flex-col bg-bgColor-trinary/80 ">
          {/* food item */}
          <View className="flex flex-row justify-between items-center  px-4 py-3">
            {/* food info */}
            <View className="flex flex-col">
              <Text className="text-base font-manropeMedium text-white">
                1/2 cup of oatmeal
              </Text>
              <Text className="text-sm font-manropeRegular text-white/80">
                150 kcal / 6 carbs
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
          {/* Add food button */}
          <View className="flex flex-row items-center py-3 px-4 border-t-[0.5px] border-white/40">
            <TouchableOpacity>
              <Text className="text-lg text-blue-text font-manropeSemiBold">
                Add Food
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default temp;
