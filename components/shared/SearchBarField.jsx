import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React, { useRef } from "react";

const SearchBarField = ({
  value,
  setValue,
  handleSearch,
  loading,
  placeholder,
  disabled,
  outSideRef,
}) => {
  const inputRef = useRef(null);
  return (
    <View className="flex flex-row items-center px-4 mt-4">
      <View className="group flex flex-1 flex-row items-center bg-white/5 text-white/90 shadow-sm border border-white/10 h-11 rounded-md focus:border-blue-default pl-4 ">
        <TextInput
          className="text-white/90 font-manropeSemiBold text-base flex-1 "
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#64748bd9"}
          onChangeText={(text) => {
            setValue(text);
          }}
          keyboardType={"default"}
          autoCapitalize="none"
          inputMode={"text"}
          returnKeyType={"search"}
          onSubmitEditing={() => {
            if (value.length > 0) {
              handleSearch();
              setValue("");
            }
            inputRef.current.blur();
          }}
          ref={(el) => {
            inputRef.current = el;

            if (outSideRef) {
              outSideRef.current = el;
            }
          }}
          editable={!disabled}
        />
        <TouchableOpacity
          onPress={() => {
            setValue("");
          }}
          className={`${
            value.length > 0 ? "opacity-100" : "opacity-0"
          } transition-all duration-300 ease-in-out`}
        >
          <Feather name="x" size={20} color="#64748bd9" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleSearch();
            setValue("");
            inputRef.current.blur();
          }}
          disabled={value.length === 0}
          className={`h-11 px-4 ml-2  items-center justify-center  transition-colors  duration-300 ease-in-out rounded-r-md
            ${value.length > 0 ? "bg-blue-default" : "bg-transparent"}
          `}
        >
          {!loading && (
            <AntDesign
              name="search1"
              size={20}
              color={value.length > 0 ? "#fff" : "#64748bd9"}
            />
          )}
          {loading && <ActivityIndicator size="small" color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBarField;
