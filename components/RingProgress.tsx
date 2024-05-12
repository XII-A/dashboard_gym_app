import { View, Text } from "react-native";
import { Svg, Circle, CircleProps } from "react-native-svg";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
type RingProgressProps = {
  radius?: number;
  progress: number;
  strokeWidth?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RingProgress = ({
  radius = 100,
  progress = 0.2,
  strokeWidth = 34,
}: RingProgressProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  //   animated value
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withTiming(progress, { duration: 1500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  const circleDefaultProps: CircleProps = {
    r: innerRadius,
    cx: radius,
    cy: radius,
    originX: radius,
    originY: radius,
    strokeWidth: strokeWidth,
    stroke: "#017EA7",
    strokeLinecap: "round",
    fill: "transparent",
  };

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        // backgroundColor: "#1F2937",
      }}
    >
      <Svg>
        {/* background circle */}
        <Circle {...circleDefaultProps} opacity={0.25} />
        {/* progress circle */}
        <AnimatedCircle
          {...circleDefaultProps}
          rotation="-90"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default RingProgress;
