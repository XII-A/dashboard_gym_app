import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FormField from "../FormField";
import CustomButton from "../CustomButton";
import { Link } from "expo-router";
import { icons } from "../../constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref } from "firebase/storage";

const ImageViewer = ({ src }) => {
  // console.log("the src is: ", src);
  return (
    <View className="flex justify-center items-center bg-bgColor-trinary border border-white/40 rounded-full w-36 h-36">
      {src == null ? (
        <Image
          source={icons.person}
          resizeMode="contain"
          className="w-20 h-20"
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

const SecoundStep = ({ formValues, setFromValues, handleInitSignUp }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

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
      {/* button to upload image */}
      <TouchableOpacity
        onPress={async () => {
          const downloadUrl = await uploadImage(
            selectedImage,
            formValues.email,
            setIsLoading
          );
          // console.log("the download url is outside: ", downloadUrl);
        }}
        className="flex justify-center items-center mt-4"
      >
        <Text className="text-blue-default font-manropeBold text-lg">
          Upload Image
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SecoundStep;
