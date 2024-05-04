import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    Manrope: require("../assets/fonts/Manrope-VariableFont_wght.ttf"),
    ManropeSemiBold: require("../assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("../assets/fonts/Manrope-Bold.ttf"),
    ManropeExtraBold: require("../assets/fonts/Manrope-ExtraBold.ttf"),
    ManropeLight: require("../assets/fonts/Manrope-Light.ttf"),
    ManropeExtraLight: require("../assets/fonts/Manrope-ExtraLight.ttf"),
    ManropeMedium: require("../assets/fonts/Manrope-Medium.ttf"),
    ManropeRegular: require("../assets/fonts/Manrope-Regular.ttf"),
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
