import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";
// currently unused
const Profile = () => {
  const { onLogout } = useAuth();
  return (
    <View className="flex items-center justify-center h-full bg-blue-400">
      <TouchableOpacity onPress={onLogout}>
        <Text className="text-white">LogOut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
