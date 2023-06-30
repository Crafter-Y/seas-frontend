import { View, Text } from "react-native";
import React, { ReactNode } from "react";
import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
};

const TD = ({ children }: Props) => {
  return <View style={tw`flex-grow flex-shrink basis-full`}>{children}</View>;
};

export default TD;
