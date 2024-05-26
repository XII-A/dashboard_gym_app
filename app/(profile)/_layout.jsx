import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useAuth } from "../context/AuthContext";

const ProfilePageLayout = () => {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { onLogout, updateProfile } = useAuth();
  const onPress = () => {
    const options = ["Logout", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          onLogout();
          router.push("log-in");
        }
      }
    );
  };

  const onBack = () => {
    // if the updateProfile is true, then some changes have been made and are unsaved
    if (updateProfile) {
      const options = ["Discard", "Cancel"];
      const destructiveButtonIndex = 0;
      const cancelButtonIndex = 1;
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          userInterfaceStyle: "dark",
          title: "Discard changes?",
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            router.back();
          }
        }
      );
    } else {
      // if no changes have been made, go back to the previous screen
      router.back();
    }
  };

  return (
    <>
      <Stack>
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            title: "Profile",
            headerStyle: {
              backgroundColor: "#017EA7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: "ManropeBold",
              fontSize: 20,
            },
            headerTitleAlign: "center",
            headerLeft: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onBack();
                  }}
                >
                  <View className="flex justify-center items-center mr-2">
                    <AntDesign name="left" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onPress();
                  }}
                >
                  <View className="flex justify-center mr-2 flex-row items-center ">
                    <Feather name="log-out" size={20} color="white" />
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

export default ProfilePageLayout;
