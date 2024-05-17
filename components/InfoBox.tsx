import { View, Text } from "react-native";
import React, { useEffect } from "react";
import RingProgress from "./RingProgress";

type InfoBoxProps = {
  title: string[];
  value: string[];
  progress: number;
  stepsGoal?: any;
};

const InfoBox = ({ title, value, progress, stepsGoal }: InfoBoxProps) => {
  return (
    <View className="flex flex-row justify-between w-full bg-bgColor-trinary/80 rounded p-4">
      <View className="flex flex-1 flex-col gap-2 ">
        {title.map((title, index) => {
          return (
            <View
              className="flex flex-col items-start justify-center"
              key={index}
            >
              <Text className="text-white font-manropeMedium text-xl">
                {title}
              </Text>

              <Text className="text-blue-text font-manropeSemiBold text-2xl">
                {value[index] ?? "-"}
                {index === 0 && "steps" ? `/${stepsGoal}` : ""}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="flex flex-[1.5] flex-col items-end justify-center ">
        <RingProgress progress={progress} />
      </View>
    </View>
  );
};

export default InfoBox;
