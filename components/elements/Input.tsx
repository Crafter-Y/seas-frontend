import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native";

type Props = {
  initialValue?: string;
  disabled?: boolean;
  ref?: React.Ref<TextInput>;
} & TextInputProps;

// TODO: there is something wrong with the normal text input #see CreateUserForm - name input is lagging, same on column creation
// NOTE: this only appears on android and only for plain text input - see above
// NOTE: 21-01-2025 this seems to be fixed - this note can probably be deleted
const Input = ({
  onChangeText,
  inputMode,
  initialValue,
  secureTextEntry,
  disabled,
  className,
  numberOfLines,
  ref,
  ...props
}: Props) => {
  const [intVal, setIntVal] = useState(initialValue ?? "");

  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    if (initialValue) setIntVal(initialValue);
  }

  return (
    <TextInput
      className={`border border-black border-opacity-20 rounded-xl px-2 py-2 web:py-1 ${className}`}
      style={{ fontSize: 18 }}
      defaultValue={intVal}
      autoCorrect={false}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
      keyboardType={secureTextEntry ? "default" : "visible-password"}
      onChangeText={(text) => {
        setIntVal(text);
        onChangeText?.(text);
      }}
      placeholderTextColor={"gray"}
      ref={ref}
      inputMode={inputMode ?? "text"}
      aria-disabled={disabled}
      numberOfLines={numberOfLines ?? 1}
      {...props}
    />
  );
};

Input.displayName = "Input";
export default Input;
