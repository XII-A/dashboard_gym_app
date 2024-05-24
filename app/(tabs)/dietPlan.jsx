import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import FoodList from "../../components/DietPlan/FoodList";
import { useAuth } from "../context/AuthContext";
import SelectDay from "../../components/shared/SelectDay";

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
  const { user, setUpdateOverview } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [foodList, setFoodList] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [forceTrigger, setForceTrigger] = useState(false);

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

          if (res.data.data.length !== 0) {
            res.data.data.forEach((element) => {
              if (element.attributes.meal === "Breakfast") {
                breakFast.data.push({
                  ...element.attributes,
                  id: element.id,
                });
                breakFast.totalCalories += element.attributes.kcl;
              } else if (element.attributes.meal === "Lunch") {
                lunch.data.push({
                  ...element.attributes,
                  id: element.id,
                });
                lunch.totalCalories += element.attributes.kcl;
              } else if (element.attributes.meal === "Dinner") {
                dinner.data.push({
                  ...element.attributes,
                  id: element.id,
                });
                dinner.totalCalories += element.attributes.kcl;
              }
            });
            // set the total calories
            setTotalCalories(
              Math.ceil(
                breakFast.totalCalories +
                  lunch.totalCalories +
                  dinner.totalCalories
              )
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
  }, [selectedDay, forceTrigger]);

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <SelectDay selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      {
        // show the loader if the data is loading
        dataLoading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#017EA7" />
          </View>
        )
      }
      {!dataLoading && (
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
          <FoodList
            foodList={foodList}
            userID={user.id}
            setForceTrigger={setForceTrigger}
            setTotalCalories={setTotalCalories}
            setFoodList={setFoodList}
            selectedDay={selectedDay}
            setUpdateOverview={setUpdateOverview}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default DietPlan;
