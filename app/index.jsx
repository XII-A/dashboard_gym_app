import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../constants";
import OnBoarding from "../components/OnBoarding";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnBoarding] = useState(false);
  const { authState, onLogout, authLoading } = useAuth();

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");
      console.log("the value is", value);
      if (value !== null) {
        setViewedOnBoarding(true);
      }
    } catch (error) {
      console.log("error in checking on boarding");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  // useEffect(() => {
  //   console.log("auth state inside login screen", authState);
  // }, [authState]);
  // useEffect(() => {
  //   console.log("auth load state inside login screen", authLoading);
  // }, [authLoading]);

  if (authLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!loading && viewedOnboarding && !authLoading) {
    if (!authState.authenticated) {
      return <Redirect href="/log-in" />;
    } else {
      return <Redirect href={"/overview"} />;
    }
  }
  return (
    // Onboarding screen
    <SafeAreaView className="bg-bgColor-secondary h-full">
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="flex flex-col items-center  h-full w-full ">
          {/* logo and name */}
          <View className="flex flex-row gap-2 items-center">
            <Image source={icons.logo} resizeMode="contain" />
            <Text className="text-2xl font-manropeBold text-blue-text">
              Fitness
            </Text>
          </View>
          <OnBoarding />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
