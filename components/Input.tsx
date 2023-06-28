import {
  TextInput,
  Platform,
  ReturnKeyTypeOptions,
  InputModeOptions,
} from "react-native";
import React, { forwardRef } from "react";
import tw from "@/tailwind";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  placeholder: string;
  autoFocus?: boolean;
  onChangeText: (text: string) => void;
  style?: ClassInput;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  inputMode?: InputModeOptions;
};

export default forwardRef<TextInput, Props>(
  (
    {
      placeholder,
      autoFocus,
      onChangeText,
      style,
      secureTextEntry,
      onSubmitEditing,
      returnKeyType,
      inputMode,
    }: Props,
    ref
  ) => {
    return (
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType={secureTextEntry ? "default" : "visible-password"}
        style={tw.style(
          {
            "py-2": Platform.OS == "ios",
            "py-1": Platform.OS != "ios",
            fontSize: 18,
          },
          style,
          `border border-black border-opacity-20 rounded-xl px-2`
        )}
        autoFocus={autoFocus ? autoFocus : false}
        onChangeText={onChangeText}
        placeholderTextColor={"gray"}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType ? returnKeyType : "default"}
        ref={ref}
        blurOnSubmit={false}
        inputMode={inputMode}
      ></TextInput>
    );
  }
);
