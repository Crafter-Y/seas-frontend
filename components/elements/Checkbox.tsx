import { Text, Pressable } from "react-native";
import React, { useState } from "react";
import ExpoCheckbox from "expo-checkbox";
import tw from "@/tailwind";

type Props = {
  defaultValue?: boolean;
  label: string;
  onChange: (state: boolean) => void;
};

const Checkbox = ({ defaultValue = false, label, onChange }: Props) => {
  const [checked, setChecked] = useState(defaultValue);
  return (
    <Pressable
      style={tw`flex-row items-center gap-2 mx-4 mb-1`}
      onPress={() => {
        setChecked(!checked);
        onChange(checked);
      }}
    >
      <ExpoCheckbox
        value={checked}
        onValueChange={(val) => {
          setChecked(val);
          onChange(checked);
        }}
      />
      <Text>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
