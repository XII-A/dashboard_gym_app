import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSignUp = () => {};
  return (
    <SafeAreaView className="bg-bgColor-secondary h-full">
      <KeyboardAwareScrollView extraHeight={300}>
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
            Sign Up to Fitness
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
          <FormField
            title="Confirm Password"
            value={confirmPassword}
            handleChange={(e) => setConfirmPassword(e)}
            otherStyles="mt-4"
          />

          <CustomButton
            title="Sign Up"
            handlePress={handleSignUp}
            containerStyles="mt-6"
            textStyles={""}
            isDisabled={!email || !password}
            isLoading={isLoading}
          />

          <View className="flex flex-row items-center gap-2 mt-5 justify-center">
            <Text className=" text-center text-sm font-manroperegular text-gray-400">
              Already a member?
            </Text>
            <Link href="/log-in">
              <Text className="text-blue-text text-sm font-manropeSemiBold">
                Log in
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
