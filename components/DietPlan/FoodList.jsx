import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SectionHeader from "./SectionHeader";
import SectionItem from "./SectionItem";
import axios from "axios";
import AddFoodModal from "./AddFoodModal";

const FoodList = ({
  foodList,
  userID,
  setForceTrigger,
  setTotalCalories,
  setFoodList,
  selectedDay,
  setUpdateOverview,
}) => {
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");

  return (
    <>
      <SectionList
        sections={foodList}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => {
          return (
            <SectionItem
              foodName={item.foodName}
              calories={item.kcl.toFixed(2)}
              carbs={item.carbs.toFixed(2)}
              userID={userID}
              itemID={item.id}
              setForceTrigger={setForceTrigger}
              setUpdateOverview={setUpdateOverview}
            />
          );
        }}
        renderSectionHeader={({ section: { title, totalCalories } }) => {
          return (
            <SectionHeader
              title={title}
              totalCalories={parseFloat(totalCalories.toFixed(2))}
            />
          );
        }}
        ItemSeparatorComponent={() => {
          return <View className="mt-2" />;
        }}
        SectionSeparatorComponent={() => {
          return <View className="h-2" />;
        }}
        renderSectionFooter={({ section: { title, totalCalories } }) => {
          return (
            <View
              className={`flex flex-row items-center justify-center px-4 py-3 bg-bgColor-trinary/80 rounded ${
                totalCalories === 0 ? "my-2" : "mb-2"
              } `}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal(title);
                  setShowAddFood(true);
                }}
              >
                <Text className="text-lg text-blue-text font-manropeSemiBold">
                  Add Food
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <AddFoodModal
        showAddFood={showAddFood}
        setShowAddFood={setShowAddFood}
        selectedMeal={selectedMeal}
        setFoodList={setFoodList}
        setTotalCalories={setTotalCalories}
        selectedDay={selectedDay}
        userID={userID}
      />
    </>
  );
};

export default FoodList;
