import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "../constants";
import { useRouter } from "expo-router";

const Header = ({ date, user }) => {
  const router = useRouter();
  return (
    <View className="flex flex-row justify-between items-center my-2">
      <View className="flex flex-col items-start gap-2">
        <Text className="text-textColor-secondary text-lg font-manropeSemiBold text-white/80">
          {date}
        </Text>
        <Text className="text-textColor-primary text-3xl font-manropeExtraBold text-white">
          Overview
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push("profile");
        }}
      >
        <View>
          {/* user's icon */}
          {user?.profilepicUrl !== null ? (
            <Image
              source={{ uri: user?.profilepicUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
          ) : (
            <View
              className="bg-bgColor-trinary/80 rounded-full items-center justify-center"
              style={{ width: 50, height: 50 }}
            >
              <Image
                source={icons.person}
                style={{
                  width: 35,
                  height: 35,
                }}
                resizeMode="contain"
                tintColor={"#fff"}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
