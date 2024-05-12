import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "../../components/InfoBox";
import { useAuth } from "../context/AuthContext";
import { icons } from "../../constants";
import Header from "../../components/Header";

const Overview = () => {
  const { user } = useAuth();

  // !!! This is a dummy data, you should replace it with the real data from the API
  const titles = ["Steps", "Calories", "Distance"];
  const values = ["6290", "1200", "5400"];

  // getting the current date in the format of "Day, Month Date"
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className="bg-bgColor-primary">
      <View className="h-full bg-bgColor-primary px-4">
        <Header date={date} user={user} />
        <InfoBox title={titles} value={values} />
      </View>
    </SafeAreaView>
  );
};

export default Overview;
