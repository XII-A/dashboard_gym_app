import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
const FormField = ({
  title,
  value,
  handleChange,
  otherStyles,
  keyboardType,
  placeholder,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-white font-manropeMedium">{title}</Text>
      <View className="flex flex-row bg-white/5 text-white/90 shadow-sm border border-white/10 h-16 rounded-lg focus:border-blue-default items-center px-4">
        <TextInput
          className="flex-1 text-white/90 font-manropeSemiBold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#64748bd9"}
          onChangeText={handleChange}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text className="text-white/90 font-manropeSemiBold text-base">
              {showPassword ? (
                <Feather name="eye-off" size={24} color="white" />
              ) : (
                <Feather name="eye" size={24} color="white" className="" />
              )}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
