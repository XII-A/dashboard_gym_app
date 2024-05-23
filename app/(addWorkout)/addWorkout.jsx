import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import AntDesign from "@expo/vector-icons/AntDesign";

import { icons } from "../../constants";
import ImageViewer from "../../components/shared/ImageViewer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

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
    // console.log("formValues", formValues);
  }, [formValues]);

  const { user, setUpdateSchedule } = useAuth();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);

  const uploadImage = async (uri, userEmail) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const imageRef = ref(
        storage,
        `WorkOutPics/${userEmail}/${Math.random() * 1000}`
      );
      const downloadUrl = await uploadBytes(imageRef, blob).then(
        async (snapshot) => {
          const url = await getDownloadURL(imageRef);
          return url;
        }
      );

      return downloadUrl;
    } catch (error) {
      console.log("error in uploading image for workout", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
    uploadImage(result.assets[0].uri, user.email).then((url) => {
      setFormValues((prev) => {
        return {
          ...prev,
          workoutImageUrl: url,
        };
      });
    });
  };

  const [loading, setLoading] = useState(false);

  const handleAddWorkout = async () => {
    setLoading(true);
    try {
      if (
        formValues.workoutName === "" ||
        formValues.duration === "" ||
        formValues.caloriesPerHour === "" ||
        formValues.time === "" ||
        formValues.day === "" ||
        formValues.workoutImageUrl === ""
      ) {
        Alert.alert("All fields are required");
        return false;
      }
      await axios({
        method: "POST",
        url: `${process.env.EXPO_PUBLIC_API_URL}/schedules`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          data: {
            workoutName: formValues.workoutName,
            duration: formValues.duration,
            caloriesPerHour: formValues.caloriesPerHour,
            time: formValues.time + ":00.000",
            day: formValues.day,
            member: user.id,
            workoutImageUrl: formValues.workoutImageUrl ?? "",
          },
        },
      }).then((res) => {
        setUpdateSchedule((prev) => !prev);
        setFormValues({
          workoutName: "",
          duration: "",
          caloriesPerHour: "",
          time: "",
          day: "",
          member: "",
          workoutImageUrl: "",
        });
        setSelectedImage(null);
        router.back();
        return true;
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-bgColor-primary flex flex-col flex-1 px-4 justify-center pb-12">
      <KeyboardAwareScrollView extraScrollHeight={100} className="flex flex-1">
        <View className="w-full flex justify-center items-center relative mt-2">
          <Text className="text-base text-white font-manropeMedium mb-2">
            Workout Image*
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
          title={"Workout Name*"}
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
          title={"Duration (minutes)*"}
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
          title={"Calories per Hour*"}
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
        <FormField
          title={"Starts at*"}
          formType={"TimePicker"}
          placeholder={"Select time"}
          value={formValues.time}
          handleChange={(e) =>
            setFormValues((prev) => {
              return {
                ...prev,
                time: e,
              };
            })
          }
          otherStyles="mt-4"
        />

        <FormField
          title={"Day*"}
          formType={"Picker"}
          value={formValues.day}
          placeholder={"Select day"}
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
        <CustomButton
          title={"Add Workout"}
          handlePress={async () => {
            await handleAddWorkout();
          }}
          containerStyles="mt-4"
          isLoading={loading}
          isDisabled={loading}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default addWorkout;
