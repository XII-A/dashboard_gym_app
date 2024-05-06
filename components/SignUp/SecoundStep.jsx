import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import FormField from "../FormField";
import CustomButton from "../CustomButton";
import { Link } from "expo-router";
import { icons } from "../../constants";

const ImageViewer = ({ src }) => {
  console.log("the src is: ", src);
  return (
    <View className="flex justify-center items-center bg-bgColor-trinary border border-white/50 rounded-full w-32 h-32">
      <Image
        source={src == null ? icons.person : src}
        resizeMode="contain"
        className="w-24 h-24"
      />
    </View>
  );
};

const SecoundStep = ({ formValues, setFromValues, handleInitSignUp }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <View className="bg-red-500 ">
      <View className="w-full flex justify-center items-center">
        <ImageViewer src={selectedImage} />
      </View>
    </View>
  );
};

export default SecoundStep;
