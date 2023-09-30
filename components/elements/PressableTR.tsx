import { Pressable } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
  onPress: () => void;
};

const TR = ({ children, onPress }: Props) => {
  return (
    <Pressable
      style={tw.style({
        minHeight: 64
      }, "flex-row w-full bg-white border-t border-gray-300")}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default TR;
