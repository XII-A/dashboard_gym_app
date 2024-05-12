import { View, Text } from "react-native";
import React from "react";
import FormField from "../FormField";
import CustomButton from "../CustomButton";
import { Link } from "expo-router";
const FirstStep = ({ formValues, setFromValues, handleInitSignUp }) => {
  
  return (
    <View>
      {/* form */}
      <FormField
        title="Email"
        value={formValues.email}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              email: e,
            };
          })
        }
        inputMode={"email"}
        otherStyles="mt-4"
        keyboardType="email-address"
      />
      <FormField
        title="Password"
        value={formValues.password}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              password: e,
            };
          })
        }
        otherStyles="mt-4"
      />
      <FormField
        title="Confirm Password"
        value={formValues.confirmPassword}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              confirmPassword: e,
            };
          })
        }
        otherStyles="mt-4"
      />

      <CustomButton
        title="Continue"
        handlePress={handleInitSignUp}
        containerStyles="mt-6"
        textStyles={""}
        isDisabled={
          !formValues.email ||
          !formValues.password ||
          !formValues.confirmPassword ||
          !(formValues.password === formValues.confirmPassword)
        }
        isLoading={false}
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
  );
};

export default FirstStep;
