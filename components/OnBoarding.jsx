import { View, Text, FlatList, Animated } from "react-native";
import React, { useState, useRef } from "react";
import slides from "../constants/slides";
import OnBoardingItem from "./OnBoardingItem";
const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View className="flex flex-1 justify-center items-center  ">
      <FlatList
        data={slides}
        renderItem={({ item }) => <OnBoardingItem item={item} />}
        nestedScrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slideRef}
      />
    </View>
  );
};

export default OnBoarding;
