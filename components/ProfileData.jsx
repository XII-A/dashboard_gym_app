import {
  View,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import FormFieldProfile from "./FormFieldProfile";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import { icons } from "./../constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { storage } from "./../firebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";
import { useAuth } from "./../app/context/AuthContext.tsx";
import axios from "axios";

const ImageViewer = ({ src }) => {
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

const ProfileData = ({}) => {
  const { onLogin } = useAuth();

  const { onLogout } = useAuth();

  const { user } = useAuth();

  const [gyms, setGyms] = useState([]);

  const [formValues, setFormValues] = useState({
    email: user.email,
    image: user.profilepicUrl,
    firstName: user.name,
    lastName: user.surname,
    weight: user.weight.toString(),
    height: user.height.toString(),
    birthDate: user.birthday,
    stepsGoal: user.stepsGoal,
    caloriesGoal: user.caloriesGoal,
    workoutGoal: user.workoutsGoal,
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setSelectedImage(user.profilepicUrl);
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);

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

  const handleConfirm = async () => {};

  useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues]);

  return (
    <View className="w-full">
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

      <FormFieldProfile
        title={"First Name"}
        value={formValues.firstName}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              firstName: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4 mt-4"
        placeholder={user.firstName}
      />
      <FormFieldProfile
        title={"Last Name"}
        value={formValues.lastName}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              lastName: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={formValues.lastName}
      />
      <FormFieldProfile
        title={"Weight (kg)"}
        value={formValues.weight}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              weight: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={"formValues.weight"}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Height (cm)"}
        value={formValues.height}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              height: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={"170"}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Steps Goal"}
        value={formValues.stepsGoal}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              stepsGoal: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={formValues.stepsGoal}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Calories Goal"}
        value={formValues.caloriesGoal}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              caloriesGoal: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={formValues.caloriesGoal}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Workout Goal"}
        value={formValues.workoutGoal}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              workoutGoal: e,
            };
          })
        }
        otherStyles="border-t border-[#64748bd9] px-4"
        placeholder={formValues.workoutGoal}
        inputMode={"numeric"}
      />

      <FormFieldProfile
        title={"Date of Birth"}
        formType={"DatePicker"}
        value={formValues.birthDate}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              birthDate: e,
            };
          })
        }
        otherStyles="border-y border-[#64748bd9] px-4"
        placeholder={formValues.birthDate}
      />

      <View className="flex flex-row justify-center px-4 mt-4 h-24">
        <CustomButton
          title={"Confirm"}
          containerStyles="p-4 w-full h-12"
          handlePress={handleConfirm}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default ProfileData;
