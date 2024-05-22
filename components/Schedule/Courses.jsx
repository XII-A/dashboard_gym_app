import { View, Text, FlatList, Image, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../app/context/AuthContext";
import { convert24to12, getDate } from "../../utils/timeUtils";
import CoursesList from "./CoursesList";

const Courses = ({ key }) => {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [upcomingCoursesLoading, setUpcomingCoursesLoading] = useState(true);

  const [coursesList, setCoursesList] = useState([]);

  const getUpcomingCourses = async () => {
    const date = getDate();
    await axios({
      method: "GET",
      url: `${process.env.EXPO_PUBLIC_API_URL}/courses?filters[$and][0][attendees][id][$contains]=${user.id}&filters[$and][1][date][$gt]=${date}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setUpcomingCourses(res.data.data);
        setUpcomingCoursesLoading(false);
      })
      .then(async () => {
        await axios({
          method: "GET",
          url: `${process.env.EXPO_PUBLIC_API_URL}/courses?filters[$and][0][date][$gt]=${date}`,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            setCourses(res.data.data);
          })
          .catch((error) => {
            console.log("Error in getting upcoming courses:", error);
          });
      })
      .catch((error) => {
        console.log("Error in getting upcoming courses:", error);
      });
  };

  useEffect(() => {
    getUpcomingCourses();
  }, []);

  useEffect(() => {
    let upcomingCoursesList = {
      title: "Upcoming Courses",
      data: upcomingCourses,
    };
    let filteredCourses = courses.filter(
      (courses) =>
        !upcomingCourses.find(
          (upcomingCourses) => upcomingCourses.id === courses.id
        )
    );
    let bookCourseList = {
      title: "Book a Course",
      data: filteredCourses,
    };
    setCoursesList([upcomingCoursesList, bookCourseList]);
  }, [courses]);

  return (
    <View key={key} className="flex flex-1 px-4 my-2">
      <CoursesList
        coursesList={coursesList}
        userID={user.id}
        setCoursesList={setCoursesList}
      />
    </View>
  );
};

export default Courses;
