import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-blue-default rounded-lg min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-40" : ""
      }
      ${isDisabled ? "opacity-40" : ""}
      `}
      disabled={isLoading || isDisabled}
    >
      <Text className={`text-white font-manropeBold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
