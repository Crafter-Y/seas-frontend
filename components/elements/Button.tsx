import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { Button as RNButton } from "@rneui/base";
import { ClassInput } from "twrnc/dist/esm/types";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  color?: string;
  style?: ClassInput;
};

const Button = ({ children, onPress, color, style }: Props) => {
  return (
    <RNButton
      style={tw.style(
        `rounded-xl text-xl px-4 py-1 font-semibold`,
        {
          backgroundColor: color ? color : "#3882d6",
        },
        style
      )}
      color={color ? color : "#3882d6"}
      onPress={onPress}
    >
      {children}
    </RNButton>
  );
};

export default Button;
