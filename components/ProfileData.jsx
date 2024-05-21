import {
  View,
  Image,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
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
    // password: user.password,
    // confirmPassword: user.confirmPassword,
    firstName: user.name,
    lastName: user.surname,
    weight: user.weight,
    height: user.height,
    gymId: user.gymId,
    gymName: user.gymName,
    birthDate: user.birthday,
    stepsGoal: user.stepsGoal,
    caloriesGoal: user.caloriesGoal,
    workoutGoal: user.workoutsGoal,
  });

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
      setFormValues((prev) => {
        return {
          ...prev,
          profilePic: imageUrl,
        };
      });
      const jsonUser = JSON.stringify(user);
      const res = await axios({
        url: `${process.env.EXPO_PUBLIC_API_URL}/auth/local/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonUser,
      })
        .then((res) => {
          // log in the user after signing up then redirect to the overview page
          onLogin(formValues.email, formValues.password);
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
          setFormValues((prev) => {
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
    <View className="p-4 w-full">
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

      {/* form */}
      <FormFieldProfile
        title="Email"
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              email: e,
            };
          })
        }
        inputMode={"email"}
        otherStyles="mt-4"
        placeholder={formValues.email}
        keyboardType="email-address"
      />
      {/* <FormFieldProfile
        title="Password"
        value={formValues.password}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              password: e,
            };
          })
        }
        otherStyles="mt-4"
      />
      <FormFieldProfile
        title="Confirm Password"
        value={formValues.confirmPassword}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              confirmPassword: e,
            };
          })
        }
        otherStyles="mt-4"
      /> */}

      {/* <CustomButton
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
        /> */}

      <FormFieldProfile
        title={"First Name"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              firstName: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={formValues.firstName}
      />
      <FormFieldProfile
        title={"Last Name"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              lastName: e,
            };
          })
        }
        otherStyles="mt-4"
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
        otherStyles="mt-4"
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
        otherStyles="mt-4"
        placeholder={"170"}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Steps Goal"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              stepsGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={formValues.stepsGoal}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Calories Goal"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              caloriesGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={formValues.caloriesGoal}
        inputMode={"numeric"}
      />
      <FormFieldProfile
        title={"Workout Goal"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              workoutGoal: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={formValues.workoutGoal}
        inputMode={"numeric"}
      />
      {/* gym picker */}
      {Platform.OS === "ios" && (
        <FormFieldProfile
          title={"Gym"}
          formType={"Picker"}
          value={formValues.gymName}
          handleChange={(e) =>
            setFormValues((prev) => {
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
        <FormFieldProfile
          title={"Gym"}
          formType={"Picker"}
          value={formValues.gymName}
          placeholder={"Select your gym"}
          handleChange={(e) =>
            setFormValues((prev) => {
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
      <FormFieldProfile
        title={"Date of Birth"}
        formType={"DatePicker"}
        value={""}
        handleChange={(e) =>
          setFormValues((prev) => {
            return {
              ...prev,
              birthDate: e,
            };
          })
        }
        otherStyles="mt-4"
        placeholder={formValues.birthDate}
      />

      <View className="flex flex-row justify-center">
        <CustomButton
          title={"Confirm"}
          containerStyles="p-4 m-4"
          handlePress={handleFinishSignUp}
          isLoading={isLoading}
        />

        <CustomButton
          title={"Log Out"}
          containerStyles="p-4 m-4"
          handlePress={onLogout}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default ProfileData;
