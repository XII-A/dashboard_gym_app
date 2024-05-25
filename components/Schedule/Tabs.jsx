import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { withTiming } from "react-native-reanimated";
import { useAnimatedProps, useSharedValue } from "react-native-reanimated";

const TabsViewer = ({
  routes,
  index,
  setIndex,
  pagerRef,
  opacity,
  position,
}) => {
  // !!! idk if how this works
  const leftPos = useSharedValue(0);
  const rightPos = useSharedValue(0);

  const handlePress = (i) => {
    setIndex(i);
    pagerRef.current.setPage(i);
    if (i === 0) {
      leftPos.value = withTiming(0);
      rightPos.value = withTiming("50%");
    }
    if (i === 1) {
      leftPos.value = withTiming("50%");
      rightPos.value = withTiming(0);
    }
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      left: leftPos.value,
      right: rightPos.value,
    };
  });

  useEffect(() => {
    leftPos.value = withTiming(index === 0 ? 0 : "50%");
  }, [index]);

  return (
    <View className="flex-row justify-center px-4 my-2">
      <View className="flex flex-row w-10/12 h-10 rounded-full  justify-center items-center   bg-bgColor-trinary/80 overflow-hidden">
        <Animated.View
          className="absolute w-1/2 rounded-full h-full bg-blue-text"
          animatedProps={animatedProps}
        />
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => handlePress(i)}
            className="flex flex-row justify-center items-center flex-auto  w-full h-full"
          >
            <View
              className="flex flex-row justify-center items-center flex-auto  w-full h-full rounded-full "
              style={{}}
            >
              <Text
                style={{
                  color: index === i ? "#fff" : "#C4C4C4",
                }}
                className="text-lg font-manropeSemiBold"
              >
                {route.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabsViewer;
