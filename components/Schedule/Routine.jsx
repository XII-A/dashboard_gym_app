import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import SelectDay from "../shared/SelectDay";
import { convert24to12, getDate } from "../../utils/timeUtils";
import ListItem from "./ListItem";
import { useRouter } from "expo-router";

const Routine = ({ key, userID, updateSchedule }) => {
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-us", { weekday: "long" })
  );

  const router = useRouter();

  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const handleGetSchedule = async () => {
    try {
      await axios({
        method: "GET",
        url: `${process.env.EXPO_PUBLIC_API_URL}/schedules?filters[$and][0][member][id][$eq]=${userID}`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setSchedule(res.data.data);
      });
    } catch (e) {
      console.log("Error in handleGetSchedule in Routine.jsx: ", e);
    }
  };

  useEffect(() => {
    handleGetSchedule();
  }, [updateSchedule]);

  useEffect(() => {
    setFilteredSchedule(
      schedule.filter((item) => item.attributes.day == selectedDay)
    );
  }, [selectedDay, schedule]);

  return (
    <>
      <View key={key} style={{ flex: 1 }}>
        <SelectDay selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <View className="flex flex-1 px-4 my-2">
          <FlatList
            data={filteredSchedule}
            renderItem={({ item }) => (
              <ListItem
                item={item}
                userID={userID}
                setFilteredSchedule={setFilteredSchedule}
              />
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <View
                className={`flex flex-row items-center justify-center px-4 py-3 bg-bgColor-trinary/80 rounded mt-2`}
              >
                <TouchableOpacity
                  onPress={() => {
                    router.push("/addWorkout");
                  }}
                >
                  <Text className="text-lg text-blue-text font-manropeSemiBold">
                    Add Workout
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </View>
    </>
  );
};

export default Routine;
