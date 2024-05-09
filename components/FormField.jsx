import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const FormField = ({
  title,
  value,
  formType,
  handleChange,
  otherStyles,
  keyboardType,
  placeholder,
  inputMode,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  switch (formType) {
    case "DatePicker":
      return (
        <View>
          <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-white font-manropeMedium">
              {title}
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View className="flex flex-row bg-white/5 text-white/90 shadow-sm border border-white/10 h-16 rounded-lg focus:border-blue-default items-center px-4">
                <Text
                  className={`flex-1 ${
                    value ? "text-white/90" : "text-[#64748bd9]"
                  } font-manropeSemiBold text-base`}
                >
                  {value ? value : placeholder}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {showDatePicker && Platform.OS === "ios" && (
            <Modal
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
              transparent={true}
            >
              <View className="absolute bottom-0 w-full h-1/4 bg-bgColor-primary flex">
                <View className="flex flex-row justify-between items-end border-b border-b-white/5 px-4 py-2">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Feather name="x" size={24} color="white" />
                  </TouchableOpacity>
                  <Text className="text-white/90 font-manropeSemiBold text-base">
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false);
                      // format the date so its dd/mm/yyyy
                      handleChange(
                        date
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .reverse()
                          .join("-")
                      );
                    }}
                  >
                    {/* check */}
                    <Feather name="check" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate;
                    setDate(currentDate);
                  }}
                />
              </View>
            </Modal>
          )}
        </View>
      );

    case "Picker":
      return (
        <View className={`space-y-2 ${otherStyles}`}>
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          <View className="flex flex-row bg-white/5 text-white/90 shadow-sm border border-white/10 h-16 rounded-lg focus:border-blue-default items-center px-0">
            <Picker
              selectedValue={value}
              onValueChange={handleChange}
              style={{
                color: `${value ? "white" : "#64748bd9"}`,
                width: "100%",
                padding: 0,
              }}
              dropdownIconColor={"white"}
              selectionColor={"white"}
              placeholder="Select an option"
            >
              <Picker.Item
                label={placeholder}
                value={null}
                enabled={false}
                color="#00A8E8"
              />
              {rest.options.map((option) => {
                return (
                  <Picker.Item
                    key={option}
                    label={option}
                    value={option}
                    color="#000"
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      );
    case "ActionSheetIOS":
      return (
        <View className={`space-y-2 ${otherStyles}`}>
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          <TouchableOpacity onPress={rest.onPress}>
            <View className="flex flex-row bg-white/5 text-white/90 shadow-sm border border-white/10 h-16 rounded-lg focus:border-blue-default items-center px-4">
              <Text
                className={`flex-1 ${
                  value ? "text-white/90" : "text-[#64748bd9]"
                } font-manropeSemiBold text-base`}
              >
                {value ? value : placeholder}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    default:
      return (
        <View className={`space-y-2 ${otherStyles}`}>
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          <View className="flex flex-row bg-white/5 text-white/90 shadow-sm border border-white/10 h-16 rounded-lg focus:border-blue-default items-center px-4">
            <TextInput
              className="flex-1 text-white/90 font-manropeSemiBold text-base"
              value={value}
              placeholder={placeholder}
              placeholderTextColor={"#64748bd9"}
              onChangeText={handleChange}
              secureTextEntry={title === "Password" && !showPassword}
              keyboardType={keyboardType}
              autoCapitalize="none"
              inputMode={inputMode ? inputMode : "text"}
            />
            {title === "Password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-white/90 font-manropeSemiBold text-base">
                  {showPassword ? (
                    <Feather name="eye-off" size={24} color="white" />
                  ) : (
                    <Feather name="eye" size={24} color="white" className="" />
                  )}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
  }
};

export default FormField;
