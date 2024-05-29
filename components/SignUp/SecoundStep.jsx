import {
  View,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import FormField from "../FormField";
import CustomButton from "../CustomButton";
import { router } from "expo-router";
import { icons } from "../../constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import axios from "axios";
import ImageViewer from "../shared/ImageViewer";

const SecoundStep = ({ formValues, setFromValues, gyms, onLogin }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const gymOptions = gyms.map((gym) => gym.attributes.name);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, userEmail, setIsLoading) => {
    try {
      setIsLoading(true);
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
      const imageRef = ref(storage, `ProfilePics/${userEmail}`);
      const downloadUrl = await uploadBytes(imageRef, blob).then(
        async (snapshot) => {
          const url = await getDownloadURL(imageRef);
          return url;
        }
      );
      return downloadUrl;
    } catch (err) {
      console.log("error uploading image: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishSignUp = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await uploadImage(
        selectedImage,
        formValues.email,
        setIsLoading
      );
      setFromValues((prev) => {
        return {
          ...prev,
          profilePic: imageUrl,
        };
      });
      const user = {
        email: formValues.email,
        password: formValues.password,
        name: formValues.firstName,
        surname: formValues.lastName,
        birthday: formValues.birthDate,
        weight: formValues.weight,
        height: formValues.height,
        gym: formValues.gymId,
        profilepicUrl: imageUrl,
        username: formValues.email,
        stepsGoal: formValues.stepsGoal,
        caloriesGoal: formValues.caloriesGoal,
        workoutsGoal: formValues.workoutGoal,
        waterGoal: 0,
      };

      const jsonUser = JSON.stringify(user);
      const res = await axios({
        url: `${process.env.EXPO_PUBLIC_API_URL}/auth/local/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonUser,
      })
        .then(async (res) => {
          // log in the user after signing up then redirect to the overview page
          await onLogin(formValues.email, formValues.password);
          router.replace("/overview");
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(
            "error in finishing sign up .catch: ",
            err.response.data.error.message
          );
          Alert.alert(err.response.data.error.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("error in finishing sign up: ", error);
      Alert.alert("Something went wrong, please try again");
      setIsLoading(false);
    }
  };

  const handleOpenActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...gymOptions],
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
        title: "Select your gym",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else {
          setFromValues((prev) => {
            return {
              ...prev,
              gymId: gyms[buttonIndex - 1].id,
              gymName: gyms[buttonIndex - 1].attributes.name,
            };
          });
        }
      }
    );
  };

  return (
    <View className="">
      <View className="w-full flex justify-center items-center relative ">
        <View className="relative">
          <TouchableOpacity onPress={pickImage}>
            <ImageViewer src={selectedImage} icon={icons.person} />
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
        title={"First Name"}
        value={formValues.firstName}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              firstName: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"John"}
      />
      <FormField
        title={"Last Name"}
        value={formValues.lastName}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              lastName: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"Doe"}
      />
      <FormField
        title={"Weight (kg)"}
        value={formValues.weight}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              weight: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"70"}
        inputMode={"numeric"}
      />
      <FormField
        title={"Height (cm)"}
        value={formValues.height}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              height: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"170"}
        inputMode={"numeric"}
      />
      <FormField
        title={"Steps Goal"}
        value={formValues.stepsGoal}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              stepsGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"10000"}
        inputMode={"numeric"}
      />
      <FormField
        title={"Calories Goal"}
        value={formValues.caloriesGoal}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              caloriesGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"2000"}
        inputMode={"numeric"}
      />
      <FormField
        title={"Workout Goal"}
        value={formValues.workoutGoal}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              workoutGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"4 hours"}
        inputMode={"numeric"}
      />
      {/* gym picker */}
      {Platform.OS === "ios" && (
        <FormField
          title={"Gym"}
          formType={"Picker"}
          value={formValues.gymName}
          handleChange={(e) =>
            setFromValues((prev) => {
              return {
                ...prev,
                gymName: e,
                gymId: gyms.find((gym) => gym.attributes.name === e)?.id,
              };
            })
          }
          otherStyles="mt-4"
          placeholder={"Select your gym"}
          options={gymOptions}
        />
      )}
      {Platform.OS === "android" && (
        <FormField
          title={"Gym"}
          formType={"Picker"}
          value={formValues.gymName}
          placeholder={"Select your gym"}
          handleChange={(e) =>
            setFromValues((prev) => {
              return {
                ...prev,
                gymName: e,
                gymId: gyms.find((gym) => gym.attributes.name === e).id,
              };
            })
          }
          options={gymOptions}
          otherStyles="mt-4"
        />
      )}
      <FormField
        title={"Date of Birth"}
        formType={"DatePicker"}
        value={formValues.birthDate}
        handleChange={(e) =>
          setFromValues((prev) => {
            return {
              ...prev,
              birthDate: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={"Select your birth date"}
      />
      <CustomButton
        title={"Sign Up"}
        containerStyles="mt-4"
        handlePress={handleFinishSignUp}
        isLoading={isLoading}
      />
    </View>
  );
};

export default SecoundStep;
