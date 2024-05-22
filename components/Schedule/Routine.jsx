import { View, Text } from "react-native";
import React from "react";

const Routine = ({ key }) => {
  return (
    <View key={key} style={{ flex: 1 }}>
      <Text>Routine</Text>
    </View>
  );
};

export default Routine;
