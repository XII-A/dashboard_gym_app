import { View, Text } from "react-native";
import React from "react";
import RingProgress from "./RingProgress";

const InfoBox = ({ title, value }: { title: string[]; value: string[] }) => {
  return (
    <View className="flex flex-row justify-between w-full bg-bgColor-trinary/80 rounded p-4">
      <View className="flex flex-1 flex-col gap-2">
        {title.map((title, index) => {
          return (
            <View
              className="flex flex-col items-start justify-center"
              key={index}
            >
              <Text className="text-white font-manropeMedium text-xl">
                {title}
              </Text>
              <Text className="text-blue-text font-manropeSemiBold text-3xl">
                {value[index]}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="flex flex-[2] flex-col items-end justify-center">
        <RingProgress progress={0.5} />
      </View>
    </View>
  );
};

export default InfoBox;
