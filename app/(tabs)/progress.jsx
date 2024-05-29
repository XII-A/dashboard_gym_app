import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useAuth } from "../context/AuthContext";
import BarChartBox from "../../components/Charts/BarChartBox";
import { getDayFromDate, getWeek } from "../../utils/timeUtils";
import WeekSelector from "../../components/shared/WeekSelector";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const Progress = () => {
  const [selectedRange, setSelectedRange] = useState(getWeek());

  const { user, updateOverview } = useAuth();

  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [loadingCalories, setLoadingCalories] = useState(true);

  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  const [weeklySteps, setWeeklySteps] = useState([]);
  const [loadingSteps, setLoadingSteps] = useState(true);

  const [weeklyBurnedCalories, setWeeklyBurnedCalories] = useState([]);
  const [loadingBurnedCalories, setLoadingBurnedCalories] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedRange.length === 0) return;
    const [firstDay, lastDay] = selectedRange;
    // get the weekly calories
    setRefreshing(true);
    try {
      axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/calorie/weekly?startDate=${firstDay}&endDate=${lastDay}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        const calories = [];
        daysOfWeek.forEach((day) => {
          const dayCalories = res.data.rows.find((item) => {
            return getDayFromDate(item.date) === day;
          });
          if (dayCalories) {
            calories.push(parseInt(dayCalories.total_calories));
          } else {
            calories.push(0);
          }
        });
        const data = calories.map((calorie, index) => {
          return {
            value: calorie,
            label: daysOfWeek[index].slice(0, 3),
            labelTextStyle: { color: "#fff" },
            frontColor: "#fff",
          };
        });
        setWeeklyCalories(data);
        setLoadingCalories(false);
      });

      // get the weekly workouts
      axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/workout/weekly?startDate=${firstDay}&endDate=${lastDay}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        const workouts = [];
        daysOfWeek.forEach((day) => {
          const dayWorkouts = res.data.rows.find((item) => {
            return getDayFromDate(item.date) === day;
          });
          if (dayWorkouts) {
            workouts.push(dayWorkouts.total_duration / 60);
          } else {
            workouts.push(0);
          }
        });
        const data = workouts.map((workout, index) => {
          return {
            value: workout,
            label: daysOfWeek[index].slice(0, 3),
            labelTextStyle: { color: "#fff" },
            frontColor: "#fff",
          };
        });
        setWeeklyWorkouts(data);
        setLoadingWorkouts(false);
      });

      // get the weekly steps
      axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/step/weekly?startDate=${firstDay}&endDate=${lastDay}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        const steps = [];
        daysOfWeek.forEach((day) => {
          const daySteps = res.data.rows.find((item) => {
            return getDayFromDate(item.date) === day;
          });
          if (daySteps) {
            steps.push(daySteps.total_steps);
          } else {
            steps.push(0);
          }
        });
        const data = steps.map((step, index) => {
          return {
            value: step,
            label: daysOfWeek[index].slice(0, 3),
            labelTextStyle: { color: "#fff" },
            frontColor: "#fff",
          };
        });
        setWeeklySteps(data);
        setLoadingSteps(false);
      });

      // get the weekly burned calories
      axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/calorie/weekly/burned?startDate=${firstDay}&endDate=${lastDay}&isBurnedCalories=true`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        const burnedCalories = [];
        daysOfWeek.forEach((day) => {
          const dayBurnedCalories = res.data.rows.find((item) => {
            return getDayFromDate(item.date) === day;
          });
          if (dayBurnedCalories) {
            burnedCalories.push(dayBurnedCalories.total_calories * -1);
          } else {
            burnedCalories.push(0);
          }
        });
        const data = burnedCalories.map((calorie, index) => {
          return {
            value: calorie,
            label: daysOfWeek[index].slice(0, 3),
            labelTextStyle: { color: "#fff" },
            frontColor: "#fff",
          };
        });

        setWeeklyBurnedCalories(data);
        setLoadingBurnedCalories(false);
        setRefreshing(false);
      });
    } catch (e) {
      console.log("error in getting data for progress: ", e);
    } finally {
      // set all the loading states to false
      setLoadingCalories(false);
      setLoadingWorkouts(false);
      setLoadingSteps(false);
      setLoadingBurnedCalories(false);
      setRefreshing(false);
    }
  }, [selectedRange, updateOverview]);

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <View className="h-full bg-bgColor-primary px-4 max-[395px]:px-2">
        <ScrollView
          className="h-full"
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <WeekSelector
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
          />

          <View className="my-2">
            <BarChartBox
              weeklyData={weeklyCalories}
              loading={loadingCalories}
              userGoal={user.caloriesGoal}
              title="Weekly Calories Analysis"
              backgroundColor="bg-[#F97316]"
              iconBackgroundColor={"bg-[#EA580C]"}
            >
              <MaterialIcons name="fastfood" size={24} color="white" />
            </BarChartBox>
          </View>
          <View className="my-2">
            <BarChartBox
              weeklyData={weeklyWorkouts}
              loading={loadingWorkouts}
              userGoal={user.workoutsGoal}
              title="Weekly Workouts Analysis"
              backgroundColor="bg-[#06B6D4]"
              iconBackgroundColor={"bg-[#0891B2]"}
            >
              <MaterialCommunityIcons name="dumbbell" size={24} color="white" />
            </BarChartBox>
          </View>
          <View className="my-2">
            <BarChartBox
              weeklyData={weeklySteps}
              loading={loadingSteps}
              userGoal={user.stepsGoal}
              title="Weekly Steps Analysis"
              backgroundColor="bg-[#9b71ff]"
              iconBackgroundColor={"bg-[#7F3FF5]"}
            >
              <MaterialCommunityIcons name="walk" size={24} color="white" />
            </BarChartBox>
          </View>
          <View className="my-2">
            <BarChartBox
              weeklyData={weeklyBurnedCalories}
              loading={loadingBurnedCalories}
              userGoal={user.caloriesGoal}
              title="Weekly Burned Calories Analysis"
              backgroundColor="bg-[#8DB600]"
              iconBackgroundColor={"bg-[#6C9C00]"}
            >
              <MaterialIcons
                name="local-fire-department"
                size={24}
                color="#fff"
              />
            </BarChartBox>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Progress;
