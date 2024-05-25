import { View } from "react-native";
import { Svg, Circle, CircleProps, SvgProps, Path } from "react-native-svg";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
type RingProgressProps = {
  radius?: number;
  progress: number;
  strokeWidth?: number;
  strokeColor?: string;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RightArrow = (props: SvgProps) => (
  <Path
    fill="#fff"
    fillRule="evenodd"
    d="M12.293 4.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414-1.414L17.586 13H4a1 1 0 1 1 0-2h13.586l-5.293-5.293a1 1 0 0 1 0-1.414Z"
    clipRule="evenodd"
    {...props}
  />
);

const RingProgress = ({
  radius = 86,
  progress,
  strokeWidth = 34,
  strokeColor = "#03a6dc",
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
    stroke: strokeColor,
    strokeLinecap: "round",
    fill: "transparent",
  };

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
      }}
    >
      <Svg
        style={{
          position: "relative",
        }}
      >
        {/* background circle */}
        <Circle {...circleDefaultProps} opacity={0.25} />
        {/* progress circle */}
        <AnimatedCircle
          {...circleDefaultProps}
          rotation="-90"
          animatedProps={animatedProps}
        />

        {/* arrow to indicate the end of the circle */}
        <RightArrow
          x={radius - 10}
          y={strokeWidth / 2 - 12}
          width={20}
          height={20}
        />
      </Svg>
    </View>
  );
};

export default RingProgress;
