import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/DietPlan/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FoodList from "../../components/DietPlan/FoodList";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [foodList, setFoodList] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    // get the current day
    const date = new Date();
    const currentDayofWeek = date.getDay();
    setSelectedDay(days[currentDayofWeek]);
  }, []);

  useEffect(() => {
    // fetch the data for the selected day
    if (selectedDay) {
      setDataLoading(true);
      // fetch the data for the selected day
      axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/diet-plans?filters[$and][0][member][id][$eq]=${user.id}&filters[$and][1][day][$eq]=${selectedDay}`,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          let breakFast = {
            title: "Breakfast",
            totalCalories: 0,
            data: [],
          };
          let lunch = {
            title: "Lunch",
            totalCalories: 0,
            data: [],
          };
          let dinner = {
            title: "Dinner",
            totalCalories: 0,
            data: [],
          };
          // loop through the response and add the data to the respective meal

          if (res.data.data.length !== 0) {
            res.data.data.forEach((element) => {
              if (element.attributes.meal === "Breakfast") {
                breakFast.data.push(element.attributes);
                breakFast.totalCalories += element.attributes.kcl;
              } else if (element.attributes.meal === "Lunch") {
                lunch.data.push(element.attributes);
                lunch.totalCalories += element.attributes.kcl;
              } else if (element.attributes.meal === "Dinner") {
                dinner.data.push(element.attributes);
                dinner.totalCalories += element.attributes.kcl;
              }
            });
            // set the total calories
            setTotalCalories(
              (
                breakFast.totalCalories +
                lunch.totalCalories +
                dinner.totalCalories
              ).toFixed(2)
            );
          } else {
            setTotalCalories(0);
          }
          // set the data
          setFoodList([breakFast, lunch, dinner]);

          setDataLoading(false);
        })
        .catch((error) => {
          console.log("Error in fetching diet plan:", error);
          setDataLoading(false);
        });
    }
  }, [selectedDay]);

  useEffect(() => {
    // console.log("the foodList is", foodList);
  }, [foodList]);

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <Header selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      <View className="h-full bg-bgColor-primary flex flex-1 px-4  ">
        {/* Main Container for all lists*/}
        <View className="flex flex-row justify-between items-center py-2">
          <Text className="text-2xl font-manropeBold text-white my-2">
            Total Calories:{" "}
          </Text>
          <Text className="text-2xl font-manropeSemiBold text-white/80 my-2">
            {totalCalories}
          </Text>
        </View>
        <FoodList foodList={foodList} />
      </View>
    </SafeAreaView>
  );
};

export default DietPlan;
