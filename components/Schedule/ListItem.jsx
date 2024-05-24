import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import { convert24to12, getDate } from "../../utils/timeUtils";
import axios from "axios";

const ListItem = ({ item, userID, setFilteredSchedule, setUpdateOverview }) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const handleAddBurnedCalories = async () => {
    try {
      // first I add burned calories
      //   then I add the workout to the workout list
      const date = getDate();
      setChecked(true);
      await axios({
        method: "POST",
        url: `${process.env.EXPO_PUBLIC_API_URL}/calories`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          data: {
            kcl: parseInt(
              item.attributes.caloriesPerHour *
                (item.attributes.duration / 60) *
                -1
            ),
            member: userID,
            date: date,
            isBurnedCalories: true,
          },
        },
      });
      await axios({
        method: "POST",
        url: `${process.env.EXPO_PUBLIC_API_URL}/workouts`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          data: {
            name: item.attributes.workoutName,
            member: userID,
            duration: item.attributes.duration,
            date: date,
          },
        },
      }).then((res) => {
        setChecked(false);
        setUpdateOverview((prev) => !prev);
      });
    } catch (e) {
      console.log("Error in adding burned calories:", e);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleted(true);
      await axios({
        method: "DELETE",
        url: `${process.env.EXPO_PUBLIC_API_URL}/schedules/${item.id}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setFilteredSchedule((prev) => {
          return prev.filter((schedule) => schedule.id !== item.id);
        });
        setDeleted(false);
      });
    } catch (e) {
      console.log("Error in deleting workout:", e);
    }
  };

  return (
    <View className="flex flex-row justify-between items-center  px-4 py-3 bg-bgColor-trinary/80 rounded mt-2">
      <View className="flex flex-row items-center flex-1">
        <Image
          source={{ uri: item.attributes.workoutImageUrl }}
          className="w-12 h-12 rounded-full"
          resizeMethod="contain"
        />
        <View className="flex flex-col ml-2">
          <Text className="text-lg font-manropeSemiBold text-white ">
            {item.attributes.workoutName}
          </Text>

          <Text className="text-xs font-manropeMedium text-white/80">
            at {convert24to12(item.attributes.time)} for{" "}
            {item.attributes.duration} min/s
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-end flex-1 ">
        <Text className="mr-2 text-sm font-manropeSemiBold text-blue-text">
          {(
            item.attributes.caloriesPerHour *
            (item.attributes.duration / 60)
          ).toFixed(2)}{" "}
          kcal
        </Text>
        <TouchableOpacity
          onPress={() => {
            handleAddBurnedCalories();
          }}
          disabled={checked}
          className="mr-2"
        >
          {checked ? (
            <AntDesign name="checkcircle" size={24} color="#017EA7" />
          ) : (
            <AntDesign name="pluscircleo" size={24} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleDelete();
          }}
          disabled={deleted}
        >
          {deleted ? (
            <MaterialCommunityIcons
              name="delete-empty-outline"
              size={24}
              color="#e53539d9"
            />
          ) : (
            <Feather name="trash" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListItem;
