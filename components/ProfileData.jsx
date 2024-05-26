import { View, Image, TouchableOpacity } from "react-native";
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
  const { user, setUpdateProfile, getMe } = useAuth();

  const [formValues, setFormValues] = useState({
    email: user.email,
    profilepicUrl: user.profilepicUrl,
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
    // upload image to firebase
    const downloadUrl = await uploadImage(
      result.assets[0].uri,
      user.email,
      setIsLoading
    );
    setFormValues((prev) => {
      return {
        ...prev,
        profilepicUrl: downloadUrl,
      };
    });
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
      const imageRef = ref(
        storage,
        `ProfilePics/${userEmail}/${Math.random()}`
      );
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

  const handleDisabled = () => {
    if (
      formValues.profilepicUrl == user.profilepicUrl &&
      formValues.firstName == user.name &&
      formValues.lastName == user.surname &&
      formValues.weight == user.weight.toString() &&
      formValues.height == user.height.toString() &&
      formValues.birthDate == user.birthday &&
      formValues.stepsGoal == user.stepsGoal &&
      formValues.caloriesGoal == user.caloriesGoal &&
      formValues.workoutGoal == user.workoutsGoal
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!handleDisabled()) {
      setUpdateProfile(true);
    } else {
      setUpdateProfile(false);
    }
  }, [formValues]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      axios({
        method: "PUT",
        url: `${process.env.EXPO_PUBLIC_API_URL}/users/${user.id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: formValues.firstName,
          surname: formValues.lastName,
          weight: formValues.weight,
          height: formValues.height,
          birthday: formValues.birthDate,
          stepsGoal: formValues.stepsGoal,
          caloriesGoal: formValues.caloriesGoal,
          workoutsGoal: formValues.workoutGoal,
          profilepicUrl: formValues.profilepicUrl,
        },
      }).then((res) => {
        getMe(); // update the user context
        setUpdateProfile(false);
        setIsLoading(false);
        router.back();
      });
    } catch (err) {
      console.log("error updating profile: ", err);
    }
  };

  return (
    <View className="w-full bg-bgColor-trinary/80 py-4 h-full flex flex-col">
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
        otherStyles="border-t border-[#64748bd9] px-4 mt-6"
        placeholder={"Jhon"}
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
        placeholder={"Doe"}
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
        placeholder={"70"}
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
        placeholder={"10000"}
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
        placeholder={"2000"}
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
        placeholder={"3"}
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
        placeholder={"01/01/2000"}
      />

      <View className="flex flex-row justify-center px-4 mt-6 ">
        <CustomButton
          title={"Confirm"}
          containerStyles="p-4 w-full h-12"
          handlePress={handleConfirm}
          isLoading={isLoading}
          isDisabled={handleDisabled()}
        />
      </View>
    </View>
  );
};

export default ProfileData;
