import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { getDate } from "../../utils/timeUtils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import axios from "axios";

const SectionItem = ({
  foodName,
  calories,
  carbs,
  userID,
  itemID,
  setForceTrigger,
}) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleAddKcal = async () => {
    const date = getDate();
    await axios({
      method: "POST",
      url: `${process.env.EXPO_PUBLIC_API_URL}/calories`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        data: {
          kcl: parseInt(calories),
          member: userID,
          date: date,
          isBurnedCalories: false,
        },
      },
    })
      .then((res) => {
        setChecked(true);
        setTimeout(() => {
          setChecked(false);
        }, 800);
      })
      .catch((error) => {
        console.log("Error in adding kcal:", error);
      });
  };

  const handleDelete = async () => {
    await axios({
      method: "DELETE",
      url: `${process.env.EXPO_PUBLIC_API_URL}/diet-plans/${itemID}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setDeleted(true);
        setTimeout(() => {
          setDeleted(false);
          setForceTrigger((prev) => !prev);
        }, 400);
      })
      .catch((error) => {
        console.log("Error in deleting food:", error);
      });
  };

  return (
    <View className="flex flex-row justify-between items-center  px-4 py-3 bg-bgColor-trinary/80 rounded">
      {/* food info */}
      <View className="flex flex-col flex-1">
        <Text className="text-base font-manropeMedium text-white">
          {foodName}
        </Text>
        <Text className="text-sm font-manropeRegular text-white/80">
          {calories ?? "-"} kcal / {carbs ?? "-"} carbs
        </Text>
      </View>
      {/* buttons */}
      <View className="flex flex-row items-center gap-3">
        <TouchableOpacity onPress={handleAddKcal} disabled={checked}>
          {checked ? (
            <AntDesign name="checkcircle" size={24} color="#017EA7" />
          ) : (
            <AntDesign name="pluscircleo" size={24} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} disabled={deleted}>
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

export default SectionItem;
