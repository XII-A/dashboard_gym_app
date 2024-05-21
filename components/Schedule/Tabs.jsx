import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const TabsViewer = ({ routes, index, setIndex, pagerRef, opacity }) => {
  return (
    <View className="flex-row justify-center px-4 my-2">
      <View className="flex flex-row w-10/12 h-10 rounded-full  justify-center items-center   bg-bgColor-trinary/80 overflow-hidden">
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              setIndex(i);
              pagerRef.current.setPage(i);
            }}
            className="flex flex-row justify-center items-center flex-auto  w-full h-full"
          >
            <View
              className="flex flex-row justify-center items-center flex-auto  w-full h-full rounded-full "
              style={{
                backgroundColor:
                  index === i
                    ? `rgba(0, 168, 232, ${
                        i === 0 ? 1 - opacity : opacity === 0 ? 1 : opacity
                      })`
                    : "transparent",

                zIndex: 9999,
                shadowColor: "#000",
                shadowOffset: {
                  width: index === 0 ? 2 : -2,
                  height: 2,
                },
                shadowOpacity: index === i ? 0.45 : 0,
                shadowRadius: 3.84,
                // elevation: 5,
              }}
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
