import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../components/DietPlan/Header";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FoodList from "../../components/DietPlan/FoodList";
import axios from "axios";
import ProfileData from "../../components/ProfileData";
import { useAuth } from "../context/AuthContext";

// currently unused
const Profile = () => {
  const [gyms, setGyms] = useState([]);
  const { onLogin } = useAuth();

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
    // validate the form first

    // checking if the email contains @ and .
    if (!formValues.email.includes("@") || !formValues.email.includes(".")) {
      Alert.alert("Please enter a valid email address");
      return;
    }
    // checking if the password is less than 6 characters
    if (formValues.password.length < 6) {
      Alert.alert("Password must be at least 6 characters long");
      return;
    }

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
  const { onLogout } = useAuth();
  
  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <KeyboardAwareScrollView extraScrollHeight={128}>
        <View className="h-full bg-bgColor-primary flex flex-1   ">
          <View className="flex flex-row justify-between items-center py-2">
            <Text className="text-2xl font-manropeBold text-white my-2 px-4">
              Personal Details
            </Text>
          </View>
          <View className="bg-bgColor-trinary flex flex-col py-2">
            <View className="flex flex-row justify-between items-center py-2">
            
          
            <ProfileData
              formValues={formValues}
              setFromValues={setFromValues}
              handleInitSignUp={handleInitSignUp}
              gyms={gyms}
              onLogin={onLogin}
            />
          
            </View>
          </View>
          <View className="flex items-center justify-center h-9 w-[100px] rounded bg-blue-400">
            <TouchableOpacity onPress={onLogout}>
              <Text className="text-white">LogOut</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Profile;
