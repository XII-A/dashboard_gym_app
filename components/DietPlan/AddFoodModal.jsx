import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import SearchBarField from "../shared/SearchBarField";

const AddFoodModal = ({
  showAddFood,
  setShowAddFood,
  selectedMeal,
  setFoodList,
  setTotalCalories,
  userID,
  selectedDay,
}) => {
  const inputRef = useRef(null);

  const [value, setValue] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [nothingFound, setNothingFound] = useState(false);

  const [foodInfoLoading, setFoodInfoLoading] = useState(false);
  const [foodInfo, setFoodInfo] = useState({
    foodName: "",
    meal: "",
    calories: 0,
    carbs: 0,
  });

  const handleSearch = async () => {
    setLoading(true);
    if (value.length === 0) {
      setLoading(false);
      return;
    }
    try {
      await axios({
        method: "GET",
        url: `https://api.api-ninjas.com/v1/recipe?query=${value}`,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.EXPO_PUBLIC_NINJA_API_KEY,
        },
      }).then((res) => {
        setSearchResults(res.data);

        setLoading(false);
        if (res.data.length === 0) {
          setNothingFound(true);
          setTimeout(() => {
            setNothingFound(false);
          }, 3000);
        } else {
          setNothingFound(false);
        }
      });
    } catch (e) {
      console.log("Error in searching food: ", e);
      setLoading(false);
    }
  };

  const handleGetFoodInfo = async (foodName) => {
    setFoodInfoLoading(true);
    try {
      await axios({
        method: "GET",
        url: `https://api.api-ninjas.com/v1/nutrition?query=${foodName}`,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.EXPO_PUBLIC_NINJA_API_KEY,
        },
      }).then((res) => {
        setFoodInfoLoading(false);
        let totalCalories = 0;
        let totalCarbs = 0;
        res.data.forEach((element) => {
          totalCalories += element.calories;
          totalCarbs += element.carbohydrates_total_g;
        });
        setFoodInfo({
          foodName: foodName,
          meal: selectedMeal,
          calories: totalCalories,
          carbs: totalCarbs,
        });
      });
    } catch (e) {
      console.log("Error in adding food: ", e);
      setFoodInfoLoading(false);
    }
  };

  const handleAddFood = async () => {
    try {
      setTotalCalories((prev) => Math.ceil(prev + foodInfo.calories));
      // then adding the food to the database
      await axios({
        method: "POST",
        url: `${process.env.EXPO_PUBLIC_API_URL}/diet-plans`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          data: {
            foodName: foodInfo.foodName,
            meal: selectedMeal,
            hour: "09:00" + ":00.000",
            carbs: foodInfo.carbs,
            kcl: foodInfo.calories,
            day: selectedDay,
            member: userID,
          },
        },
      }).then((res) => {
        setFoodList((prev) => {
          let newList = [...prev];
          let index = newList.findIndex((item) => item.title === selectedMeal);
          newList[index].data.push({
            foodName: foodInfo.foodName,
            kcl: foodInfo.calories,
            carbs: foodInfo.carbs,
            id: res.data.data.id,
          });
          newList[index].totalCalories += foodInfo.calories;
          return newList;
        });
      });
    } catch (e) {
      console.log("Error in adding food: ", e);
    }
  };

  useEffect(() => {
    if (foodInfo.foodName !== "") {
      handleAddFood();
      setShowAddFood(false);
      setValue("");
      setSearchResults([]);
    }
  }, [foodInfo]);

  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={showAddFood}
      onRequestClose={() => {
        setShowAddFood(false);
        setValue("");
        setSearchResults([]);
      }}
      presentationStyle="pageSheet"
    >
      <View className="h-full bg-bgColor-primary">
        {/* search bar */}
        <SearchBarField
          value={value}
          setValue={setValue}
          handleSearch={handleSearch}
          loading={loading}
          placeholder="Search for food"
        />

        {/* search results */}
        {!loading && searchResults.length > 0 && (
          <View className="flex-1 my-4 px-4">
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => {
                return (
                  <View className="flex flex-row items-center  bg-bgColor-trinary/80 px-4 py-3 rounded-md my-1">
                    <Text className="flex-1 text-base font-manropeMedium  text-white">
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      className="flex flex-row justify-end ml-2"
                      onPress={() => {
                        setSelectedFood(item.title);
                        handleGetFoodInfo(item.title);
                      }}
                    >
                      <View className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-default ">
                        {!foodInfoLoading || selectedFood !== item.title ? (
                          <Entypo name="plus" size={20} color="white" />
                        ) : (
                          <ActivityIndicator size="small" color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
        {nothingFound && searchResults.length <= 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-white">No food with that name was found</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default AddFoodModal;
