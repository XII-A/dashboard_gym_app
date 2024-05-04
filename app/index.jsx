import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../constants";
import OnBoarding from "../components/OnBoarding";
export default function App() {
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
