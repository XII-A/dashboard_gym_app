import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const FormFieldProfile = ({
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

  switch (formType) {
    case "DatePicker":
      const [showDatePicker, setShowDatePicker] = useState(false);
      const [date, setDate] = useState(new Date());
      return (
        <View>
          <View
            className={` flex flex-row justify-between py-4 ${otherStyles}`}
          >
            <Text className="text-base text-white font-manropeMedium">
              {title}
            </Text>
            <TouchableOpacity
              className="flex flex-row"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex flex-row text-blue-text focus:border-blue-default">
                <Text
                  className={` ${
                    value ? "text-blue-text" : "text-blue-text"
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
                  <Text className="text-white font-manropeSemiBold text-base">
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false);
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
                  maximumDate={new Date()}
                />
              </View>
            </Modal>
          )}
          {showDatePicker && Platform.OS === "android" && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (event.type === "set") {
                  const currentDate = selectedDate;
                  setShowDatePicker(false);
                  setDate(currentDate);
                  handleChange(
                    currentDate
                      .toLocaleDateString("en-GB")
                      .split("/")
                      .reverse()
                      .join("-")
                  );
                } else {
                  setShowDatePicker(false);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </View>
      );

    case "Picker":
      const pickerRef = useRef(null);
      const [showPicker, setShowPicker] = useState(false);
      return (
        <View className={`flex flex-row py-5 justify-between ${otherStyles}`}>
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          {Platform.OS === "android" && (
            <TouchableOpacity onPress={() => pickerRef.current?.focus?.()}>
              <View className="flex flex-row text-blue-text focus:border-blue-default">
                <Picker
                  ref={pickerRef}
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
                  mode="dropdown"
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
            </TouchableOpacity>
          )}
          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <View className=" text-blue-text focus:border-blue-default">
                  <Text
                    className={` ${
                      value ? "text-blue-text" : "text-blue-text"
                    } font-manropeSemiBold text-base`}
                  >
                    {value ? value : placeholder}
                  </Text>
                </View>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                visible={showPicker}
                onRequestClose={() => setShowPicker(false)}
                transparent={true}
              >
                <View className="absolute bottom-0 w-full h-1/4 bg-bgColor-primary flex flex-col">
                  <View className="flex flex-row justify-between items-end border-b border-b-white/5 px-4 py-2">
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Feather name="x" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-blue-text font-manropeSemiBold text-base">
                      {title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setShowPicker(false);
                        handleChange(value);
                      }}
                    >
                      {/* check */}
                      <Feather name="check" size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  <Picker selectedValue={value} onValueChange={handleChange}>
                    {rest.options.map((option) => {
                      return (
                        <Picker.Item
                          key={option}
                          label={option}
                          value={option}
                          color="#fff"
                          enabled={true}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </Modal>
            </>
          )}
        </View>
      );
    case "ActionSheetIOS":
      return (
        <View className={`flex flex-row justify-between py-5 ${otherStyles}`}>
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          <TouchableOpacity onPress={rest.onPress}>
            <View className="flex flex-row text-blue-text focus:border-blue-default">
              <Text
                className={` ${
                  value ? "text-blue-text" : "text-blue-text"
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
        <View
          className={`flex flex-row justify-between items-center py-4  ${otherStyles}`}
        >
          <Text className="text-base text-white font-manropeMedium">
            {title}
          </Text>
          <View className="flex flex-row text-blue-text focus:border-blue-default  items-center">
            <TextInput
              className=" text-blue-text font-manropeSemiBold text-base min-w-[50px] max-w-[200px] "
              textAlign="right"
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
                <Text className="text-blue-text font-manropeSemiBold text-base">
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

export default FormFieldProfile;
