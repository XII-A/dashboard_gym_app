import {
  View,
  Text,
  SectionList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { convert24to12, getDate } from "../../utils/timeUtils";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

const upcomingCoursItems = (item) => {
  return (
    <View className="flex flex-row justify-between items-center  px-4 py-3 bg-bgColor-trinary/80 rounded">
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: item.attributes.workOutImageUrl }}
          className="w-12 h-12 rounded-full"
          resizeMethod="contain"
        />
        <View className="flex flex-col ml-2">
          <Text className="text-lg font-manropeSemiBold text-white ">
            {item.attributes.name}
            <Text className="text-sm font-manropeSemiBold text-white/80">
              {" "}
              {item.attributes.duration} min/s
            </Text>
          </Text>
          <Text className="text-xs font-manropeMedium text-white/80">
            {item.attributes.trainerName} {item.attributes.trainerSurname}
          </Text>
        </View>
      </View>
      <View className="flex flex-col items-end">
        <Text className="text-sm font-manropeSemiBold text-white">
          {item.attributes.date}
        </Text>
        <Text className="text-xs font-manropeSemiBold text-white/80">
          {convert24to12(item.attributes.startsAt)}
        </Text>
      </View>
    </View>
  );
};

const bookCourseItem = (item, handleBookCourse) => {
  const [checked, setChecked] = useState(false);

  return (
    <View className="flex flex-row justify-between items-center  px-4 py-3 bg-bgColor-trinary/80 rounded">
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: item.attributes.workOutImageUrl }}
          className="w-12 h-12 rounded-full"
          resizeMethod="contain"
        />
        <View className="flex flex-col ml-2">
          <Text className="text-lg font-manropeSemiBold text-white max-h-6">
            {item.attributes.name}
          </Text>
          <Text className="text-sm font-manropeMedium text-white/80">
            {item.attributes.trainerName} {item.attributes.trainerSurname}
          </Text>
          <Text className="text-xs font-manropeMedium text-white/80">
            {item.attributes.date} {convert24to12(item.attributes.startsAt)} for{" "}
            {item.attributes.duration} min/s
          </Text>
        </View>
      </View>
      <View className="flex flex-col items-end">
        <TouchableOpacity
          onPress={async () => {
            setChecked(true);
            await handleBookCourse(item.id);
            setChecked(false);
          }}
          disabled={checked}
        >
          {checked ? (
            <AntDesign name="checkcircle" size={24} color="#017EA7" />
          ) : (
            <AntDesign name="pluscircleo" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const sectionHeader = (title) => {
  return (
    <View className="flex flex-row   px-4 py-3 bg-blue-default rounded">
      <Text className="text-2xl font-manropeBold text-white ">{title}:</Text>
    </View>
  );
};

const CoursesList = ({
  coursesList,
  userID,
  setCoursesList,
  setForceUpdate,
  refreshing,
}) => {
  const handleBookCourse = async (courseId) => {
    try {
      await axios({
        method: "PUT",
        url: `${process.env.EXPO_PUBLIC_API_URL}/courses/${courseId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          data: {
            attendees: {
              connect: [userID],
            },
          },
        },
      }).then((res) => {
        setCoursesList((prev) => {
          //   we add the course to the upcoming courses list
          let upcomingCoursesList = prev[0].data;
          let bookCourseList = prev[1].data;
          let course = bookCourseList.find((course) => course.id === courseId);
          upcomingCoursesList.push(course);
          bookCourseList = bookCourseList.filter(
            (course) => course.id !== courseId
          );

          return [
            {
              title: "Upcoming Courses",
              data: upcomingCoursesList,
            },
            {
              title: "Book a Course",
              data: bookCourseList,
            },
          ];
        });
      });
    } catch (error) {
      console.log("Error in booking course:", error);
    }
  };

  return (
    <SectionList
      sections={coursesList}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item, section: { title } }) => {
        if (title === "Upcoming Courses") {
          return upcomingCoursItems(item);
        } else {
          return bookCourseItem(item, handleBookCourse);
        }
      }}
      renderSectionHeader={({ section: { title } }) => {
        return sectionHeader(title);
      }}
      SectionSeparatorComponent={() => {
        return <View className="h-2" />;
      }}
      ItemSeparatorComponent={() => {
        return <View className="mt-2" />;
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setForceUpdate((prev) => !prev);
          }}
          colors={["#00A8E8", "#9b71ff", "#F97316"]}
          tintColor={"#00A8E8"}
        />
      }
    />
  );
};

export default CoursesList;
