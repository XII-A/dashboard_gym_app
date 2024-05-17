import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
// import { Dimensions } from "react-native";

import Header from "../../components/Header";
import InfoBox from "../../components/InfoBox";
import { getDate } from "../../utils/timeUtils";
import { useAuth } from "../context/AuthContext";

const Overview = () => {
  const { user } = useAuth();

  const titles = ["Steps", "Calories", "Distance"];
  const [stepsLoading, setStepsLoading] = useState(true);
  const [values, setValues] = useState([]);
  const [steps, setSteps] = useState(null);

  const [workoutLoading, setWorkoutLoading] = useState(true);
  const workoutTitles = ["Workout hrs", "Last Workout"];
  const [workoutsValues, setWorkoutsValues] = useState([]);

  const [caloriesLoading, setCaloriesLoading] = useState(true);
  const [calories, setCalories] = useState(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getSteps();
    await getWorkOuts();
    await getCalories();
    setRefreshing(false);
  };

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
        setStepsLoading(false);
        return stepsCount;
      });
    } catch (error) {
      console.log("Error in fetching steps:", error);
    }
  };

  const getWorkOuts = async () => {
    const date = getDate();
    try {
      const res = await axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/workouts?filters[$and][0][date][$eq]=${date}&filters[$and][1][member][id][$eq]=${user.id}&sort=createdAt:desc`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        let mostRecentWorkout = res.data.data[0].attributes.name;
        let workoutDuration = 0;
        res.data.data.forEach((element) => {
          workoutDuration += element.attributes.duration;
        });
        // convert the duration from minutes to hours
        let hours = workoutDuration / 60;
        setWorkoutsValues([hours, mostRecentWorkout]);
        setWorkoutLoading(false);
      });
    } catch (error) {
      console.log("Error in fetching workouts:", error);
    }
  };

  const getCalories = async () => {
    const date = getDate();
    try {
      const res = await axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/calories?filters[$and][0][date][$eq]=${date}&filters[$and][1][member][id][$eq]=${user.id}&filters[$and][2][isBurnedCalories][$eq]=false`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        let caloriesCount = 0;

        res.data.data.forEach((element) => {
          caloriesCount += element.attributes.kcl;
        });
        setCalories(caloriesCount);
        setCaloriesLoading(false);
        return caloriesCount;
      });
    } catch (error) {
      console.log("Error in fetching calories:", error);
    }
  };

  useEffect(() => {
    // get the steps data
    getSteps();
    // get the workouts data
    getWorkOuts();
    // get the calories data
    getCalories();

    // console.log("the screen size is: ", Dimensions.get("window"));
    // console.log("user", user);
  }, []);

  useEffect(() => {
    //!! to print values delete later
    // console.log("steps", steps);
    // console.log("workoutsValues", workoutsValues);
    // console.log("calories", calories);
  }, [steps, workoutsValues, calories]);

  // getting the current date in the format of "Day, Month Date"
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <View className="h-full bg-bgColor-primary px-4">
        <Header date={date} user={user} />
        {/* scroll view */}
        <ScrollView
          contentContainerStyle={{
            // height: "100%",
            justifyContent: "center",
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#00A8E8", "#9b71ff", "#F97316"]}
              tintColor={"#00A8E8"}
            />
          }
        >
          {!stepsLoading && (
            <InfoBox
              titles={titles}
              value={values}
              progress={steps ? steps / user.stepsGoal : 0}
              stepsGoal={user.stepsGoal}
              otherStyles="items-center"
            />
          )}
          {!workoutLoading && (
            <InfoBox
              titles={workoutTitles}
              value={workoutsValues}
              otherStyles="mt-2 items-center"
              textColor="text-[#9b71ff]"
              strokeColor="#9b71ff"
              workoutGoal={user.workoutsGoal}
              progress={workoutsValues[0] / user.workoutsGoal}
            />
          )}
          {!caloriesLoading && (
            <InfoBox
              titles={["Calories"]}
              value={[calories]}
              otherStyles="mt-2 items-center"
              progress={calories / user.caloriesGoal}
              caloriesGoal={user.caloriesGoal}
              textColor="text-[#F97316]"
              strokeColor="#F97316"
              radius={60}
              strokeWidth={24}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Overview;
