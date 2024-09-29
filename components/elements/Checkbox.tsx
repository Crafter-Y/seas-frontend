import { Pressable, Text } from "react-native";
import React, { useState } from "react";
import ExpoCheckbox from "expo-checkbox";
import tw from "@/tailwind";

type Props = {
  defaultValue?: boolean;
  label?: string;
  onChange: (state: boolean) => void;
  disabled?: boolean;
};

// TODO: this component should be refactored, so that onChange recieves the correct value and not the inverted - this requires changes in all dependants
const Checkbox = ({
  defaultValue = false,
  label,
  onChange,
  disabled = false,
}: Props) => {
  const [checked, setChecked] = useState(defaultValue);

  return (
    <Pressable
      style={tw`flex-row items-center gap-2 mx-4 mb-1`}
      onPress={() => {
        if (disabled) return;
        setChecked(!checked);
        onChange(checked);
      }}
    >
      <ExpoCheckbox value={checked} disabled={disabled} />
      {label && <Text>{label}</Text>}
    </Pressable>
  );
};

export default Checkbox;
