import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

import { icons } from "../../constants";
import ImageViewer from "../../components/shared/ImageViewer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormField from "../../components/FormField";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const addWorkout = () => {
  const [formValues, setFormValues] = useState({
    workoutName: "",
    duration: "",
    caloriesPerHour: "",
    time: "",
    day: "",
    member: "",
    workoutImageUrl: "",
  });

  useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues]);

  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View className="bg-bgColor-primary flex flex-col flex-1 px-4 ">
      <KeyboardAwareScrollView extraScrollHeight={100}>
        <View className="w-full flex justify-center items-center relative my-2">
          <Text className="text-base text-white font-manropeMedium mb-2">
            Workout Image
          </Text>
          <View className="relative">
            <TouchableOpacity onPress={pickImage}>
              <ImageViewer src={selectedImage} icon={icons.imageFill} />
              {/* plus image in case there is no selected image */}
              {!selectedImage && (
                <View className="absolute right-5 bottom-2">
                  <AntDesign name="pluscircle" size={24} color="#00A8E8" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <FormField
          title={"Workout Name"}
          value={formValues.workoutName}
          handleChange={(e) =>
            setFormValues((prev) => {
              return {
                ...prev,
                workoutName: e,
              };
            })
          }
          otherStyles="mt-4"
          placeholder={"Cardio"}
        />
        <FormField
          title={"Duration (minutes)"}
          value={formValues.duration}
          handleChange={(e) =>
            setFormValues((prev) => {
              return {
                ...prev,
                duration: e,
              };
            })
          }
          otherStyles="mt-4"
          placeholder={"30"}
          inputMode={"numeric"}
        />
        <FormField
          title={"Calories per Hour"}
          value={formValues.caloriesPerHour}
          handleChange={(e) =>
            setFormValues((prev) => {
              return {
                ...prev,
                caloriesPerHour: e,
              };
            })
          }
          otherStyles="mt-4"
          placeholder={"300"}
          inputMode={"numeric"}
        />
        {/* CREATE A TIME PICKER FOR ANDROID AND IOS */}
        {/* days picker */}

        <FormField
          title={"Day"}
          formType={"Picker"}
          value={formValues.day}
          placeholder={"Select your gym"}
          handleChange={(e) =>
            setFormValues((prev) => {
              return {
                ...prev,
                day: e,
              };
            })
          }
          options={days}
          otherStyles="mt-4"
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default addWorkout;
