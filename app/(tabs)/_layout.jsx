import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { icons } from "../../constants";
import { StatusBar } from "expo-status-bar";
// import overview from "../../assets/icons/overview.png";
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`text-xs  ${
          focused ? "text-blue-text " : "text-[#C4C4C4] "
        }`}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#0D1013",
            borderTopWidth: 1,
            borderTopColor: "#0D1013",
            height: 85,
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#00A8E8",
          tabBarInactiveTintColor: "#C4C4C4",
        }}
      >
        <Tabs.Screen
          name="overview"
          options={{
            title: "Overview",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.overview}
                  color={color}
                  focused={focused}
                  name="Overview"
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="dietPlan"
          options={{
            title: "Diet Plan",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.notepad}
                  color={color}
                  focused={focused}
                  name="Diet"
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="mySchedule"
          options={{
            title: "Schedule",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.calendar}
                  color={color}
                  focused={focused}
                  name="Schedule"
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "progress",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => {
              return (
                <TabIcon
                  icon={icons.bars}
                  color={color}
                  focused={focused}
                  name="Progress"
                />
              );
            },
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </>
  );
};

export default TabsLayout;
