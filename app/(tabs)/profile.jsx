import {
  View,
  Text,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProfileData from "../../components/ProfileData";


const Profile = () => {
 
  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      <View className="height-[100%]">
        <View className="flex flex-row justify-between items-center py-2">
          <Text className="text-2xl font-manropeBold text-white my-2 px-4">
            Personal Details
          </Text>
        </View>
        <KeyboardAwareScrollView extraScrollHeight={128}>
          <View className="h-full bg-bgColor-primary flex ">
            <View className="h-full bg-bgColor-trinary flex flex-col py-2">
              <View className="flex flex-row justify-between items-center py-2">
                <ProfileData />
              </View>
            </View>
            
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
