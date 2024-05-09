import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import FirstStep from "../../components/SignUp/FirstStep";
import SecoundStep from "../../components/SignUp/SecoundStep";

const SignUp = () => {
  const [gyms, setGyms] = useState([]);
  useEffect(() => {
    axios({
      url: `${process.env.EXPO_PUBLIC_API_URL}/gyms`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setGyms(res.data.data);
      })
      .catch((err) => {
        console.log("Something went wrong in getting gyms: ", err);
      });
  }, []);

  useEffect(() => {
    console.log("-------------------------------\n");
    console.log("the gyms are: ", gyms);
  }, [gyms]);

  const [formValues, setFromValues] = useState({
    email: null,
    password: null,
    confirmPassword: null,
    firstName: null,
    lastName: null,
    weight: null,
    height: null,
    gymId: null,
    gymName: null,
    birthDate: null,
    stepsGoal: null,
    caloriesGoal: null,
    workoutGoal: null,
  });
  const [currentStep, setCurrentStep] = useState(2);
  const handleInitSignUp = async () => {
    // checking if the email exists or not first before taking the user to the next step
    try {
      await axios({
        url: `${process.env.EXPO_PUBLIC_API_URL}/users?filters[$and][0][email][$eq]=${formValues.email}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.data?.length > 0) {
            Alert.alert("An account with this email already exists");
          } else {
            setCurrentStep(2);
          }
        })
        .catch((err) => {
          console.log("Something went wrong in initial sign up: ", err);
        });
    } catch (err) {
      console.log("Something went wrong in initial sign up: ", err);
    }
  };
  return (
    <SafeAreaView className="bg-bgColor-secondary h-full">
      <KeyboardAwareScrollView extraScrollHeight={128}>
        <View className="w-full justify-center  min-h-[83vh] px-4 my-6 flex flex-col ">
          {/* logo and app name */}
          <View className="flex flex-row gap-2 items-center justify-center">
            <Image source={icons.logo} resizeMode="contain" />
            <Text className="text-2xl font-manropeBold text-blue-text">
              Fitness
            </Text>
          </View>
          {/* login text */}
          <Text className="text-2xl font-manropeSemiBold text-white mt-10">
            Sign Up to Fitness
          </Text>
          <Text className="text-sm font-manropeMedium text-gray-400 mt-2">
            Step {currentStep} of 2
          </Text>
          {/* form */}
          {currentStep === 1 && (
            <FirstStep
              formValues={formValues}
              setFromValues={setFromValues}
              handleInitSignUp={handleInitSignUp}
            />
          )}
          {currentStep === 2 && (
            <SecoundStep
              formValues={formValues}
              setFromValues={setFromValues}
              gyms={gyms}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
