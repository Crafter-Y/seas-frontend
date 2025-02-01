import React from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import CustomText from "@/components/elements/CustomText";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";

type Props = {
  color?: string;
  disabled?: boolean;
} & TouchableOpacityProps;

const Button = ({
  children,
  onPress,
  color,
  className,
  disabled = false,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      className={`rounded-xl px-4 py-3 items-center justify-center ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={{
        backgroundColor: disabled ? Color.GRAY : (color ?? Color.BLUE),
      }}
      onPress={onPress}
      {...props}
    >
      {Object.keys(children as object).includes("type") && children}
      {!Object.keys(children as object).includes("type") && (
        <CustomText style={tw`text-white text-lg`}>
          {children}
          {/** Fix for android font issues https://github.com/facebook/react-native/issues/15114 */}
          {Platform.OS === "android" ? " " : undefined}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
