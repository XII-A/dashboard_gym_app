import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const BarChartBox = ({
  weeklyData,
  loading,
  userGoal,
  title,
  backgroundColor,
  iconBackgroundColor,
  children,
}) => {
  return (
    <View
      className={`${backgroundColor} rounded p-4 flex flex-col max-[395px]:p-2`}
    >
      <View className="flex flex-row items-center mb-4">
        <View className={`${iconBackgroundColor} p-2 rounded-md mr-2`}>
          {children}
        </View>
        <Text className="text-white text-xl font-manropeBold">{title}</Text>
      </View>
      {!loading && (
        <BarChart
          data={weeklyData}
          barWidth={24}
          noOfSections={4}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          yAxisColor={"#fff"}
          xAxisColor={"#fff"}
          yAxisTextStyle={{
            color: "#fff",
            fontFamily: "Manrope",
          }}
          isAnimated
          disableScroll
          renderTooltip={(item, index) => {
            return (
              <View className="bg-bgColor-primary/90 p-2 rounded absolute">
                <Text className="text-white font-manropeSemiBold">
                  {Math.ceil((item.value / userGoal) * 100)}%
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default BarChartBox;
