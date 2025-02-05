import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Color } from "@/helpers/Constants";

type Props = {
  color?: string;
  disabled?: boolean;
} & TouchableOpacityProps;

const SettingsActionButton = ({
  color,
  className,
  disabled = false,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={`rounded-xl p-[10px] items-center justify-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={{
        backgroundColor: disabled ? Color.GRAY : (color ?? Color.BLUE),
      }}
      {...props}
    />
  );
};

export default SettingsActionButton;
