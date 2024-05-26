import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProfileData from "../../components/ProfileData";

const Profile = () => {
  return (
    <View className=" flex-1 bg-bgColor-primary ">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <ProfileData />
      </ScrollView>
    </View>
  );
};

export default Profile;
