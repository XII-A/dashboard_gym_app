import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/DietPlan/Header";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DietPlan = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // get the current day
    const date = new Date();
    const currentDayofWeek = date.getDay();

    setSelectedDay(days[currentDayofWeek]);
  }, []);

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <Header selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          flexGrow: 1,
          backgroundColor: "#F5F5F5",
          height: "100%",
        }}
      >
        <View className="h-full bg-bgColor-primary px-4">
          <Text>hello</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DietPlan;
