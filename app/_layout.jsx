import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    Manrope: require("../assets/fonts/Manrope-VariableFont_wght.ttf"),
  });
  useEffect(() => {
    if (error) {
      throw error;
    }
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [error, fontsLoaded]);
  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RootLayout;
