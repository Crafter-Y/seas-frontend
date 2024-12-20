import {
  InputModeOptions,
  Platform,
  ReturnKeyTypeOptions,
  TextInput,
  TextInputProps,
} from "react-native";
import React, { forwardRef, useEffect, useState } from "react";
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
  initialValue?: string;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: TextInputProps["autoComplete"];
};

// TODO: there is something wrong with the normal text input #see CreateUserForm - name input is lagging, same on column creation
// NOTE: this only appears on android and only for plain text input - see above
const Input = forwardRef<TextInput, Props>(
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
      initialValue,
      disabled,
      autoComplete,
      maxLength,
    }: Props,
    ref
  ) => {
    const [intVal, setIntVal] = useState("");

    useEffect(() => {
      if (initialValue) setIntVal(initialValue);
    }, [initialValue]);

    return (
      <TextInput
        defaultValue={intVal}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        maxLength={maxLength}
        autoComplete={autoComplete ? autoComplete : undefined}
        autoCapitalize="none"
        keyboardType={secureTextEntry ? "default" : "visible-password"}
        style={tw.style(
          {
            "py-2": Platform.OS == "ios",
            "py-1": Platform.OS != "ios",
            fontSize: 18,
          },
          style,
          "border border-black border-opacity-20 rounded-xl px-2"
        )}
        autoFocus={autoFocus ? autoFocus : false}
        onChangeText={(text) => {
          setIntVal(text);
          onChangeText(text);
        }}
        placeholderTextColor={"gray"}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType ? returnKeyType : "default"}
        ref={ref}
        inputMode={inputMode ?? "text"}
        aria-disabled={disabled}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
