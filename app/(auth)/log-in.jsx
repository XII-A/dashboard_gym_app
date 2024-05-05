import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleLogIn = () => {};
  return (
    <SafeAreaView className="bg-bgColor-secondary h-full">
      <ScrollView>
        <View className="w-full justify-center  min-h-[83vh] px-4 my-6 flex flex-col ">
          {/* logo and app name */}
          <View className="flex flex-row gap-2 items-center">
            <Image source={icons.logo} resizeMode="contain" />
            <Text className="text-2xl font-manropeBold text-blue-text">
              Fitness
            </Text>
          </View>
          {/* login text */}
          <Text className="text-2xl font-manropeSemiBold text-white mt-10">
            Log in to Fitness
          </Text>

          {/* form */}
          <FormField
            title="Email"
            value={email}
            handleChange={(e) => setEmail(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={password}
            handleChange={(e) => setPassword(e)}
            otherStyles="mt-4"
          />

          <CustomButton
            title="Log in"
            handlePress={handleLogIn}
            containerStyles="mt-6"
            textStyles={""}
            isDisabled={!email || !password}
            isLoading={isLoading}
          />

          <View className="flex flex-row items-center gap-2 mt-5 justify-center">
            <Text className=" text-center text-sm font-manroperegular text-gray-400">
              Not a member?
            </Text>
            <Link href="/sign-up">
              <Text className="text-blue-text text-sm font-manropeSemiBold">
                Sign up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LogIn;
