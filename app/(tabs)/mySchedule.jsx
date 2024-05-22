import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PagerView from "react-native-pager-view";
import TabsViewer from "../../components/Schedule/Tabs";
import Routine from "../../components/Schedule/Routine";
import Courses from "../../components/Schedule/Courses";
import { useAuth } from "../context/AuthContext";

const MySchedule = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Routine " },
    { key: "second", title: "Courses" },
  ]);

  const { user } = useAuth();

  const [opacity, setOpacity] = useState(0);

  const pagerRef = useRef(null);

  return (
    <SafeAreaView className="bg-bgColor-primary flex-1">
      {/* tabs */}
      <TabsViewer
        routes={routes}
        index={index}
        setIndex={setIndex}
        pagerRef={pagerRef}
        opacity={opacity}
      />
      <PagerView
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setIndex(e.nativeEvent.position)}
        ref={pagerRef}
        onPageScroll={(e) => {
          setOpacity(e.nativeEvent.offset);
        }}
      >
        <Routine key="1" userID={user.id} />
        <Courses key="2" />
      </PagerView>
    </SafeAreaView>
  );
};

export default MySchedule;
