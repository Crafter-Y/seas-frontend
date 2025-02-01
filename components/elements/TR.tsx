import React, { ReactNode } from "react";
import { View } from "react-native";

import tw from "@/tailwind";

type Props = {
  children?: ReactNode;
};

const TR = ({ children }: Props) => {
  return (
    <View style={tw`flex-row w-full bg-white border-t border-gray-300`}>
      {children}
    </View>
  );
};

export default TR;
