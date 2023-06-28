import React, { ReactNode } from "react";
import tw from "@/tailwind";
import { Button as RNButton } from "@rneui/base";

type Props = {
  children: ReactNode;
  onPress: () => void;
};

const Button = ({ children, onPress }: Props) => {
  return (
    <RNButton
      style={tw`bg-blueAccent rounded-xl text-xl px-4 py-1 font-semibold`}
      color={"#3882d6"}
      onPress={onPress}
    >
      {children}
    </RNButton>
  );
};

export default Button;
