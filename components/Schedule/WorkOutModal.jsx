import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import SearchBarField from "../shared/SearchBarField";

const WorkOutModal = ({
  showModal,
  setShowModal,
  value,
  setValue,
  loading,
  setLoading,
  setFormValues,
  setSelectedImage,
}) => {
  const outSideRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);

  const [selectedWorkOut, setSelectedWorkout] = useState();
  const [workOutInfoLoading, setWorkOutInfoLoading] = useState(false);
  const handleGetWorkOutInfo = async (item) => {
    setWorkOutInfoLoading(true);
    try {
      await axios({
        method: "GET",
        url: `https://api.unsplash.com/search/photos/?client_id=8PnW3Gqw_PNo6gQb_HoSuN3XY3kBSBpXIKHYzeHZKWI&query=${item.name}&per_page=1`,
      }).then((res) => {
        setFormValues((prev) => ({
          workoutName: item.name,
          duration: item.duration_minutes.toString(),
          caloriesPerHour: item.calories_per_hour.toString(),
          time: "",
          day: "",
          member: "",
          workoutImageUrl: res.data.results[0].urls.regular,
        }));
        setSelectedImage(res.data.results[0].urls.regular);

        setWorkOutInfoLoading(false);
        setShowModal(false);
      });
    } catch (error) {
      setWorkOutInfoLoading(false);
      console.log("there is an error in getting Workoutinfo", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      await axios({
        method: "GET",
        url: `https://api.api-ninjas.com/v1/caloriesburned?activity=${value}`,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.EXPO_PUBLIC_NINJA_API_KEY,
        },
      }).then((res) => {
        setSearchResults(res.data);
        setLoading(false);
      });
    } catch (error) {
      console.log("error in searching for workout", error);
      setLoading(false);
    }
  };

  useEffect(() => {}, [searchResults]);

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
        setValue("");
        setSearchResults([]);
      }}
      presentationStyle="pageSheet"
      onShow={() => {
        outSideRef.current.focus();
      }}
    >
      <View className="h-full bg-bgColor-primary">
        {/* search bar */}
        <SearchBarField
          value={value}
          setValue={setValue}
          handleSearch={handleSearch}
          loading={loading}
          placeholder="Search for food"
          outSideRef={outSideRef}
        />
        {/* search results */}
        {!loading && searchResults.length > 0 && (
          <View className="flex flex-1 my-4 px-4">
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View className="flex flex-row items-center justify-between  bg-bgColor-trinary/80 px-4 py-3 rounded-md my-1">
                    <View className="flex flex-col">
                      <Text className="flex-1 text-base font-manropeMedium  text-white">
                        {item.name}
                      </Text>
                      <Text className="flex-1 text-sm font-manropeMedium  text-white/80">
                        {item.calories_per_hour} kcal/h for{" "}
                        {item.duration_minutes} min/s
                      </Text>
                    </View>

                    <TouchableOpacity
                      className="flex flex-row justify-end ml-2"
                      onPress={() => {
                        setSelectedWorkout(item.name);
                        handleGetWorkOutInfo(item);
                      }}
                    >
                      <View className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-default ">
                        {!workOutInfoLoading ||
                        selectedWorkOut !== item.title ? (
                          <Entypo name="plus" size={20} color="white" />
                        ) : (
                          <ActivityIndicator size="small" color="#fff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default WorkOutModal;
