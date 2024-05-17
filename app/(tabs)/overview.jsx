import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InfoBox from "../../components/InfoBox";
import { useAuth } from "../context/AuthContext";
import { icons } from "../../constants";
import Header from "../../components/Header";
import { getDate } from "../../constants/utils";
import axios from "axios";

const Overview = () => {
  const { user } = useAuth();

  // !!! This is a dummy data, you should replace it with the real data from the API
  const titles = ["Steps", "Calories", "Distance"];

  const [values, setValues] = useState([]);

  const [steps, setSteps] = useState(null);

  const getSteps = async () => {
    const date = getDate();
    try {
      const res = await axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/steps?filters[$and][0][date][$gte]=${date}&filters[$and][1][member][id][$eq]=${user.id}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        let stepsCount = 0;
        res.data.data.forEach((element) => {
          stepsCount += element.attributes.count;
        });
        setSteps(stepsCount);
        // calculate the steps distance in km
        let distance = (stepsCount * 0.000762).toFixed(2);
        // calculate the calories burned from the steps
        let calories = (stepsCount * 0.04).toFixed(2);
        setValues([stepsCount, calories + " kcal", distance + " km"]);
        return stepsCount;
      });
    } catch (error) {
      console.log("Error in fetching steps:", error);
    }
  };

  useEffect(() => {
    // get the steps data
    getSteps();
  }, []);

  useEffect(() => {
    // to print values delete later
    // console.log("steps", steps);
  }, [steps]);

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
        <InfoBox
          title={titles}
          value={values}
          progress={steps ? steps / user.stepsGoal : 0}
          stepsGoal={user.stepsGoal}
        />
      </View>
    </SafeAreaView>
  );
};

export default Overview;
