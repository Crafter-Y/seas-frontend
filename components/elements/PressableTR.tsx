import { Pressable, View } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
  onPress: () => void;
};

const TR = ({ children, onPress }: Props) => {
  return (
    <Pressable
      style={tw`flex-row w-full bg-white border-t border-gray-300 h-16`}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

export default TR;
