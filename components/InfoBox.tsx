import { View, Text } from "react-native";
import React, { useEffect } from "react";
import RingProgress from "./RingProgress";

type InfoBoxProps = {
  titles: string[];
  value: string[];
  progress: number;
  stepsGoal?: any;
  workoutGoal?: any;
  otherStyles?: string;
  textColor?: string;
  strokeColor?: string;
  caloriesGoal?: any;
  radius?: number;
  strokeWidth?: number;
};

const InfoBox = ({
  titles,
  value,
  progress,
  stepsGoal,
  workoutGoal,
  otherStyles,
  textColor,
  strokeColor,
  caloriesGoal,
  radius,
  strokeWidth,
}: InfoBoxProps) => {
  const goalValue = () => {
    switch (titles[0]) {
      case "Steps":
        return stepsGoal ?? null;
      case "Workout hrs":
        return `${workoutGoal} hrs` ?? null;
      case "Calories":
        return caloriesGoal ?? null;
      default:
        return null;
    }
  };

  return (
    <View
      className={`flex flex-row justify-between w-full bg-bgColor-trinary/80 rounded p-4 ${otherStyles}`}
    >
      <View className="flex flex-1 flex-col gap-2 ">
        {titles.map((title, index) => {
          return (
            <View
              className="flex flex-col items-start justify-center"
              key={index}
            >
              <Text className="text-white font-manropeMedium text-xl max-[395px]:text-lg">
                {title}
              </Text>

              <Text
                className={`font-manropeSemiBold text-2xl max-[395px]:text-xl ${
                  textColor ? `${textColor}` : "text-blue-text"
                }`}
              >
                {value[index] ?? "-"}
                {index === 0 && goalValue() !== null ? `/${goalValue()}` : ""}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="flex flex-1 flex-col items-center justify-center">
        <RingProgress
          progress={progress}
          strokeColor={strokeColor}
          radius={radius}
          strokeWidth={strokeWidth}
        />
      </View>
    </View>
  );
};

export default InfoBox;
