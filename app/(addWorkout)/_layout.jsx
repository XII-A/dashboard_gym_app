import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";

const AddWorkOutLayout = () => {
  const router = useRouter();
  return (
    <>
      <Stack>
        <Stack.Screen
          name="addWorkout"
          options={{
            headerShown: true,
            title: "Add Workout",
            headerStyle: {
              backgroundColor: "#017EA7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "ManropeBold",
            },
            headerTitleAlign: "center",
            // add a button to go back to the previous screen
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                >
                  <View className="flex justify-center mr-2">
                    <AntDesign name="left" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              );
            },
          }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="#0D1013" />
    </>
  );
};

export default AddWorkOutLayout;
