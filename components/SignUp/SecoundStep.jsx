import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Button,
} from "react-native";
import React, { useState } from "react";
import FormField from "../FormField";
import CustomButton from "../CustomButton";
import { Link } from "expo-router";
import { icons } from "../../constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const ImageViewer = ({ src }) => {
  // console.log("the src is: ", src);
  return (
    <View className="flex justify-center items-center bg-white/5 border border-white/10 rounded-full w-36 h-36">
      {src == null ? (
        <Image
          source={icons.person}
          resizeMode="contain"
          className="w-20 h-20"
          tintColor={"#64748bd9"}
        />
      ) : (
        <Image
          source={{ uri: src }}
          resizeMode="cover"
          className="w-36 h-36 rounded-full"
        />
      )}
    </View>
  );
};

const SecoundStep = ({ formValues, setFromValues, gyms }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState();

  const gymOptions = gyms.map((gym) => gym.attributes.name);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.2,
    });

    // console.log("the result of the image picker is", result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, userEmail, setIsLoading) => {
    try {
      console.log("the selected image uri is: ", uri);
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
      // console.log("the blob is: ", blob);
      const imageRef = ref(storage, `ProfilePics/${userEmail}`);
      const downloadUrl = await uploadBytes(imageRef, blob).then(
        async (snapshot) => {
          const url = await getDownloadURL(imageRef);
          return url;
        }
      );
      // console.log("the download url is: ", downloadUrl);
      return downloadUrl;
    } catch (err) {
      console.log("error uploading image: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const options = [
    "game gym",
    "insane gym",
    "star gym",
    "game gym",
    "insane gym",
    "star gym",
    "game gym",
    "insane gym",
    "star gym",
    "insane gym",
    "star gym",
    "game gym",
    "insane gym",
    "star gym",
    "insane gym",
    "star gym",
    "game gym",
  ];

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
            <ImageViewer src={selectedImage} />
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
          formType={"ActionSheetIOS"}
          value={formValues.gymName}
          onPress={handleOpenActionSheet}
          otherStyles="mt-4"
          placeholder={"Select your gym"}
        />
      )}
      {Platform.OS === "android" && (
        <FormField
          title={"Gym"}
          formType={"Picker"}
          value={formValues.gymId}
          placeholder={"Select your gym"}
          handleChange={(e) =>
            setFromValues((prev) => {
              return {
                ...prev,
                gymId: e,
              };
            })
          }
          options={options}
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
    </View>
  );
};

export default SecoundStep;
